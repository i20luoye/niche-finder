"""
GPT Researcher 深度研究模块
v1.0 - 深度集成GPT Researcher到利基发现流程
"""
import asyncio
import os
from typing import List, Dict, Optional


class DeepResearchEngine:
    """
    深度研究引擎 - 基于GPT Researcher
    用于对特定机会点进行全网深度调研
    """
    
    def __init__(self):
        self.gptr_available = self._check_gptr()
    
    def _check_gptr(self) -> bool:
        """检查GPT Researcher是否可用"""
        try:
            from gpt_researcher import GPTResearcher
            return True
        except ImportError:
            return False
    
    def research_opportunity(self, opportunity_name: str, opportunity_desc: str, 
                            focus_areas: List[str] = None) -> str:
        """
        对单个机会点进行深度研究
        
        Args:
            opportunity_name: 机会名称
            opportunity_desc: 机会描述
            focus_areas: 重点关注领域列表
        
        Returns:
            深度研究报告（Markdown格式）
        """
        if not self.gptr_available:
            return "⚠️ GPT Researcher 未安装，无法进行深度研究"
        
        # 构建研究查询
        query = f"""
        深度研究以下创业机会的市场现状、竞争格局和用户需求：
        
        【机会名称】{opportunity_name}
        【机会描述】{opportunity_desc}
        
        请重点调研：
        1. 市场规模和增长趋势（有数据支撑）
        2. 主要竞争对手和他们的产品/定价/优缺点
        3. 用户的真实痛点和需求（从论坛、评论、社交媒体等渠道收集）
        4. 行业最新趋势和技术发展
        5. 成功案例和失败案例分析
        """
        
        if focus_areas:
            query += f"\n额外关注：{', '.join(focus_areas)}"
        
        # 运行深度研究
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                from gpt_researcher import GPTResearcher
                
                researcher = GPTResearcher(
                    query=query,
                    report_type="research_report",
                    report_source="web",
                    verbose=False,
                    max_subtopics=5,
                )
                
                # 执行研究
                loop.run_until_complete(researcher.conduct_research())
                
                # 生成报告
                report = loop.run_until_complete(researcher.write_report())
                
                return report
            finally:
                loop.close()
        except Exception as e:
            return f"❌ 深度研究失败: {str(e)}"
    
    def research_competitors(self, market: str, product_type: str) -> str:
        """
        深度研究特定市场的竞争格局
        
        Args:
            market: 目标市场
            product_type: 产品类型
        
        Returns:
            竞争格局研究报告
        """
        if not self.gptr_available:
            return "⚠️ GPT Researcher 未安装"
        
        query = f"""
        全面分析{market}市场的{product_type}产品竞争格局。
        
        请调研：
        1. 市场上主要玩家有哪些？分别的市场份额/定位/定价是怎样的？
        2. 每个主要玩家的优势和劣势分别是什么？
        3. 用户对这些产品的评价如何？好评和差评分别集中在什么地方？
        4. 这个市场的进入壁垒有哪些？技术/品牌/数据/合规？
        5. 有没有新晋玩家或创新模式在崛起？
        6. 这个市场的空白地带在哪里？有什么需求没有被满足？
        
        请用数据和具体案例支撑你的分析，引用来源URL。
        """
        
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                from gpt_researcher import GPTResearcher
                
                researcher = GPTResearcher(
                    query=query,
                    report_type="research_report",
                    report_source="web",
                    verbose=False,
                    max_subtopics=4,
                )
                
                loop.run_until_complete(researcher.conduct_research())
                report = loop.run_until_complete(researcher.write_report())
                
                return report
            finally:
                loop.close()
        except Exception as e:
            return f"❌ 竞争研究失败: {str(e)}"
    
    def research_user_painpoints(self, product_category: str, target_users: str) -> str:
        """
        深度研究特定用户群体的痛点
        
        Args:
            product_category: 产品类别
            target_users: 目标用户群
        
        Returns:
            用户痛点研究报告
        """
        if not self.gptr_available:
            return "⚠️ GPT Researcher 未安装"
        
        query = f"""
        深度调研{target_users}在使用{product_category}产品时的真实痛点和需求。
        
        请从以下渠道收集信息：
        - Reddit、Hacker News、知乎、小红书等社区讨论
        - App Store、Google Play、G2、Product Hunt等产品评论
        - 用户博客、播客、YouTube视频
        - 行业报告和调研数据
        
        请回答：
        1. 用户最常抱怨的Top 5问题是什么？
        2. 用户在用什么"土办法"或"组合方案"解决这些问题？
        3. 用户愿意为什么样的解决方案付费？心理价位是多少？
        4. 有哪些需求是用户自己都没有明确说出来的"隐性需求"？
        5. 用户获取这类新产品的主要渠道是什么？
        
        引用真实的用户评论和讨论内容作为例证，标注来源。
        """
        
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                from gpt_researcher import GPTResearcher
                
                researcher = GPTResearcher(
                    query=query,
                    report_type="research_report",
                    report_source="web",
                    verbose=False,
                    max_subtopics=4,
                )
                
                loop.run_until_complete(researcher.conduct_research())
                report = loop.run_until_complete(researcher.write_report())
                
                return report
            finally:
                loop.close()
        except Exception as e:
            return f"❌ 用户痛点研究失败: {str(e)}"
