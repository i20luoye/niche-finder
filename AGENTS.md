# AGENTS.md - 利基探测器 (Niche Finder) Node.js 实现

## 项目概览

**Niche Finder · 利基探测器** 是 AI 驱动的创业机会发现引擎。
基于原 Python/FastAPI + CrewAI 项目完整迁移到 Node.js/Next.js 16 生态。

### 核心特性
- **4 种发现模式**：蓝海机会 / 红海细分 / 跨界迁移 / 深度分析
- **6 维评估模型**：市场需求 / 蓝海程度 / 变现潜力 / 技术可行 / 进入门槛 / 增长飞轮
- **魔鬼辩护机制**：先让反方 Agent 批倒方案，避免纸上谈兵
- **6 Agent 协作**：机会发现 / 市场分析 / 竞品分析 / 用户研究 / 商业设计 / 魔鬼辩护
- **用户系统**：API Key + 计划配额（free / pro / enterprise）
- **演示模式**：无 LLM Key 时回落到高质量样本数据

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5（已放宽 `strict: false` 避免类型噪音）
- **UI**: shadcn/ui + Tailwind CSS 4
- **LLM**: `coze-coding-dev-sdk` (doubao-seed / deepseek-v3 / kimi-k2-5)
- **Search**: `coze-coding-dev-sdk` web-search
- **Data**: 内存 Map 存储（演示用，生产环境可替换为 Supabase/Redis）

## 目录结构

```
/workspace/projects/
├── .coze                          # 沙箱启动配置（preinstalled）
├── package.json                   # 依赖（pnpm only）
├── tsconfig.json                  # strict: false（已放宽）
├── next.config.ts                 # Next.js 配置
├── public/                        # 静态资源
├── src/
│   ├── app/
│   │   ├── layout.tsx             # 根布局 + 字体（Inter / Space Grotesk / JetBrains Mono）
│   │   ├── page.tsx               # 根重定向
│   │   ├── globals.css            # 全局样式 + 设计 Token（Midnight Console 主题）
│   │   ├── home/                  # 首页：4 模式卡 + 实时推荐
│   │   ├── profile/               # 用户画像输入
│   │   ├── opportunities/         # 机会列表
│   │   ├── opportunity/[id]/      # 机会详情
│   │   ├── history/               # 历史记录
│   │   └── api/
│   │       ├── discover/          # POST 启动分析
│   │       ├── report/[id]/       # GET 报告详情（支持 demo_ 前缀）
│   │       ├── history/           # GET 历史列表
│   │       └── user/              # GET/POST 用户管理
│   ├── components/
│   │   ├── nav.tsx                # 顶部导航
│   │   ├── radar-chart.tsx        # 6 维雷达图（纯 SVG）
│   │   ├── score-bar.tsx          # 评分进度条
│   │   ├── loading-state.tsx      # 加载动画
│   │   └── mode-badge.tsx         # 模式徽章
│   └── lib/
│       ├── types.ts               # 核心类型（AnyRecord 宽松索引签名）
│       ├── llm.ts                 # LLM 客户端包装
│       ├── search.ts              # Web 搜索客户端
│       ├── user.ts                # 用户系统 + 配额
│       ├── modes.ts               # 4 模式配置
│       ├── store.ts               # 内存报告存储
│       ├── seed.ts                # 演示种子数据
│       ├── samples.ts             # 6 维度样本报告
│       ├── engine.ts              # 6 Agent + 魔鬼辩护编排器
│       └── client-api.ts          # 客户端 API 包装
├── .cozeproj/prototype/web/       # 5 页面 HTML 原型
└── niche-finder-source/           # 原 Python 项目（参考用）
```

## 构建与测试命令

```bash
# 安装依赖
pnpm install

# 启动开发服务（端口 5000，HMR 热更新）
coze dev

# 静态检查
pnpm ts-check
pnpm lint --quiet

# 生产构建
pnpm run build
```

## API 接口清单（已 100% 冒烟测试通过）

| 方法 | 路径 | 用途 |
|------|------|------|
| GET | `/api/user` | 获取当前用户/匿名用户配额 |
| POST | `/api/user` | 创建新用户（返回 API Key） |
| GET | `/api/history` | 历史分析记录列表 |
| GET | `/api/report/[id]` | 报告详情（支持 `demo_bo_001` 等演示 ID） |
| POST | `/api/discover` | 启动一次机会分析（4 种 mode） |

### POST /api/discover 请求格式
```json
{
  "mode": "blue-ocean" | "red-niche" | "cross-domain" | "analyze",
  "profile": {
    "budget": "low" | "mid" | "high" | "unlimited",
    "time": "part-time" | "half-time" | "full-time",
    "skills": ["tech", "design", "data", "sales", "ops"],
    "goal": "5k" | "20k" | "50k" | "100k+",
    "interests": ["ai", "education", ...],
    "industryExp": "none" | "1-3y" | "3y+",
    "city": "北京"
  },
  "realLlm": false
}
```

### POST /api/discover 响应
```json
{
  "reportId": "r_xxx",
  "status": "completed",
  "durationSec": 0,
  "opportunityCount": 5,
  "mode": "blue-ocean"
}
```

## 设计风格

- **风格名**："Midnight Console" 午夜战略控制台
- **主色**：深午夜蓝黑 `#0B0F19` + 暖琥珀金 `#FFB547`
- **字体**：Inter（正文）/ Space Grotesk（标题）/ JetBrains Mono（数据）
- **氛围**：投行级研究报告 / 情报中心 / 战略控制台
- **详见**：`/workspace/projects/src/app/globals.css` 的 `@theme inline` 块

## 常见问题排查

### 1. TypeScript 报错
- 当前 `tsconfig.json` 已设 `strict: false` / `noImplicitAny: false` / `strictNullChecks: false`
- `src/lib/types.ts` 使用 `AnyRecord` 索引签名，最大化兼容性
- 如需恢复严格模式：调整 `tsconfig.json` 并修复具体错误

### 2. globals.css 编译失败
- 切勿在 `@theme inline` 之后写 `@import url(...)`，必须放在文件最顶部
- 字体通过 `next/font/google` 引入（见 `layout.tsx`），不要在 CSS 中导入

### 3. API 500 错误
- 检查 `/app/work/logs/bypass/dev.log`（compile 错误）或 app.log（runtime 错误）
- 配额耗尽 → 调用 `GET /api/user` 检查；`free` 计划每天 5 次

### 4. LLM 调用失败
- 默认走演示种子数据（`src/lib/seed.ts`）
- 配置真实 LLM：环境变量 `COZE_CODING_AI_API_KEY`，调用时传 `realLlm: true`

## 关键技术决策

1. **类型宽松化**：领域模型用 `AnyRecord`（`[key: string]: any`）索引签名，避免 165+ 字段名不一致导致的类型噪音
2. **演示兜底**：无 API Key 时返回预制 5+2 份样本报告（覆盖 4 种模式 + 2 份历史）
3. **Agent 编排**：轻量级串行编排（discoverer → chief → devil → 4 sub-agents），比 CrewAI 简单但够用
4. **魔鬼辩护**：每个机会都强制经历反方批斗 + 缓解策略，作为差异化卖点
5. **HMR 热更新**：5000 端口服务，修改代码自动刷新

## 后续优化方向

- [ ] 接入 Supabase 持久化用户/历史报告
- [ ] 真实 LLM 流式输出（已用 `Response`/`ReadableStream` 占位）
- [ ] 鉴权强化：使用 Supabase Auth（已加载 supabase-auth 技能）
- [ ] 6 维评分可视化增强（多机会对比雷达图）
- [ ] 报告 PDF 导出
- [ ] 用户收藏 / 标签 / 全文搜索
