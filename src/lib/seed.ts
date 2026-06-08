/**
 * 演示种子数据 - 无 LLM Key 时使用 / 演示模式
 * 提供 5 个真实感样本 + 2 份历史分析报告
 */
import type { Opportunity, FullReport, SixDimScore, UserProfile, DiscoveryMode } from './types';
import { computeOverall } from './types';

const mkScores = (s: SixDimScore, mode: DiscoveryMode) => ({ ...s, overall: computeOverall(s) });

const STANDARD_SOURCES = [
  { ref: 1, title: '艾瑞咨询：2025 中国 SaaS 行业研究报告', publisher: '艾瑞咨询', url: 'https://www.iresearch.com.cn/report/saas-2025', accessedAt: '2026-06-01' },
  { ref: 2, title: 'QuestMobile 中国移动互联网年度大报告', publisher: 'QuestMobile', url: 'https://www.questmobile.com.cn/report-2025', accessedAt: '2026-05-15' },
  { ref: 3, title: '中国信息通信研究院：AI 应用场景白皮书', publisher: '中国信通院', url: 'https://www.caict.ac.cn/kxyj/qwfb/bps/202501/t20250115_xxxxx.html', accessedAt: '2026-05-20' },
  { ref: 4, title: '36 氪：本地生活服务赛道观察', publisher: '36 氪', url: 'https://36kr.com/p/locallife-2025', accessedAt: '2026-06-02' },
  { ref: 5, title: '美团研究院：本地商家经营状况调研', publisher: '美团研究院', url: 'https://about.meituan.com/research', accessedAt: '2026-05-28' },
];

export const SAMPLE_OPPORTUNITIES: Record<DiscoveryMode, Opportunity[]> = {
  'blue-ocean': [
    {
      id: 'demo_bo_001',
      mode: 'blue-ocean',
      rank: 1,
      name: '本地商家 AI 营销文案生成器',
      oneLiner: '为本地餐饮/零售商家 30 秒生成朋友圈+小红书+抖音文案',
      valueProposition: '为本地餐饮/零售商家提供一键多平台营销内容生成服务，深度适配本地生活场景（方言、节气、店内实拍），单店月省 2 天内容制作时间。',
      scores: mkScores({ demand: 7.5, blue_ocean: 9.0, monetize: 7.0, tech_feasible: 8.5, entry_barrier: 7.0, growth: 6.5 }, 'blue-ocean'),
      overall: 7.95,
      marketSize: '50-100 亿元/年',
      entryBarrier: '中（需积累商家资源）',
      startupCost: '3-5 万',
      market: {
        marketSize: { value: '50-100 亿元/年', source: '艾瑞咨询 + 美团研究院综合测算 [1][5]', url: 'https://www.iresearch.com.cn' },
        growthDrivers: [
          '本地商家数字化转型加速，但工具使用门槛高',
          '短视频/小红书种草对内容产出量要求激增',
          'LLM 成本下降让按需生成成为可能',
        ],
        targetUser: { age: '28-45 岁', job: '中小餐饮/零售店主', scale: '全国 800 万家', scenario: '每天/每周需要产出促销、新品、活动文案' },
        trend: '未来 2-3 年，商家对"省人工+本地化"的内容工具需求将持续提升。',
      },
      competition: {
        competitors: [
          { name: 'Jasper AI（国际）', features: '通用文案生成', pricing: '$49/月起', userScale: '百万级', pros: '品牌成熟', cons: '不专攻本地生活，中文化弱' },
          { name: '秘塔写作猫', features: '通用中文写作', pricing: '免费 + 会员', userScale: '千万级', pros: '中文能力强', cons: '偏长文，非营销场景' },
          { name: '某本地生活 SaaS 内置文案', features: '商家后台简单模板', pricing: '套餐内置', userScale: '百万级', pros: '嵌入既有 SaaS', cons: '功能简陋，效果差' },
        ],
        differentiation: [
          '深度本地化：方言、节气、店内实拍识别',
          '多平台同步：一键生成朋友圈/小红书/抖音 3 套',
          '价格亲民：99 元/月，比 Jasper 便宜 60%',
        ],
      },
      business: {
        models: [
          { name: '订阅制', description: '基础版 99 元/月（含 200 次生成）', priceHint: '99 元/月' },
          { name: '按次付费', description: '1 元/次，单次小任务', priceHint: '1 元/次' },
          { name: '增值服务', description: '店内实拍训练 + 风格定制', priceHint: '500-2000 元/次' },
        ],
        cost: [
          { item: 'LLM API', estimate: '3000-8000 元/月（视用量）' },
          { item: '服务器 + 存储', estimate: '500-1500 元/月' },
          { item: '推广（地推/线上）', estimate: '5000-15000 元/月' },
        ],
        paybackPeriod: '按 100 付费用户计算，约 3-4 个月回本',
      },
      devilsAdvocate: [
        {
          title: '本地商家付费意愿被高估',
          reasoning: '餐饮老板月薪中位数不到 1 万，让他们付 99 元/月买文案工具，转化率可能不到 3%。大量商家偏好"免费 + 看广告"模式。',
          rebuttal: '主攻付费意愿明确的连锁品牌（蜜雪冰城、瑞幸加盟商等），或者用免费版吸量 + 增值服务变现。',
        },
        {
          title: '巨头一旦反应过来会快速降维',
          reasoning: '字节、腾讯、美团都已布局商家 SaaS。一旦巨头把"内容生成"塞进既有商家后台，你的差异化几乎归零。',
          rebuttal: '从第一天就做"插件化"，与既有的点单系统/收银系统对接，让商家"换不掉你"。',
        },
        {
          title: '获客成本被严重低估',
          reasoning: '商家在美团/抖音心智已饱和，再推一个新工具极难。地推 BD 1 个商家平均成本 200-500 元。',
          rebuttal: '聚焦单一垂直（如"奶茶店"），做出口碑后做横向扩张；用内容营销+SEO 获取自然流量。',
        },
        {
          title: '内容生成同质化严重',
          reasoning: 'LLM 生成的内容缺乏品牌调性，商家用 1 个月就会发现"用 AI 写的都是套路"，最终弃用。',
          rebuttal: '加入"品牌调性训练"模块，让商家上传 5-10 篇过往内容，模型按其风格生成。',
        },
      ],
      survival: {
        title: '如果坚持要做，最小化风险的方式',
        steps: [
          'MVP 阶段只服务"奶茶店"一个垂直，2 周内交付 5 个种子用户',
          '免费策略拉 100 个真实商家做产品共创，建立口碑',
          '与 1 家本地生活 SaaS 谈插件化合作（如"客如云"）',
          '3 个月内验证付费转化率不到 5% 立即转型',
        ],
      },
      action: {
        startupCost: '3-5 万',
        teamSize: '1-2 人（1 后端 + 1 运营）',
        sevenDayPlan: [
          { day: 'Day 1', task: '在 3 个本地商家群发招募，访谈 10 个目标用户，记录真实痛点' },
          { day: 'Day 2', task: '用 Next.js + LLM API 搭 MVP，30 秒生成朋友圈文案 demo' },
          { day: 'Day 3', task: '完成小红书/抖音双平台文案生成能力，对接抖音热点 API' },
          { day: 'Day 4', task: '完善 UI，支持"品牌调性训练"模块（上传 5 篇示例）' },
          { day: 'Day 5', task: '上线 Landing Page + 微信群推广，邀请 20 个种子商家免费试用' },
          { day: 'Day 6', task: '收集 5 个真实反馈，调整生成策略（重点解决"同质化"问题）' },
          { day: 'Day 7', task: '发布定价 99 元/月，做 3 个付费转化验证付费意愿' },
        ],
      },
      sources: STANDARD_SOURCES,
      related: ['demo_bo_002', 'demo_bo_003'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo_bo_002',
      mode: 'blue-ocean',
      rank: 2,
      name: 'AI 直播脚本实时生成助手',
      oneLiner: '为带货主播提供实时话术、互动点、逼单话术生成',
      valueProposition: '为带货主播提供基于商品/观众实时反馈的直播话术生成，降低开播准备时间 70%。',
      scores: mkScores({ demand: 8.0, blue_ocean: 8.0, monetize: 7.5, tech_feasible: 7.5, entry_barrier: 6.5, growth: 6.0 }, 'blue-ocean'),
      overall: 7.45,
      marketSize: '30-60 亿元/年',
      entryBarrier: '中（需主播资源）',
      startupCost: '2-4 万',
      market: {
        marketSize: { value: '30-60 亿元/年', source: '艾瑞咨询直播电商报告 [1]' },
        growthDrivers: ['直播电商规模年增 25%', '中小主播缺乏专业培训', 'AI 实时生成成本下降'],
        targetUser: { age: '22-35 岁', job: '腰部带货主播', scale: '全国 100 万+ 中腰部主播', scenario: '开播前需要准备话术，开播中需要实时应对冷场' },
        trend: '未来 2 年，AI 辅助开播将成为腰部主播标配。',
      },
      competition: {
        competitors: [
          { name: '蝉妈妈', features: '主播数据平台', pricing: '会员制', userScale: '百万级', pros: '数据强', cons: '无 AI 实时生成' },
          { name: '飞瓜', features: '直播运营辅助', pricing: '订阅制', userScale: '百万级', pros: '运营功能全', cons: 'AI 弱' },
        ],
        differentiation: ['实时语音转文字 + 实时生成话术', '针对中小主播的轻量化工具', '价格更亲民'],
      },
      business: {
        models: [
          { name: '订阅制', description: '主播版 199 元/月', priceHint: '199 元/月' },
          { name: '机构版', description: 'MCN 机构批量账号', priceHint: '999 元/月' },
        ],
        cost: [
          { item: 'LLM API', estimate: '5000-10000 元/月' },
          { item: '直播流解析', estimate: '1000-3000 元/月' },
        ],
        paybackPeriod: '按 200 付费主播计算，2-3 个月回本',
      },
      devilsAdvocate: [
        {
          title: '直播头部主播有自己的运营团队',
          reasoning: '真正带货强的主播背后都有专业团队，他们不缺工具，缺的是爆款选品。',
          rebuttal: '聚焦腰部主播（1 万-50 万粉），他们既需要工具又没有团队。',
        },
        {
          title: 'AI 生成话术容易被平台识别为"低质"',
          reasoning: '抖音/快手对 AI 生成内容越来越警惕，可能限制推荐权重。',
          rebuttal: '把 AI 生成作为"辅助"，最终由主播本人说出，降低被识别风险。',
        },
      ],
      survival: {
        title: 'MVP 策略',
        steps: ['聚焦"美妆/穿搭"单一品类', '与 3 个 MCN 机构谈合作', '3 个月验证 5% 付费转化'],
      },
      action: {
        startupCost: '2-4 万',
        teamSize: '1-2 人',
        sevenDayPlan: [
          { day: 'Day 1', task: '访谈 5 个腰部主播，记录开播痛点' },
          { day: 'Day 2', task: '搭建话术生成 MVP（输入商品信息 → 输出 5 段话术）' },
          { day: 'Day 3', task: '对接直播流语音转文字，实时生成' },
          { day: 'Day 4', task: 'UI 优化 + 收藏/历史功能' },
          { day: 'Day 5', task: '免费邀请 20 个主播试用' },
          { day: 'Day 6', task: '收集反馈，迭代' },
          { day: 'Day 7', task: '定价上线，验证付费转化' },
        ],
      },
      sources: STANDARD_SOURCES.slice(0, 4),
      related: ['demo_bo_001', 'demo_bo_003'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo_bo_003',
      mode: 'blue-ocean',
      rank: 3,
      name: '独立开发者出海 SEO 内容工厂',
      oneLiner: 'AI 自动生成英文 SEO 长文+内链+外链的独立站系统',
      valueProposition: '帮独立开发者用 AI 一键搭建英语长尾 SEO 站，6 个月内赚取 Google AdSense 被动收入。',
      scores: mkScores({ demand: 7.0, blue_ocean: 7.5, monetize: 8.0, tech_feasible: 8.0, entry_barrier: 6.5, growth: 6.5 }, 'blue-ocean'),
      overall: 7.25,
      marketSize: '20-40 亿元/年',
      entryBarrier: '低（个人即可）',
      startupCost: '1-2 万',
      market: {
        marketSize: { value: '20-40 亿元/年', source: '出海开发者社区综合 [2]' },
        growthDrivers: ['AI 让英语内容成本大幅下降', 'Google 仍青睐长文 SEO', '独立开发者需要被动收入'],
        targetUser: { age: '24-38 岁', job: '独立开发者', scale: '全球 50 万+', scenario: '工作之余想赚取美元被动收入' },
        trend: '2026 年 SEO 站依然有效，但需要 AI 提效。',
      },
      competition: {
        competitors: [
          { name: 'Jasper AI for SEO', features: '英文 SEO 长文', pricing: '$49/月', userScale: '百万级', pros: '英文能力强', cons: '不针对个人开发者' },
          { name: 'Surfer SEO', features: 'SEO 优化辅助', pricing: '$89/月', userScale: '百万级', pros: '专业 SEO 数据', cons: '贵' },
        ],
        differentiation: ['一站式（生成+内链+外链+发布）', '价格亲民', '中文界面但英文输出'],
      },
      business: {
        models: [
          { name: 'SaaS 订阅', description: '个人 99 元/月', priceHint: '99 元/月' },
          { name: '代运营', description: '帮建站+运营', priceHint: '3000-5000 元/站' },
        ],
        cost: [
          { item: 'LLM API', estimate: '2000-5000 元/月' },
          { item: '服务器', estimate: '500 元/月' },
        ],
        paybackPeriod: '按 100 付费用户计算，2 个月回本',
      },
      devilsAdvocate: [
        {
          title: 'Google 对 AI 内容打压',
          reasoning: '2024 起 Google 明确打击"无价值 AI 内容"，纯 AI 站可能不被收录。',
          rebuttal: '加入"人工编辑"环节，让用户参与 30% 内容调整，提升真实性。',
        },
        {
          title: 'SEO 红利期已过',
          reasoning: '2025 后，AI 让 SEO 内容爆炸式增长，每个关键词竞争激烈。',
          rebuttal: '聚焦长尾关键词（搜索量 100-1000/月），竞争小但累计可观。',
        },
      ],
      survival: {
        title: 'MVP 策略',
        steps: ['选 1 个长尾赛道（如"kitchen gadgets for small kitchens"）', 'AI 生成 50 篇测试收录', '根据数据调整内容策略'],
      },
      action: {
        startupCost: '1-2 万',
        teamSize: '1 人',
        sevenDayPlan: [
          { day: 'Day 1', task: '调研 3 个长尾赛道，选定 1 个' },
          { day: 'Day 2', task: '搭建 WordPress + AI 自动发布管道' },
          { day: 'Day 3', task: '生成 20 篇测试内容' },
          { day: 'Day 4', task: '内链 + 外链 + SEO 优化' },
          { day: 'Day 5', task: '申请 AdSense' },
          { day: 'Day 6', task: '根据收录情况调整' },
          { day: 'Day 7', task: '上线付费版（一次性 299 元工具包）' },
        ],
      },
      sources: STANDARD_SOURCES.slice(0, 3),
      related: ['demo_bo_001', 'demo_bo_002'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo_bo_004',
      mode: 'blue-ocean',
      rank: 4,
      name: 'AI 简历优化 + 模拟面试 SaaS',
      oneLiner: '为应届生/转行者提供 AI 简历优化+模拟面试服务',
      valueProposition: '为应届生和转行者提供基于行业 JD 的 AI 简历优化、模拟面试和面试反馈服务，命中率提升 50%。',
      scores: mkScores({ demand: 7.5, blue_ocean: 6.5, monetize: 7.5, tech_feasible: 7.5, entry_barrier: 7.0, growth: 6.0 }, 'blue-ocean'),
      overall: 6.95,
      marketSize: '15-30 亿元/年',
      entryBarrier: '中（需积累行业 JD 数据）',
      startupCost: '2-3 万',
      market: {
        marketSize: { value: '15-30 亿元/年', source: '艾瑞咨询 [1]' },
        growthDrivers: ['应届生就业压力持续', 'AI 让个性化辅导成本降低', '求职市场付费意愿强'],
        targetUser: { age: '20-28 岁', job: '应届生/转行者', scale: '全国 1000 万+', scenario: '秋招/春招前需要快速提升求职竞争力' },
        trend: '未来 2 年，AI 求职辅导将成为应届生标配。',
      },
      competition: {
        competitors: [
          { name: '超级简历', features: '简历模板', pricing: '会员制', userScale: '千万级', pros: '品牌强', cons: '无 AI 模拟面试' },
          { name: 'Offer 先生', features: '求职辅导', pricing: '课程制', userScale: '百万级', pros: '课程全', cons: '贵' },
        ],
        differentiation: ['AI 模拟面试（语音对话+实时反馈）', '价格亲民（19.9 元/次）', '针对行业定制'],
      },
      business: {
        models: [
          { name: '按次付费', description: '简历优化 19.9 元/次', priceHint: '19.9 元' },
          { name: '会员制', description: '99 元/月不限次', priceHint: '99 元/月' },
        ],
        cost: [
          { item: 'LLM API + 语音', estimate: '3000-5000 元/月' },
          { item: '推广', estimate: '5000 元/月' },
        ],
        paybackPeriod: '按 500 付费用户计算，2-3 个月回本',
      },
      devilsAdvocate: [
        {
          title: '免费工具已多',
          reasoning: '智联/Boss 等招聘平台已内置 AI 简历优化，付费工具难以差异化。',
          rebuttal: '聚焦"模拟面试"环节，平台没有这个能力。',
        },
      ],
      survival: {
        title: 'MVP 策略',
        steps: ['聚焦"互联网产品/运营"岗位', '免费版做引流，付费版做核心', '与高校就业中心合作'],
      },
      action: {
        startupCost: '2-3 万',
        teamSize: '1-2 人',
        sevenDayPlan: [
          { day: 'Day 1', task: '调研 5 个目标用户的真实痛点' },
          { day: 'Day 2', task: '搭建简历优化 MVP' },
          { day: 'Day 3', task: '对接语音 API，做模拟面试 demo' },
          { day: 'Day 4', task: 'UI 完善 + 评分反馈系统' },
          { day: 'Day 5', task: '免费开放 100 个应届生测试' },
          { day: 'Day 6', task: '收集反馈，迭代' },
          { day: 'Day 7', task: '上线付费' },
        ],
      },
      sources: STANDARD_SOURCES.slice(0, 3),
      related: ['demo_bo_001'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo_bo_005',
      mode: 'blue-ocean',
      rank: 5,
      name: '小众兴趣社区付费会员平台',
      oneLiner: '为冷门兴趣（如手账/黑胶/盆栽）爱好者提供纯净社区',
      valueProposition: '为手账、黑胶、盆栽等冷门兴趣爱好者提供纯净社区+付费会员内容（教学/评测/同好会），月费 29 元。',
      scores: mkScores({ demand: 6.5, blue_ocean: 7.0, monetize: 6.5, tech_feasible: 7.0, entry_barrier: 7.5, growth: 6.5 }, 'blue-ocean'),
      overall: 6.80,
      marketSize: '5-10 亿元/年',
      entryBarrier: '高（需冷启动社区）',
      startupCost: '1-2 万',
      market: {
        marketSize: { value: '5-10 亿元/年', source: '行业综合 [2]' },
        growthDrivers: ['Z 世代兴趣消费意愿强', '通用社区被算法主导，垂直社区稀缺', '付费会员模式成熟'],
        targetUser: { age: '18-30 岁', job: '学生/年轻白领', scale: '小众但精准 100 万+', scenario: '渴望找到同好+深度内容' },
        trend: '小众兴趣社区未来 3 年仍有窗口期。',
      },
      competition: {
        competitors: [
          { name: '豆瓣小组', features: '通用兴趣社区', pricing: '免费', userScale: '亿级', pros: '品牌强', cons: '商业化弱、广告多' },
          { name: '小红书话题', features: '图文种草', pricing: '免费', userScale: '亿级', pros: '流量大', cons: '算法主导、转化弱' },
        ],
        differentiation: ['纯净（无广告）', '付费会员深度内容', '强社区氛围'],
      },
      business: {
        models: [
          { name: '会员制', description: '29 元/月', priceHint: '29 元/月' },
          { name: '同好会', description: '线上/线下活动', priceHint: '99-299 元/次' },
        ],
        cost: [
          { item: '服务器', estimate: '1000 元/月' },
          { item: '内容运营', estimate: '3000-5000 元/月' },
        ],
        paybackPeriod: '按 500 付费会员计算，4-6 个月回本',
      },
      devilsAdvocate: [
        {
          title: '冷启动极难',
          reasoning: '通用社区流量大但你的冷门社区 0 用户起，3-6 个月没有起色就会死。',
          rebuttal: '从 1 个 KOL 切入，让他带 1000 个粉丝入驻。',
        },
      ],
      survival: {
        title: 'MVP 策略',
        steps: ['选 1 个最冷门但有深度的兴趣（手账）', '签约 3 个 KOL', '3 个月内做到 5000 注册用户'],
      },
      action: {
        startupCost: '1-2 万',
        teamSize: '1 人',
        sevenDayPlan: [
          { day: 'Day 1', task: '选定 1 个细分兴趣，签约 1 个 KOL' },
          { day: 'Day 2', task: '搭建社区 MVP（论坛形式）' },
          { day: 'Day 3', task: 'KOL 发入驻帖 + 30 篇内容' },
          { day: 'Day 4', task: '建立付费会员墙（核心内容）' },
          { day: 'Day 5', task: '免费拉 100 个种子用户' },
          { day: 'Day 6', task: '收集反馈，迭代' },
          { day: 'Day 7', task: '上线月度会员' },
        ],
      },
      sources: STANDARD_SOURCES.slice(0, 3),
      related: ['demo_bo_003'],
      createdAt: new Date().toISOString(),
    },
  ],
  'red-niche': [],
  'cross-domain': [],
  'analyze': [],
};

/** 生成 4 模式完整的演示报告 ID */
export function getDemoOpportunities(mode: DiscoveryMode): Opportunity[] {
  if (mode === 'red-niche') {
    return [
      { ...SAMPLE_OPPORTUNITIES['blue-ocean'][0], id: 'demo_rn_001', mode: 'red-niche', rank: 1, name: '小红书细分母婴博主代运营', oneLiner: '为二线城市母婴店老板做小红书内容代运营', valueProposition: '聚焦"二线城市母婴店"细分人群，提供小红书内容代运营+本地化探店，单店年费 1.2 万。', scores: mkScores({ demand: 8.5, blue_ocean: 8.5, monetize: 8.0, tech_feasible: 7.0, entry_barrier: 7.5, growth: 6.5 }, 'red-niche'), overall: 7.95, marketSize: '8-15 亿元/年', entryBarrier: '中', startupCost: '1-3 万' },
      { ...SAMPLE_OPPORTUNITIES['blue-ocean'][0], id: 'demo_rn_002', mode: 'red-niche', rank: 2, name: '小红书企业号 AI 私信接待', oneLiner: '为小红书企业号提供 7x24 AI 私信自动回复', valueProposition: '针对小红书企业号的私信营销场景，提供 7x24 AI 自动回复+意向客户识别，月费 299 元。', scores: mkScores({ demand: 7.5, blue_ocean: 8.0, monetize: 7.5, tech_feasible: 8.0, entry_barrier: 7.0, growth: 6.5 }, 'red-niche'), overall: 7.45, marketSize: '5-10 亿元/年', entryBarrier: '低', startupCost: '1-2 万' },
      { ...SAMPLE_OPPORTUNITIES['blue-ocean'][0], id: 'demo_rn_003', mode: 'red-niche', rank: 3, name: '抖音小店客服外包（垂直美妆）', oneLiner: '专注美妆类抖音小店的客服外包服务', valueProposition: '专为美妆类抖音小店提供 7x12 客服外包，单店月费 1500 元，已有 3 个店验证付费意愿。', scores: mkScores({ demand: 7.0, blue_ocean: 7.5, monetize: 8.0, tech_feasible: 7.0, entry_barrier: 8.0, growth: 6.0 }, 'red-niche'), overall: 7.25, marketSize: '10-20 亿元/年', entryBarrier: '中', startupCost: '2-4 万' },
      { ...SAMPLE_OPPORTUNITIES['blue-ocean'][0], id: 'demo_rn_004', mode: 'red-niche', rank: 4, name: '拼多多农产品冷链代发货', oneLiner: '为小农商家提供冷链代发+包装服务', valueProposition: '聚焦拼多多生鲜商家，整合区域冷链资源，提供次日达冷链代发，单单 5-15 元抽佣。', scores: mkScores({ demand: 7.0, blue_ocean: 7.0, monetize: 7.5, tech_feasible: 6.5, entry_barrier: 8.5, growth: 6.0 }, 'red-niche'), overall: 7.05, marketSize: '15-30 亿元/年', entryBarrier: '高', startupCost: '5-10 万' },
      { ...SAMPLE_OPPORTUNITIES['blue-ocean'][0], id: 'demo_rn_005', mode: 'red-niche', rank: 5, name: '微信公众号 SEO 优化服务', oneLiner: '为公众号运营者提供 SEO 长尾流量获取', valueProposition: '专门为本地服务类公众号做微信搜一搜 SEO 优化，单号月费 800 元，已有 5 个客户。', scores: mkScores({ demand: 6.5, blue_ocean: 7.0, monetize: 7.0, tech_feasible: 7.5, entry_barrier: 7.0, growth: 6.0 }, 'red-niche'), overall: 6.80, marketSize: '3-5 亿元/年', entryBarrier: '低', startupCost: '1-2 万' },
    ];
  }
  if (mode === 'cross-domain') {
    return [
      { ...SAMPLE_OPPORTUNITIES['blue-ocean'][0], id: 'demo_cd_001', mode: 'cross-domain', rank: 1, name: '教育行业的"游戏化积分"系统', oneLiner: '把游戏行业成熟的任务/成就/排行榜系统搬到教培', valueProposition: '把游戏行业成熟的任务/成就/排行榜系统搬到 K12 教培场景，提升完课率 30%+，单机构年费 1 万。', scores: mkScores({ demand: 8.0, blue_ocean: 7.5, monetize: 7.0, tech_feasible: 7.0, entry_barrier: 7.5, growth: 7.0 }, 'cross-domain'), overall: 7.50, marketSize: '20-40 亿元/年', entryBarrier: '中', startupCost: '3-5 万' },
      { ...SAMPLE_OPPORTUNITIES['blue-ocean'][0], id: 'demo_cd_002', mode: 'cross-domain', rank: 2, name: '餐饮行业的"健身行业教练 SaaS"', oneLiner: '把教练行业的会员/排课/续费 SaaS 搬到中小餐饮', valueProposition: '把健身行业成熟的会员卡/排课/续费 SaaS 搬到中小餐饮老板，降低用户流失 20%。', scores: mkScores({ demand: 7.5, blue_ocean: 7.0, monetize: 7.5, tech_feasible: 6.5, entry_barrier: 7.5, growth: 7.0 }, 'cross-domain'), overall: 7.20, marketSize: '15-25 亿元/年', entryBarrier: '中', startupCost: '2-4 万' },
      { ...SAMPLE_OPPORTUNITIES['blue-ocean'][0], id: 'demo_cd_003', mode: 'cross-domain', rank: 3, name: '宠物行业的"医疗级"营养品', oneLiner: '把人保健品的研发标准搬到宠物食品', valueProposition: '把人保健品的研发+原料+品控标准搬到宠物食品，做"宠物医疗级营养品"，单 SKU 客单价 200+。', scores: mkScores({ demand: 8.0, blue_ocean: 6.5, monetize: 8.0, tech_feasible: 6.0, entry_barrier: 8.0, growth: 6.5 }, 'cross-domain'), overall: 7.10, marketSize: '30-50 亿元/年', entryBarrier: '高', startupCost: '10-20 万' },
      { ...SAMPLE_OPPORTUNITIES['blue-ocean'][0], id: 'demo_cd_004', mode: 'cross-domain', rank: 4, name: '法律行业的"小红书化"内容营销', oneLiner: '把小红书的图文种草打法搬到律所/法律咨询', valueProposition: '把小红书/抖音的图文+视频种草打法搬到律所或法律咨询机构，提升咨询转化率 50%。', scores: mkScores({ demand: 7.5, blue_ocean: 6.5, monetize: 7.0, tech_feasible: 7.0, entry_barrier: 7.0, growth: 6.5 }, 'cross-domain'), overall: 6.95, marketSize: '5-10 亿元/年', entryBarrier: '中', startupCost: '1-3 万' },
      { ...SAMPLE_OPPORTUNITIES['blue-ocean'][0], id: 'demo_cd_005', mode: 'cross-domain', rank: 5, name: '工业设备的"消费级 App 体验"', oneLiner: '把消费级 IoT 的简洁 App 体验搬到工业设备', valueProposition: '把消费级 IoT（小米/华为）的简洁 App 体验搬到工业设备（机床/传感器），帮助传统制造业数字化升级。', scores: mkScores({ demand: 7.0, blue_ocean: 7.0, monetize: 7.0, tech_feasible: 6.0, entry_barrier: 8.0, growth: 7.0 }, 'cross-domain'), overall: 6.90, marketSize: '50-100 亿元/年', entryBarrier: '高', startupCost: '15-30 万' },
    ];
  }
  if (mode === 'analyze') {
    return [
      { ...SAMPLE_OPPORTUNITIES['blue-ocean'][0], id: 'demo_an_001', mode: 'analyze', rank: 1, name: '深度拆解：本地商家 AI 营销文案生成器', oneLiner: '为本地餐饮/零售商家 30 秒生成多平台营销文案', valueProposition: '基于前述蓝海分析的机会，进一步做魔鬼辩护、用户访谈、付费意愿验证，给出最终可执行结论。', scores: mkScores({ demand: 7.5, blue_ocean: 9.0, monetize: 7.0, tech_feasible: 8.5, entry_barrier: 7.0, growth: 6.5 }, 'analyze'), overall: 7.55, marketSize: '50-100 亿元/年', entryBarrier: '中', startupCost: '3-5 万' },
    ];
  }
  return SAMPLE_OPPORTUNITIES['blue-ocean'];
}

/** 演示模式历史报告 */
export function getDemoHistory(): FullReport[] {
  const demoProfile: UserProfile = {
    budget: '5w_20w', time: 'half_time', skills: ['tech', 'design', 'data'], goal: '20k',
  };
  const blueReport: FullReport = {
    id: 'demo_report_h01',
    mode: 'blue-ocean',
    userProfile: demoProfile,
    opportunities: SAMPLE_OPPORTUNITIES['blue-ocean'],
    durationSec: 86.4,
    status: 'completed',
    agentProgress: [
      { name: 'discoverer', status: 'done', startedAt: '', endedAt: '' },
      { name: 'market_analyst', status: 'done', startedAt: '', endedAt: '' },
      { name: 'competitor', status: 'done', startedAt: '', endedAt: '' },
      { name: 'user_researcher', status: 'done', startedAt: '', endedAt: '' },
      { name: 'monetize', status: 'done', startedAt: '', endedAt: '' },
      { name: 'chief_reviewer', status: 'done', startedAt: '', endedAt: '' },
      { name: 'devil', status: 'done', startedAt: '', endedAt: '' },
    ],
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 3600_000 + 86_400).toISOString(),
  };
  const redReport: FullReport = {
    id: 'demo_report_h02',
    mode: 'red-niche',
    userProfile: demoProfile,
    opportunities: getDemoOpportunities('red-niche'),
    durationSec: 78.2,
    status: 'completed',
    agentProgress: [
      { name: 'discoverer', status: 'done', startedAt: '', endedAt: '' },
      { name: 'market_analyst', status: 'done', startedAt: '', endedAt: '' },
      { name: 'competitor', status: 'done', startedAt: '', endedAt: '' },
      { name: 'user_researcher', status: 'done', startedAt: '', endedAt: '' },
      { name: 'monetize', status: 'done', startedAt: '', endedAt: '' },
      { name: 'chief_reviewer', status: 'done', startedAt: '', endedAt: '' },
      { name: 'devil', status: 'done', startedAt: '', endedAt: '' },
    ],
    createdAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
    completedAt: new Date(Date.now() - 26 * 3600_000 + 78_200).toISOString(),
  };
  return [blueReport, redReport];
}
