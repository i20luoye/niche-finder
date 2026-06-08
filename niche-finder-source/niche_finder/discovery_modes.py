"""
三大发现模式 - AI利基产品发现器
v1.3 - 使用专属Crew，两阶段流程（发现 + 评估）
"""
from .crew import NicheFinderCrew
from crewai import Crew, Process
from typing import List, Dict
import json


class DiscoveryModes:
    """三大发现模式实现"""
    
    def __init__(self):
        self.crew_factory = NicheFinderCrew()
    
    # ==================== 蓝海模式 ====================
    def blue_ocean_mode(self, domain: str, constraints: dict = None) -> str:
        """
        蓝海模式：在指定领域中寻找低竞争、高增长的空白市场机会
        
        两阶段流程：
        1. 机会发现专家扫描市场，生成3-5个候选蓝海机会
        2. 首席评审官对机会进行评估排序，给出Top推荐
        
        Args:
            domain: 领域方向，如"AI工具"、"开发者服务"、"中小企业SaaS"
            constraints: 约束条件，如预算、时间、技能等
        
        Returns:
            蓝海机会分析报告（含排名和推荐）
        """
        crew = self.crew_factory.blue_ocean_crew(domain, constraints)
        result = crew.kickoff()
        return str(result)
    
    # ==================== 红海细分模式 ====================
    def red_ocean_niche_mode(self, big_market: str, angle: str = "未被满足的需求") -> str:
        """
        红海细分模式：在已经很拥挤的大市场中，找到未被满足的细分需求
        
        两阶段流程：
        1. 机会发现专家深入分析红海，找到3-5个细分缝隙
        2. 首席评审官评估排序，找出最值得切入的细分方向
        
        Args:
            big_market: 大市场方向，如"AI写作"、"项目管理工具"、"CRM"
            angle: 寻找角度，如"未被满足的需求"、"特定用户群"、"特定场景"
        
        Returns:
            红海细分机会分析报告
        """
        crew = self.crew_factory.red_ocean_niche_crew(big_market, angle)
        result = crew.kickoff()
        return str(result)
    
    # ==================== 跨界机会模式 ====================
    def cross_domain_mode(self, domain_a: str, domain_b: str) -> str:
        """
        跨界机会模式：寻找两个领域交叉融合产生的新产品机会
        
        两阶段流程：
        1. 机会发现专家探索跨界可能性，生成3-5个跨界创意
        2. 首席评审官评估排序，选出最有商业价值的方向
        
        Args:
            domain_a: 领域A，如"AI"
            domain_b: 领域B，如"健身"
        
        Returns:
            跨界机会分析报告
        """
        crew = self.crew_factory.cross_domain_crew(domain_a, domain_b)
        result = crew.kickoff()
        return str(result)
    
    # ==================== 机会排行榜模式 ====================
    def opportunity_ranking_mode(self, ideas: List[str]) -> str:
        """
        机会排行榜：对多个候选方向进行对比评估，给出优先级排序
        
        流程：
        1. 对每个方向做快速扫描（市场 + 竞争）
        2. 首席评审官综合所有结果，给出排名
        
        Args:
            ideas: 候选方向列表
        
        Returns:
            排行榜分析报告
        """
        # 先对每个方向做快速扫描，收集信息
        # （简化实现：把所有idea整合后交给评审员做综合评估）
        
        all_ideas_text = "\n".join([f"{i+1}. {idea}" for i, idea in enumerate(ideas)])
        
        # 使用full_analysis的任务框架，但只需要评审员做综合评估
        # 这里直接构造一个分析任务
        from .agents.niche_agents import NicheFinderAgents
        from .tasks.niche_tasks import NicheFinderTasks
        
        agents = NicheFinderAgents()
        tasks = NicheFinderTasks()
        
        chief_reviewer = agents.chief_reviewer()
        ranking_task = tasks.opportunity_ranking_task(chief_reviewer, all_ideas_text)
        
        crew = Crew(
            agents=[chief_reviewer],
            tasks=[ranking_task],
            process=Process.sequential,
            verbose=True,
            max_rpm=30,
        )
        
        result = crew.kickoff()
        return str(result)
    
    # ==================== 单产品深度分析 ====================
    def deep_analysis(self, product_idea: str, target_audience: str = None) -> str:
        """
        对单个产品方向进行深度四维分析
        
        Args:
            product_idea: 产品想法描述
            target_audience: 目标用户（可选）
        
        Returns:
            完整的四维分析报告 + 评审结论
        """
        crew = self.crew_factory.full_analysis_crew(product_idea, target_audience)
        result = crew.kickoff()
        return str(result)
