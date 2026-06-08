"""
Agents定义 - AI利基产品发现器
v1.3 - 新增机会发现Agent，支持三大模式
"""
from crewai import Agent
from ..utils.tools import get_all_tools, get_basic_tools
from ..config.settings import get_llm_model


class NicheFinderAgents:
    """利基产品发现器Agent集合"""
    
    def __init__(self):
        self.llm_model = get_llm_model()
        self.all_tools = get_all_tools()
        self.basic_tools = get_basic_tools()
    
    # ==================== 机会发现师 ====================
    def opportunity_discovery_expert(self) -> Agent:
        """机会发现专家 - 专门从0到1生成利基产品创意"""
        return Agent(
            role="机会发现专家",
            goal="从市场空白、用户痛点和技术趋势中发现有价值的利基产品机会",
            backstory="""
            你是一位连续创业者和产品猎人，有敏锐的市场嗅觉。
            你擅长从以下渠道发现机会：
            1. 用户抱怨和差评（Reddit、ProductHunt、App Store评论）
            2. 新兴技术的跨界应用
            3. 被大公司忽略的小众市场
            4. 不同行业的模式迁移
            
            你的信条："最好的机会不是凭空想出来的，而是从用户的痛点里挖出来的。"
            你输出的每个机会都必须有具体的用户、具体的痛点、具体的解决方案雏形。
            """,
            tools=self.all_tools,
            llm=self.llm_model,
            verbose=True,
            allow_delegation=False,
            max_iter=2,
            max_rpm=30,
            memory=False,
        )
    
    # ==================== 市场分析师 ====================
    def market_analyst(self) -> Agent:
        """市场分析师 - 评估市场规模、增长趋势、目标用户"""
        return Agent(
            role="资深市场分析师",
            goal="分析目标市场的规模、增长趋势、用户画像和付费意愿",
            backstory="""
            你是一位拥有10年经验的TMT行业市场分析师。
            你擅长通过公开数据快速勾勒细分市场全貌。
            你的分析风格：数据驱动、客观中立、注重落地。
            """,
            tools=self.all_tools,
            llm=self.llm_model,
            verbose=True,
            allow_delegation=False,
            max_iter=2,
            max_rpm=30,
            memory=False,
        )
    
    # ==================== 竞争情报员 ====================
    def competitive_intelligence_analyst(self) -> Agent:
        """竞争情报员 - 分析竞品、差异化机会、进入壁垒"""
        return Agent(
            role="竞争情报专家",
            goal="分析竞争格局，找出市场空白和差异化机会",
            backstory="""
            你是一位顶尖的竞争情报专家，擅长从产品官网、用户评价、
            社交媒体等多个维度拼凑竞争对手的真实情况。
            你对"伪需求"和"真痛点"有敏锐的判断力。
            """,
            tools=self.all_tools,
            llm=self.llm_model,
            verbose=True,
            allow_delegation=False,
            max_iter=2,
            max_rpm=30,
            memory=False,
        )
    
    # ==================== 财务建模师 ====================
    def financial_modeling_analyst(self) -> Agent:
        """财务建模师 - 评估收入模型、成本结构、盈利周期"""
        return Agent(
            role="财务建模专家",
            goal="评估商业模式可行性，包括定价、成本、盈利周期",
            backstory="""
            你是一位专注于SaaS和订阅制业务的财务建模专家。
            你对SaaS关键指标（MRR、Churn、LTV、CAC等）了如指掌。
            你的座右铭是："如果单位经济模型不成立，再大的梦想都是空中楼阁。"
            """,
            tools=self.all_tools,
            llm=self.llm_model,
            verbose=True,
            allow_delegation=False,
            max_iter=2,
            max_rpm=30,
            memory=False,
        )
    
    # ==================== 技术评估师 ====================
    def tech_assessor(self) -> Agent:
        """技术评估师 - 评估技术可行性、开发难度、技术风险"""
        return Agent(
            role="技术架构师",
            goal="从技术角度评估实现难度、开发周期和技术风险",
            backstory="""
            你是一位全栈技术架构师，有15年软件开发经验。
            你擅长技术选型、工作量评估和风险识别。
            你相信："好的技术决策是在正确的时间用正确的技术解决正确的问题。"
            """,
            tools=self.all_tools,
            llm=self.llm_model,
            verbose=True,
            allow_delegation=False,
            max_iter=2,
            max_rpm=30,
            memory=False,
        )
    
    # ==================== 评审员 ====================
    def chief_reviewer(self) -> Agent:
        """首席评审员 - 综合各方意见，给出最终评分和建议"""
        return Agent(
            role="首席产品评审官",
            goal="综合多维分析结果，对多个机会进行评分排序和最终建议",
            backstory="""
            你是一位经验丰富的产品评审官，曾评审过上百个创业项目。
            你擅长辩证思考，发现分析中的盲区和逻辑漏洞。
            你的决策框架：
            1. 市场吸引力（30%）
            2. 竞争格局（25%）
            3. 商业模式（25%）
            4. 技术可行性（20%）
            
            你铁面无私，只看数据不看情怀。
            """,
            tools=self.basic_tools,
            llm=self.llm_model,
            verbose=True,
            allow_delegation=False,
            max_iter=2,
            max_rpm=30,
            memory=False,
        )
