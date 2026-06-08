"""
Crew编排 - AI利基产品发现器
v1.3 - 三大模式专属Crew，机会发现 + 深度评估两阶段流程
"""
from crewai import Crew, Process
from .agents.niche_agents import NicheFinderAgents
from .tasks.niche_tasks import NicheFinderTasks


class NicheFinderCrew:
    """利基产品发现器Crew"""
    
    def __init__(self):
        self.agents = NicheFinderAgents()
        self.tasks = NicheFinderTasks()
    
    # ==================== 蓝海模式专属Crew ====================
    
    def blue_ocean_crew(self, domain: str, constraints: dict = None) -> Crew:
        """
        蓝海模式Crew - 两阶段流程
        阶段1：机会发现专家生成3-5个蓝海机会
        阶段2：首席评审官对机会进行评估排序
        """
        # Agent
        discovery_expert = self.agents.opportunity_discovery_expert()
        chief_reviewer = self.agents.chief_reviewer()
        
        # 任务1：发现蓝海机会
        discovery_task = self.tasks.blue_ocean_discovery_task(
            discovery_expert, domain, constraints
        )
        
        # 任务2：评审排序
        ranking_task = self.tasks.opportunity_ranking_task(
            chief_reviewer,
            "{discovery_task_output}"  # 会被自动替换
        )
        ranking_task.context = [discovery_task]
        
        return Crew(
            agents=[discovery_expert, chief_reviewer],
            tasks=[discovery_task, ranking_task],
            process=Process.sequential,
            verbose=True,
            memory=False,
            max_rpm=50,
        )
    
    # ==================== 红海细分模式专属Crew ====================
    
    def red_ocean_niche_crew(self, big_market: str, angle: str = "未被满足的需求") -> Crew:
        """
        红海细分模式Crew - 两阶段流程
        阶段1：机会发现专家在红海中找细分机会
        阶段2：首席评审官评估排序
        """
        discovery_expert = self.agents.opportunity_discovery_expert()
        chief_reviewer = self.agents.chief_reviewer()
        
        discovery_task = self.tasks.red_ocean_niche_discovery_task(
            discovery_expert, big_market, angle
        )
        
        ranking_task = self.tasks.opportunity_ranking_task(
            chief_reviewer,
            "{discovery_task_output}"
        )
        ranking_task.context = [discovery_task]
        
        return Crew(
            agents=[discovery_expert, chief_reviewer],
            tasks=[discovery_task, ranking_task],
            process=Process.sequential,
            verbose=True,
            memory=False,
            max_rpm=50,
        )
    
    # ==================== 跨界机会模式专属Crew ====================
    
    def cross_domain_crew(self, domain_a: str, domain_b: str) -> Crew:
        """
        跨界模式Crew - 两阶段流程
        阶段1：机会发现专家找跨界机会
        阶段2：首席评审官评估排序
        """
        discovery_expert = self.agents.opportunity_discovery_expert()
        chief_reviewer = self.agents.chief_reviewer()
        
        discovery_task = self.tasks.cross_domain_discovery_task(
            discovery_expert, domain_a, domain_b
        )
        
        ranking_task = self.tasks.opportunity_ranking_task(
            chief_reviewer,
            "{discovery_task_output}"
        )
        ranking_task.context = [discovery_task]
        
        return Crew(
            agents=[discovery_expert, chief_reviewer],
            tasks=[discovery_task, ranking_task],
            process=Process.sequential,
            verbose=True,
            memory=False,
            max_rpm=50,
        )
    
    # ==================== 完整分析Crew（单个产品深度分析） ====================
    
    def full_analysis_crew(self, product_idea: str, target_audience: str = None) -> Crew:
        """
        完整分析Crew - 四维分析 + 综合评审
        
        流程：
        1. 四个分析Agent并行工作（市场/竞争/财务/技术）
        2. 评审员综合所有结果，给出最终结论
        """
        market_analyst = self.agents.market_analyst()
        competitive_analyst = self.agents.competitive_intelligence_analyst()
        financial_analyst = self.agents.financial_modeling_analyst()
        tech_assessor = self.agents.tech_assessor()
        chief_reviewer = self.agents.chief_reviewer()
        
        market_task = self.tasks.market_analysis_task(
            market_analyst, product_idea, target_audience
        )
        competitive_task = self.tasks.competitive_analysis_task(
            competitive_analyst, product_idea
        )
        financial_task = self.tasks.financial_modeling_task(
            financial_analyst, product_idea
        )
        tech_task = self.tasks.tech_assessment_task(
            tech_assessor, product_idea
        )
        review_task = self.tasks.final_review_task(
            chief_reviewer, product_idea
        )
        
        review_task.context = [market_task, competitive_task, financial_task, tech_task]
        
        return Crew(
            agents=[
                market_analyst, competitive_analyst, 
                financial_analyst, tech_assessor, chief_reviewer,
            ],
            tasks=[
                market_task, competitive_task, 
                financial_task, tech_task, review_task,
            ],
            process=Process.sequential,
            verbose=True,
            memory=False,
            max_rpm=100,
        )
    
    # ==================== 快速扫描Crew ====================
    
    def quick_scan_crew(self, product_idea: str) -> Crew:
        """
        快速扫描Crew - 仅做市场和竞争初步分析，用于快速筛选
        """
        market_analyst = self.agents.market_analyst()
        competitive_analyst = self.agents.competitive_intelligence_analyst()
        
        market_task = self.tasks.market_analysis_task(market_analyst, product_idea)
        competitive_task = self.tasks.competitive_analysis_task(competitive_analyst, product_idea)
        
        return Crew(
            agents=[market_analyst, competitive_analyst],
            tasks=[market_task, competitive_task],
            process=Process.sequential,
            verbose=True,
            max_rpm=50,
        )
