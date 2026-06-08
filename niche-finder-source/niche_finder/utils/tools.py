"""
自定义工具 - 供Agent使用
"""
from crewai.tools import tool
from tavily import TavilyClient
from typing import List, Dict, Any
import json
import asyncio

# 全局Tavily客户端
_tavily_client = None


def get_tavily_client(api_key: str = None):
    """获取Tavily客户端"""
    global _tavily_client
    if _tavily_client is None:
        from ..config.settings import TAVILY_CONFIG
        api_key = api_key or TAVILY_CONFIG["api_key"]
        _tavily_client = TavilyClient(api_key=api_key)
    return _tavily_client


@tool("Web Search")
def web_search(query: str, max_results: int = 5) -> str:
    """
    搜索互联网获取最新信息。适用于市场调研、竞品分析、新闻资讯等。
    
    Args:
        query: 搜索关键词，越具体越好
        max_results: 返回结果数量，默认5条
    
    Returns:
        搜索结果的文本摘要
    """
    try:
        client = get_tavily_client()
        result = client.search(
            query=query,
            max_results=max_results,
            search_depth="advanced",
            include_answer=True,
            include_raw_content=True,
        )
        
        # 格式化输出
        output = f"## 搜索结果: {query}\n\n"
        
        if result.get("answer"):
            output += f"**摘要**: {result['answer']}\n\n"
        
        output += "### 来源:\n"
        for i, doc in enumerate(result.get("results", []), 1):
            output += f"{i}. **{doc.get('title', '无标题')}**\n"
            output += f"   URL: {doc.get('url', '')}\n"
            output += f"   摘要: {doc.get('content', '')[:300]}...\n\n"
        
        return output
    
    except Exception as e:
        return f"搜索出错: {str(e)}"


@tool("Deep Research")
def deep_research(topic: str, focus_areas: str = None) -> str:
    """
    对某个主题进行深度研究，生成结构化的研究报告。
    适用于需要全面深入了解的主题。
    
    Args:
        topic: 研究主题，描述越详细越好
        focus_areas: 可选，重点关注的领域，用逗号分隔
    
    Returns:
        结构化的深度研究报告
    """
    try:
        # 动态导入，避免启动慢
        from gpt_researcher import GPTResearcher
        
        # 构建查询
        query = topic
        if focus_areas:
            query += f"。重点关注：{focus_areas}"
        
        # 运行研究
        researcher = GPTResearcher(
            query=query,
            report_type="research_report",
            report_source="web",
            verbose=False,
            max_subtopics=3,
        )
        
        # 异步转同步
        import asyncio
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            result = loop.run_until_complete(researcher.conduct_research())
            report = loop.run_until_complete(researcher.write_report())
        finally:
            loop.close()
        
        return report
    
    except Exception as e:
        return f"深度研究出错: {str(e)}\n\n建议使用Web Search工具进行分步研究。"


@tool("Competitor Analysis")
def competitor_analysis(market: str, product_type: str) -> str:
    """
    分析特定市场的竞争格局，找出主要玩家、他们的优劣势。
    
    Args:
        market: 目标市场，如'AI写作工具市场
        product_type: 产品类型，如'SaaS'
    
    Returns:
        竞争格局分析报告
    """
    search_query = f"{market} 主要竞争对手 优劣势分析 {product_type}"
    
    # 先用web_search搜索
    result = web_search.run(search_query)
    
    # 补充更多角度的搜索
    additional_queries = [
        f"{market} top 10 companies 2025",
        f"{market} 市场份额 竞争格局",
    ]
    
    for q in additional_queries:
        try:
            result += "\n---\n" + web_search.run(q)
        except:
            pass
    
    return result


# ==================== 工具集合 ====================

def get_all_tools():
    """获取所有可用工具"""
    return [
        web_search,
        competitor_analysis,
        deep_research,
    ]


def get_basic_tools():
    """获取基础工具（不含深度研究）"""
    return [
        web_search,
        competitor_analysis,
    ]
