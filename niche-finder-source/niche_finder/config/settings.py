"""
配置文件 - AI利基产品发现器
v1.4 - 修复LLM配置，确保环境变量正确加载
"""
import os
from typing import Optional

# 先从环境变量获取API Key（支持多种变量名）
SENSENOVA_API_KEY = os.environ.get("SENSENOVA_API_KEY", os.environ.get("OPENAI_API_KEY", ""))
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY", "")

# 设置OpenAI兼容格式的环境变量（CrewAI需要）
if SENSENOVA_API_KEY:
    os.environ["OPENAI_API_KEY"] = SENSENOVA_API_KEY
    os.environ["OPENAI_BASE_URL"] = "https://token.sensenova.cn/v1"

# ==================== LLM配置 ====================
LLM_CONFIG = {
    "model": "deepseek-v4-flash",
    "temperature": 0.4,
    "max_tokens": 4096,
    "api_key": SENSENOVA_API_KEY,
    "base_url": "https://token.sensenova.cn/v1",
}

# ==================== 搜索配置 ====================
TAVILY_CONFIG = {
    "api_key": TAVILY_API_KEY,
    "max_results": 8,
    "search_depth": "advanced",
}

# ==================== Embedding配置 ====================
EMBEDDING_CONFIG = {
    "provider": "tfidf",  # 临时使用本地TF-IDF
    "model": "local",
}

# ==================== GPT Researcher配置 ====================
GPTR_CONFIG = {
    "report_type": "research_report",
    "report_source": "web",
    "max_subtopics": 4,
    "verbose": True,
}

# ==================== 输出配置 ====================
OUTPUT_CONFIG = {
    "report_format": "markdown",
    "save_to_file": True,
    "output_dir": "./output",
}


def get_llm_model():
    """获取LLM模型名称（用于CrewAI）"""
    return LLM_CONFIG["model"]


def get_llm_config_dict():
    """获取LLM配置字典"""
    return {
        "model": LLM_CONFIG["model"],
        "temperature": LLM_CONFIG["temperature"],
        "max_tokens": LLM_CONFIG["max_tokens"],
    }


def validate_config():
    """验证配置完整性"""
    errors = []
    
    if not SENSENOVA_API_KEY:
        errors.append("LLM API Key 未配置 (请设置 SENSENOVA_API_KEY 或 OPENAI_API_KEY 环境变量)")
    
    if not TAVILY_CONFIG["api_key"]:
        errors.append("Tavily API Key 未配置 (请设置 TAVILY_API_KEY 环境变量)")
    
    return errors
