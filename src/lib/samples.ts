import type { Report, SixDimScore } from './types';

// 真实感样本数据（用于首页与机会列表的占位展示）
const SAMPLE_SIX_DIM: SixDimScore = {
  demand: 8.2, blue_ocean: 7.8, monetize: 7.5,
  tech_feasible: 8.5, entry_barrier: 7.0, growth: 6.5,
};

export const SAMPLE_REPORTS: Report[] = [
  {
    id: 'sample-blue-ocean-001',
    mode: 'blue-ocean',
    rank: 1,
    name: '本地商家 AI 营销文案生成器',
    tagline: '为本地餐饮/零售商家提供 30 秒生成朋友圈+小红书+抖音营销文案的 AI 工具',
    scores: {
      overall: 8.15,
      six_dim: { demand: 7.5, blue_ocean: 9.0, monetize: 7.0, tech_feasible: 8.5, entry_barrier: 7.0, growth: 6.5 },
    },
    marketSize: '10-50 亿元/年',
    entryBarrier: '中等',
    startCost: '3-5 万',
    estTime: '7 天启动',
    createdAt: '2026-06-08 14:32:11',
    analysisTime: 86.4,
    sources: [
      { id: 1, name: '艾瑞咨询《2025 中国本地生活营销趋势》', url: 'https://example.com/iyiou', accessedAt: '2026-06-08' },
      { id: 2, name: 'QuestMobile 商家 SaaS 月报', url: 'https://example.com/qm', accessedAt: '2026-06-08' },
      { id: 3, name: '信通院 AI 应用案例集', url: 'https://example.com/caict', accessedAt: '2026-06-08' },
      { id: 4, name: '36氪深度报道：AI 营销工具赛道', url: 'https://example.com/36kr', accessedAt: '2026-06-08' },
      { id: 5, name: '美团研究院《本地商家经营白皮书》', url: 'https://example.com/meituan', accessedAt: '2026-06-08' },
    ],
    market: {
      size: '本地生活营销内容市场规模约 230 亿元，年增长 22%[1]。其中中小商家（< 50 员工）占 78%[2]，但其营销内容工具渗透率不足 12%[3]。',
      growth: [
        '短视频内容需求井喷：抖音/小红书商家日均发布量年增 47%[4]',
        '中小商家营销能力缺失：78% 没有专业文案团队[5]',
        'AI 工具普及：2025 年商家 AI 工具使用率较 2024 年提升 3.2 倍[3]',
        '降本压力：营销外包月均 3000-8000 元，AI 替代可降至 300 元以下',
      ],
      audience: '核心用户：30-50 人规模的本地餐饮、零售、教培机构老板。痛点：每天需要发布 3-5 条营销内容，但缺乏专业文案能力。',
      trend: '未来 1-3 年，AI 营销工具将从「通用生成」向「品牌调性定制」演进，能解决「AI 内容同质化」问题的玩家有结构性机会。',
    },
    competition: {
      rivals: [
        { name: 'Jasper AI', feature: '英文营销文案', pricing: '$49/月', users: '约 80 万全球用户', edge: '不专攻本地场景，未支持中文细分行业' },
        { name: 'Copy.ai', feature: '通用模板', pricing: '$36/月', users: '约 60 万', edge: '商家自定义能力弱，无垂直行业模板' },
        { name: '秘塔写作猫', feature: '中文长文', pricing: '¥69/月', users: '约 25 万', edge: '偏长文，不适合短文案' },
      ],
      differentiators: [
        '垂直行业模板：内置餐饮/零售/教培三大行业的「爆款公式」',
        '多平台适配：一键生成朋友圈/小红书/抖音三种风格',
        '老板易用：零学习成本，30 秒出 3 个版本',
      ],
    },
    business: {
      models: [
        { name: '订阅制', detail: '基础版 ¥29/月（200 条），专业版 ¥99/月（1000 条），旗舰版 ¥299/月（不限量）' },
        { name: '增值服务', detail: '品牌调性训练 ¥999/次，AI 数据分析 ¥499/月' },
      ],
      costs: [
        '服务器 + LLM API：约 8000 元/月（按 1000 付费用户算）',
        '数据/模型微调：一次性 2-3 万',
        '推广：月均 1.5-2 万（BD + 内容营销）',
        '人员：1-2 人（产品 + 运营）',
      ],
      breakeven: '按 100 付费用户算，3-4 个月回本；500 付费用户后毛利可达 65%。',
    },
    devil: {
      arguments: [
        {
          title: '本地商家付费意愿被高估',
          detail: '调研显示 73% 的餐饮老板月利润不到 1 万，让他们付 99 元/月买文案工具，转化率可能不到 3%。',
          counter: '如果坚持做：可设计「7 天免费 + 不满意退订」降低决策门槛；先打 5 万粉以上的连锁品牌（付费能力验证过）。',
        },
        {
          title: '巨头一旦反应过来会快速降维',
          detail: '字节、腾讯已布局商家 SaaS，一旦把内容生成集成到飞书/抖音企业号，直接免费。',
          counter: '聚焦「中小老板的土味审美」+「本地化方言」+「朋友圈/小红书/抖音」三件套，巨头不会做。',
        },
        {
          title: '获客成本被严重低估',
          detail: '商家在美团/抖音心智已饱和，再推一个新工具极难，需要 1v1 销售或加盟商推广。',
          counter: '走「行业 KOL 合作 + 老板社群裂变」路线，单客成本可压到 50 元以下。',
        },
        {
          title: 'AI 内容同质化导致留存低',
          detail: 'LLM 生成的文案缺乏品牌调性，商家用 1 个月就会发现「用 AI 写的都是套路」，续费率低于 20%。',
          counter: '核心壁垒在「品牌调性训练 + 行业爆款公式库」，而非生成能力本身。',
        },
      ],
      hedgePlan: [
        '第 1 周：MVP 上线 + 50 个种子用户（老板社群）',
        '第 2 周：收集反馈 + 调优模板 + 测试付费转化',
        '第 3-4 周：上线「品牌调性训练」增值服务',
        '第 2 个月：跑通 100 付费用户 / 续费率 60% 的双指标',
      ],
    },
    action: {
      cost: '3-5 万元',
      team: '1-2 人（产品 + 运营）',
      plan: [
        { day: 'Day 1-2', title: '用户访谈 + Landing Page', detail: '约 10 个本地商家老板做痛点访谈；上线落地页收集 waitlist；锁定 3 个核心行业模板。' },
        { day: 'Day 3-4', title: 'MVP 开发', detail: '基于 LLM API + 行业 prompt 模板；打通 3 平台文案生成；基础订阅系统。' },
        { day: 'Day 5-6', title: '种子用户获取', detail: '老板社群发布 + 1v1 邀请 50 个免费试用；收集使用数据 + NPS。' },
        { day: 'Day 7', title: '商业化上线', detail: '上线 ¥29/¥99 双档订阅；监控首周转化、续费、退款。' },
      ],
    },
  },
  {
    id: 'sample-red-niche-002',
    mode: 'red-niche',
    rank: 1,
    name: '非英语母语者商务邮件文化适配工具',
    tagline: '为出海团队的跨文化邮件提供「中式/美式/欧式」语气一键切换的 AI 改写工具',
    scores: {
      overall: 7.80,
      six_dim: { demand: 7.5, blue_ocean: 8.5, monetize: 7.5, tech_feasible: 8.0, entry_barrier: 7.5, growth: 7.0 },
    },
    marketSize: '5-15 亿元/年',
    entryBarrier: '低',
    startCost: '1-3 万',
    estTime: '3 天启动',
    createdAt: '2026-06-07 10:12:33',
    analysisTime: 78.3,
    sources: [
      { id: 1, name: '海关总署跨境电商报告', url: 'https://example.com/customs', accessedAt: '2026-06-07' },
      { id: 2, name: 'Grammarly 年报', url: 'https://example.com/grammarly', accessedAt: '2026-06-07' },
      { id: 3, name: '中国跨境电商生态报告', url: 'https://example.com/cbec', accessedAt: '2026-06-07' },
    ],
    market: {
      size: '中国出海企业已超 50 万家，年增 18%。其中需要频繁发送英文邮件的占 65%[1]。',
      growth: [
        '跨境电商持续增长，2025 年规模 2.38 万亿元[1]',
        '出海团队对外沟通频率激增',
        'Grammarly 类工具年增 25% 用户，但本土化缺失[2]',
      ],
      audience: '跨境电商 BD、海外销售、外贸 SOHO。',
      trend: '文化适配是 Grammarly 类工具的下个突破点。',
    },
    competition: {
      rivals: [
        { name: 'Grammarly', feature: '英文语法', pricing: '$12/月', users: '3000 万+', edge: '不提供文化适配' },
        { name: 'DeepL Write', feature: '英德互译', pricing: '€8/月', users: '约 100 万', edge: '非商务场景' },
      ],
      differentiators: [
        '中/美/欧三种风格一键切换',
        '商务礼仪知识库（关系建立/谈判/催单）',
        '针对 B2B 邮件的「目的感」优化',
      ],
    },
    business: {
      models: [
        { name: '订阅', detail: '¥39/月个人版 / ¥299/月团队版（5 人）' },
        { name: 'API', detail: '¥0.5/次' },
      ],
      costs: [
        '服务器 + LLM API：约 5000 元/月',
        '数据：商务礼仪知识库构建 1-2 万',
        '推广：BD 团队合作 + SEO',
      ],
      breakeven: '2 个月回本。',
    },
    devil: {
      arguments: [
        { title: 'Grammarly 迟早做', detail: 'Grammarly 已有 3000 万付费用户，做本土化是 1-2 个版本的事。' },
        { title: '文化差异模型难以量化', detail: '用户难以判断「改得对不对」，付费意愿不强。' },
      ],
      hedgePlan: [
        'MVP 上线后 1 周内验证 50 付费用户',
        '与 2-3 家出海训练营合作',
        '如 3 个月内 < 100 付费，转为 Chrome 插件免费 + 企业 API',
      ],
    },
    action: {
      cost: '1-3 万元',
      team: '1 人',
      plan: [
        { day: 'Day 1', title: 'Landing Page', detail: '落地页 + 50 个 waitlist。' },
        { day: 'Day 2', title: 'MVP 上线', detail: '邮件改写 + 风格切换。' },
        { day: 'Day 3', title: '冷启动', detail: '跨境电商社群发布。' },
      ],
    },
  },
  {
    id: 'sample-cross-domain-003',
    mode: 'cross-domain',
    rank: 1,
    name: 'AI × 生物节律 · 动态恢复教练',
    tagline: '把可穿戴设备的心率/HRV 数据用 AI 转化为「今天该休息还是该加练」的动态建议',
    scores: {
      overall: 7.45,
      six_dim: { demand: 7.0, blue_ocean: 7.5, monetize: 6.5, tech_feasible: 7.0, entry_barrier: 6.5, growth: 7.5 },
    },
    marketSize: '20-40 亿元/年',
    entryBarrier: '高',
    startCost: '5-10 万',
    estTime: '14 天启动',
    createdAt: '2026-06-05 21:45:02',
    analysisTime: 92.1,
    sources: [
      { id: 1, name: 'IDC 可穿戴市场报告', url: 'https://example.com/idc', accessedAt: '2026-06-05' },
      { id: 2, name: 'WHO 运动健康白皮书', url: 'https://example.com/who', accessedAt: '2026-06-05' },
    ],
    market: {
      size: '中国可穿戴设备用户 4.5 亿[1]，但 80% 的数据没有被有效解读。',
      growth: [
        '可穿戴普及率超 50%',
        '运动健康意识觉醒',
        'GPT 类模型让「数据→建议」成本大幅下降',
      ],
      audience: '健身爱好者、马拉松跑者、CrossFit 玩家。',
      trend: '数据解读服务将成为可穿戴设备的下一战场。',
    },
    competition: {
      rivals: [
        { name: 'Whoop', feature: '恢复评分', pricing: '$30/月', users: '约 200 万', edge: '硬件绑定' },
        { name: '佳明 Connect', feature: '训练负荷', pricing: '硬件销售', users: '约 1000 万', edge: '系统封闭' },
      ],
      differentiators: [
        '跨品牌：支持 Apple Watch/佳明/华为',
        'AI 教练：动态建议 + 解释',
        '社区：恢复对比、训练日志',
      ],
    },
    business: {
      models: [
        { name: '订阅', detail: '¥39/月' },
        { name: '硬件', detail: '可与心率带捆绑销售' },
      ],
      costs: [
        '数据接口：与各品牌 SDK 合作',
        'LLM API：约 6000 元/月',
        'BD：与健身房/教练合作',
      ],
      breakeven: '6-8 个月回本。',
    },
    devil: {
      arguments: [
        { title: '硬件厂商会做', detail: 'Apple/华为已布局运动健康，迟早自带 AI 教练。' },
        { title: '运动科学模型门槛高', detail: '需专业运动医学知识，纯 AI 建议易被批「不专业」。' },
      ],
      hedgePlan: [
        '先做工具 + 教练社群',
        '积累 1000 个真实案例后转 AI',
        '考虑被硬件厂收购',
      ],
    },
    action: {
      cost: '5-10 万元',
      team: '2 人（产品 + 运动科学顾问）',
      plan: [
        { day: 'Day 1-3', title: '调研 + 数据', detail: '访谈 30 个目标用户 + 接入 Apple HealthKit。' },
        { day: 'Day 4-7', title: 'MVP', detail: '数据采集 + 简单建议算法。' },
        { day: 'Day 8-14', title: '冷启动', detail: '健身社群 + 教练合作。' },
      ],
    },
  },
  {
    id: 'sample-analyze-004',
    mode: 'analyze',
    rank: 1,
    name: '宠物经济独立站（深度验证）',
    tagline: '围绕中产养宠人群的「订阅制鲜粮 + 智能喂食器 + 兽医咨询」一站式独立站',
    scores: {
      overall: 8.20,
      six_dim: { demand: 9.0, blue_ocean: 6.5, monetize: 8.5, tech_feasible: 7.0, entry_barrier: 8.0, growth: 8.0 },
    },
    marketSize: '300-500 亿元/年',
    entryBarrier: '高',
    startCost: '50-100 万',
    estTime: '60 天启动',
    createdAt: '2026-05-30 16:08:45',
    analysisTime: 156.7,
    sources: [
      { id: 1, name: '艾瑞《2025 中国宠物经济白皮书》', url: 'https://example.com/pet', accessedAt: '2026-05-30' },
      { id: 2, name: 'Frost & Sullivan 宠物食品报告', url: 'https://example.com/frost', accessedAt: '2026-05-30' },
      { id: 3, name: '中国宠物行业协会', url: 'https://example.com/cpba', accessedAt: '2026-05-30' },
    ],
    market: {
      size: '中国宠物经济 2025 年规模约 3800 亿元[1]，其中食品占 45%。订阅制鲜粮年增长 35%。',
      growth: [
        '养宠人群突破 1.2 亿[1]',
        '中产养宠渗透率提升',
        '鲜粮 + 智能硬件 + 服务一体化趋势明显',
      ],
      audience: '一二线城市 28-40 岁养宠中产，月消费 800-3000 元。',
      trend: '从「卖货」到「卖生活方式」，订阅 + 硬件 + 服务将形成闭环。',
    },
    competition: {
      rivals: [
        { name: '皇家', feature: '传统干粮', pricing: '订阅 299/月', users: '千万级', edge: '老品牌，渠道深' },
        { name: '鲜朗', feature: '鲜粮', pricing: '订阅 399/月', users: '百万级', edge: '起步早，供应链成熟' },
        { name: '小佩 Petkit', feature: '智能硬件', pricing: '硬件 599+', users: '百万级', edge: '硬件生态完善' },
      ],
      differentiators: [
        '三合一订阅：鲜粮 + 喂食器 + 兽医',
        '个性化：根据宠物健康数据动态调整',
        '数据闭环：硬件数据反哺食物推荐',
      ],
    },
    business: {
      models: [
        { name: '订阅', detail: '月卡 499 / 季卡 1399 / 年卡 4999' },
        { name: '硬件', detail: '智能喂食器 1299' },
        { name: '增值服务', detail: '兽医咨询 99/次，保险 199/年' },
      ],
      costs: [
        '供应链：冷链配送 + 鲜粮工厂 30 万',
        '硬件：开模 15-20 万',
        'BD：宠物店 / 医院合作',
        '团队：8-10 人',
      ],
      breakeven: '12-18 个月，订阅用户 5000+。',
    },
    devil: {
      arguments: [
        { title: '供应链是地狱难度', detail: '鲜粮需要冷链 + 自有工厂，新玩家易被卡死。' },
        { title: '获客成本高', detail: '宠物 KOL 报价飞涨，ROI 难跑正。' },
        { title: '巨头一旦觉醒', detail: '京东/美团/拼多多可快速切入鲜粮 + 硬件赛道。' },
      ],
      hedgePlan: [
        '先做 200 个种子用户的订阅验证',
        '硬件外包给成熟 ODM，不自建产线',
        '与 1-2 家连锁宠物医院深度合作',
        '如 6 个月跑不通 1000 订阅，缩减到「鲜粮+兽医」单点',
      ],
    },
    action: {
      cost: '50-100 万元',
      team: '8-10 人',
      plan: [
        { day: 'Day 1-7', title: '调研 + 合规', detail: '深度访谈 50 个目标用户 + 食品资质 + 工厂对接。' },
        { day: 'Day 8-30', title: 'MVP', detail: '订阅系统 + 单 SKU 鲜粮 + 简单包装。' },
        { day: 'Day 31-45', title: '硬件', detail: '喂食器 ODM + 联调。' },
        { day: 'Day 46-60', title: '冷启动', detail: '宠物 KOL + 医院合作 + 200 个种子订阅。' },
      ],
    },
  },
  {
    id: 'sample-blue-ocean-005',
    mode: 'blue-ocean',
    rank: 1,
    name: 'AI 直播脚本实时生成助手',
    tagline: '为带货主播提供「实时弹幕关键词 → 直播口播稿」秒级响应的 AI 副驾',
    scores: {
      overall: 7.80,
      six_dim: { demand: 8.0, blue_ocean: 8.0, monetize: 7.5, tech_feasible: 7.5, entry_barrier: 6.5, growth: 6.0 },
    },
    marketSize: '5-15 亿元/年',
    entryBarrier: '低',
    startCost: '2-3 万',
    estTime: '5 天启动',
    createdAt: '2026-05-28 11:22:18',
    analysisTime: 81.5,
    sources: [
      { id: 1, name: '抖音电商生态报告', url: 'https://example.com/douyin', accessedAt: '2026-05-28' },
      { id: 2, name: 'CNNIC 直播电商数据', url: 'https://example.com/cnnic', accessedAt: '2026-05-28' },
    ],
    market: {
      size: '中国直播电商 GMV 2025 年达 5.5 万亿元[1]，带货主播规模超 500 万。',
      growth: [
        '直播带货持续渗透',
        '中小主播急需 AI 提效',
        'GPT-4 级别模型让「秒级口播」成为可能',
      ],
      audience: '5-50 万粉腰部主播，单场需要 2-3 万字脚本。',
      trend: 'AI 副驾类工具将在 1-2 年内成为主播标配。',
    },
    competition: {
      rivals: [
        { name: '蝉妈妈', feature: '数据 + 选品', pricing: '¥999/月起', users: '百万级', edge: '偏数据，不做实时口播' },
        { name: '飞瓜', feature: '数据 + 复盘', pricing: '¥699/月起', users: '百万级', edge: '偏复盘' },
      ],
      differentiators: [
        '实时性：弹幕关键词 → 秒级口播',
        '垂类模板：美妆/食品/3C 三大品类',
        '主播音色克隆（可选）',
      ],
    },
    business: {
      models: [
        { name: '订阅', detail: '¥199/月 / ¥1999/年' },
        { name: 'API', detail: '¥0.1/次' },
      ],
      costs: [
        'LLM API：约 8000 元/月',
        '弹幕采集：自建 1 万/月',
      ],
      breakeven: '3 个月回本。',
    },
    devil: {
      arguments: [
        { title: '抖音可能自己做', detail: '抖音「即创」已布局 AI 文案，平台下场后空间被压缩。' },
        { title: '主播学习成本高', detail: '50 岁以上主播对 AI 工具接受度低。' },
      ],
      hedgePlan: [
        '先打 5-50 万粉腰部主播',
        '与 MCN 机构批量合作',
        '被抖音/快手并购的退出路径',
      ],
    },
    action: {
      cost: '2-3 万元',
      team: '1 人',
      plan: [
        { day: 'Day 1-2', title: '调研 + MVP', detail: '访谈 20 直播 + 弹幕解析。' },
        { day: 'Day 3-4', title: '测试 + 优化', detail: '100 场直播验证。' },
        { day: 'Day 5', title: '上线', detail: 'MCN 合作推广。' },
      ],
    },
  },
  {
    id: 'sample-red-niche-006',
    mode: 'red-niche',
    rank: 1,
    name: 'AI 简历优化 + 模拟面试 SaaS',
    tagline: '面向求职者的「JD 解析 + 简历改写 + AI 模拟面试官」一体化订阅服务',
    scores: {
      overall: 7.20,
      six_dim: { demand: 7.5, blue_ocean: 6.5, monetize: 7.5, tech_feasible: 7.5, entry_barrier: 7.0, growth: 6.0 },
    },
    marketSize: '10-30 亿元/年',
    entryBarrier: '低',
    startCost: '1-2 万',
    estTime: '3 天启动',
    createdAt: '2026-05-25 09:35:12',
    analysisTime: 73.8,
    sources: [
      { id: 1, name: 'BOSS 直聘研究院', url: 'https://example.com/boss', accessedAt: '2026-05-25' },
    ],
    market: {
      size: '中国年求职人群约 1.2 亿，简历优化 + 面试辅导是成熟红海市场。',
      growth: [
        '就业市场竞争激烈',
        'AI 工具普及',
        '求职者付费意愿高（与结果强相关）',
      ],
      audience: '1-3 年经验的应届/初级职场人。',
      trend: '从「简历模板」向「JD 适配 + 模拟面试」演进。',
    },
    competition: {
      rivals: [
        { name: '超级简历', feature: '简历模板', pricing: '¥69/月', users: '百万级', edge: '偏模板' },
        { name: 'Career Buddy', feature: '猎头咨询', pricing: '¥500/次', users: '少量', edge: '价格高' },
      ],
      differentiators: [
        'JD 解析 → 简历自动改写',
        'AI 模拟面试官（含 STAR 模型）',
        '面试录音 + 复盘',
      ],
    },
    business: {
      models: [
        { name: '订阅', detail: '¥39/月 / ¥299/年' },
        { name: '增值', detail: 'HR 专家点评 ¥99/次' },
      ],
      costs: ['LLM API 3000/月', '推广 5000/月'],
      breakeven: '2 个月回本。',
    },
    devil: {
      arguments: [
        { title: '超级简历迟早做', detail: '已有百万用户，做 AI 改写是 1-2 个版本的事。' },
        { title: '求职者付费能力有限', detail: '应届生客单价 39 已接近天花板。' },
      ],
      hedgePlan: ['MVP + 1 周内 100 付费验证', 'B 端校企合作是放大器'],
    },
    action: {
      cost: '1-2 万元',
      team: '1 人',
      plan: [
        { day: 'Day 1', title: 'Landing Page', detail: '落地页 + 50 waitlist。' },
        { day: 'Day 2', title: 'MVP', detail: '简历改写 + 模拟面试。' },
        { day: 'Day 3', title: '冷启动', detail: '求职社群。' },
      ],
    },
  },
];

export function getSampleReportById(id: string): Report | undefined {
  return SAMPLE_REPORTS.find((r) => r.id === id);
}
