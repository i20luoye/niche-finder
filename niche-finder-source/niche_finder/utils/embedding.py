"""
Embedding 方案管理器
v1.0 - 支持多种Embedding后端，自动降级

支持的方案：
1. 智谱AI Embedding (国内可用)
2. 阿里云通义千问 Embedding (国内可用)
3. 本地模型 (sentence-transformers)
4. TF-IDF 关键词相似度 (兜底方案)
"""

import os
import json
from typing import List, Optional
from abc import ABC, abstractmethod


class EmbeddingProvider(ABC):
    """Embedding提供者基类"""
    
    @abstractmethod
    def embed(self, text: str) -> List[float]:
        """生成单个文本的embedding"""
        pass
    
    @abstractmethod
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """批量生成embedding"""
        pass
    
    @abstractmethod
    def similarity(self, text1: str, text2: str) -> float:
        """计算两个文本的相似度"""
        pass
    
    @property
    @abstractmethod
    def dimension(self) -> int:
        """向量维度"""
        pass
    
    @property
    @abstractmethod
    def name(self) -> str:
        """提供者名称"""
        pass


class TfidfEmbedding(EmbeddingProvider):
    """TF-IDF 关键词相似度 - 兜底方案"""
    
    def __init__(self):
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
        import numpy as np
        
        self._vectorizer = None
        self._np = np
        self._cosine_similarity = cosine_similarity
        self._TfidfVectorizer = TfidfVectorizer
        self._vocab = {}
        self._idf = {}
    
    @property
    def name(self) -> str:
        return "tfidf"
    
    @property
    def dimension(self) -> int:
        return len(self._vocab) if self._vocab else 100  # 默认维度
    
    def _build_vectorizer(self, texts: List[str] = None):
        """构建TF-IDF向量化器"""
        if self._vectorizer is None:
            self._vectorizer = self._TfidfVectorizer(
                max_features=1000,
                stop_words=None,  # 中文需要自定义停用词
                ngram_range=(1, 2),
            )
            if texts:
                self._vectorizer.fit(texts)
                self._vocab = self._vectorizer.vocabulary_
    
    def embed(self, text: str) -> List[float]:
        self._build_vectorizer([text])
        vector = self._vectorizer.transform([text])
        return vector.toarray()[0].tolist()
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        self._build_vectorizer(texts)
        vectors = self._vectorizer.transform(texts)
        return vectors.toarray().tolist()
    
    def similarity(self, text1: str, text2: str) -> float:
        self._build_vectorizer([text1, text2])
        v1 = self._vectorizer.transform([text1])
        v2 = self._vectorizer.transform([text2])
        return float(self._cosine_similarity(v1, v2)[0][0])


class ZhipuEmbedding(EmbeddingProvider):
    """智谱AI Embedding - 国内可用"""
    
    BASE_URL = "https://open.bigmodel.cn/api/paas/v4/embeddings"
    MODEL = "embedding-3"
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.environ.get("ZHIPU_API_KEY", "")
        self._dimension = 1024  # embedding-3 的维度
    
    @property
    def name(self) -> str:
        return "zhipu"
    
    @property
    def dimension(self) -> int:
        return self._dimension
    
    def _call_api(self, texts: List[str]) -> List[List[float]]:
        import requests
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        
        payload = {
            "model": self.MODEL,
            "input": texts,
        }
        
        response = requests.post(
            self.BASE_URL,
            headers=headers,
            json=payload,
            timeout=30,
        )
        
        if response.status_code != 200:
            raise Exception(f"智谱API调用失败: {response.status_code} {response.text}")
        
        data = response.json()
        # 按索引排序，确保顺序正确
        embeddings = sorted(data["data"], key=lambda x: x["index"])
        return [e["embedding"] for e in embeddings]
    
    def embed(self, text: str) -> List[float]:
        if not self.api_key:
            raise Exception("智谱API Key未配置")
        return self._call_api([text])[0]
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        if not self.api_key:
            raise Exception("智谱API Key未配置")
        # 智谱API支持批量，单次最多200条
        all_embeddings = []
        batch_size = 50
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i+batch_size]
            embeddings = self._call_api(batch)
            all_embeddings.extend(embeddings)
        return all_embeddings
    
    def similarity(self, text1: str, text2: str) -> float:
        embeddings = self._call_api([text1, text2])
        import numpy as np
        v1 = np.array(embeddings[0])
        v2 = np.array(embeddings[1])
        return float(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))


class DashScopeEmbedding(EmbeddingProvider):
    """阿里云通义千问 Embedding - 国内可用"""
    
    BASE_URL = "https://dashscope.aliyuncs.com/api/v1/services/embeddings/text-embedding/text-embedding"
    MODEL = "text-embedding-v3"
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.environ.get("DASHSCOPE_API_KEY", "")
        self._dimension = 1024
    
    @property
    def name(self) -> str:
        return "dashscope"
    
    @property
    def dimension(self) -> int:
        return self._dimension
    
    def _call_api(self, texts: List[str]) -> List[List[float]]:
        import requests
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        
        payload = {
            "model": self.MODEL,
            "input": {
                "texts": texts,
            },
            "parameters": {
                "text_type": "document",
            }
        }
        
        response = requests.post(
            self.BASE_URL,
            headers=headers,
            json=payload,
            timeout=30,
        )
        
        if response.status_code != 200:
            raise Exception(f"通义千问API调用失败: {response.status_code} {response.text}")
        
        data = response.json()
        embeddings = sorted(data["output"]["embeddings"], key=lambda x: x["text_index"])
        return [e["embedding"] for e in embeddings]
    
    def embed(self, text: str) -> List[float]:
        if not self.api_key:
            raise Exception("通义千问API Key未配置")
        return self._call_api([text])[0]
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        if not self.api_key:
            raise Exception("通义千问API Key未配置")
        all_embeddings = []
        batch_size = 25
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i+batch_size]
            embeddings = self._call_api(batch)
            all_embeddings.extend(embeddings)
        return all_embeddings
    
    def similarity(self, text1: str, text2: str) -> float:
        embeddings = self._call_api([text1, text2])
        import numpy as np
        v1 = np.array(embeddings[0])
        v2 = np.array(embeddings[1])
        return float(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))


class LocalEmbedding(EmbeddingProvider):
    """本地Embedding模型 - 使用sentence-transformers"""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self._model = None
        self._dimension = 384  # all-MiniLM-L6-v2 的维度
    
    @property
    def name(self) -> str:
        return f"local:{self.model_name}"
    
    @property
    def dimension(self) -> int:
        return self._dimension
    
    def _load_model(self):
        if self._model is None:
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer(self.model_name)
            self._dimension = self._model.get_sentence_embedding_dimension()
    
    def embed(self, text: str) -> List[float]:
        self._load_model()
        return self._model.encode(text).tolist()
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        self._load_model()
        return self._model.encode(texts).tolist()
    
    def similarity(self, text1: str, text2: str) -> float:
        self._load_model()
        import numpy as np
        v1 = self._model.encode(text1)
        v2 = self._model.encode(text2)
        return float(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))


class EmbeddingManager:
    """Embedding管理器 - 自动选择可用的最佳方案"""
    
    def __init__(self, preferred_provider: str = None):
        self.providers = []
        self._active_provider = None
        self._init_providers(preferred_provider)
    
    def _init_providers(self, preferred: str = None):
        """初始化提供者，按优先级排序"""
        
        # 1. 优先尝试智谱AI（如果有API Key）
        if preferred == "zhipu" or os.environ.get("ZHIPU_API_KEY"):
            try:
                provider = ZhipuEmbedding()
                # 简单测试一下是否可用
                # provider.embed("test")  # 先不测试，避免浪费token
                self.providers.append(provider)
                print(f"✅ 已加载智谱Embedding")
            except Exception as e:
                print(f"⚠️ 智谱Embedding加载失败: {e}")
        
        # 2. 通义千问
        if preferred == "dashscope" or os.environ.get("DASHSCOPE_API_KEY"):
            try:
                provider = DashScopeEmbedding()
                self.providers.append(provider)
                print(f"✅ 已加载通义千问Embedding")
            except Exception as e:
                print(f"⚠️ 通义千问Embedding加载失败: {e}")
        
        # 3. 本地模型（如果已安装）
        if preferred == "local":
            try:
                provider = LocalEmbedding()
                # 不预加载，首次使用再加载
                self.providers.append(provider)
                print(f"✅ 已添加本地Embedding支持")
            except Exception as e:
                print(f"⚠️ 本地Embedding加载失败: {e}")
        
        # 4. TF-IDF兜底
        try:
            provider = TfidfEmbedding()
            self.providers.append(provider)
            print(f"✅ 已加载TF-IDF Embedding (兜底)")
        except Exception as e:
            print(f"❌ TF-IDF Embedding加载失败: {e}")
            # 尝试安装scikit-learn
            print("正在安装 scikit-learn...")
            import subprocess
            subprocess.run(["pip", "install", "scikit-learn"], capture_output=True)
            try:
                provider = TfidfEmbedding()
                self.providers.append(provider)
                print(f"✅ TF-IDF Embedding安装成功")
            except:
                print(f"❌ 无法加载任何Embedding方案")
    
    @property
    def active_provider(self) -> EmbeddingProvider:
        """获取当前可用的最佳提供者"""
        if self._active_provider is None and self.providers:
            self._active_provider = self.providers[0]
        return self._active_provider
    
    def embed(self, text: str) -> List[float]:
        """生成embedding，自动尝试可用方案"""
        for provider in self.providers:
            try:
                result = provider.embed(text)
                self._active_provider = provider
                return result
            except Exception as e:
                print(f"⚠️ {provider.name} 不可用: {e}，尝试下一个方案")
                continue
        
        raise Exception("没有可用的Embedding方案")
    
    def similarity(self, text1: str, text2: str) -> float:
        """计算相似度"""
        for provider in self.providers:
            try:
                result = provider.similarity(text1, text2)
                self._active_provider = provider
                return result
            except Exception as e:
                print(f"⚠️ {provider.name} 不可用: {e}，尝试下一个方案")
                continue
        
        raise Exception("没有可用的Embedding方案")
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """批量生成embedding"""
        for provider in self.providers:
            try:
                result = provider.embed_batch(texts)
                self._active_provider = provider
                return result
            except Exception as e:
                print(f"⚠️ {provider.name} 不可用: {e}，尝试下一个方案")
                continue
        
        raise Exception("没有可用的Embedding方案")


# 全局单例
_embedding_manager = None


def get_embedding_manager(preferred_provider: str = None) -> EmbeddingManager:
    """获取Embedding管理器单例"""
    global _embedding_manager
    if _embedding_manager is None:
        _embedding_manager = EmbeddingManager(preferred_provider)
    return _embedding_manager
