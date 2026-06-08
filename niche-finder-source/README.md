# NicheFinder AI - AI利基产品发现器

基于多Agent协作的创业机会发现引擎。输入你感兴趣的领域，AI自动进行市场调研、竞品分析、商业评估和技术可行性分析，几分钟输出高质量创业机会报告。

## ✨ 功能特点

- 🎯 **四大分析模式**：蓝海模式、红海细分、跨界机会、深度分析
- 🤖 **多Agent协作**：5个专业Agent（市场/竞争/财务/技术/评审）协同工作
- 📊 **六维评分体系**：雷达图可视化，量化评估每个机会
- 📝 **结构化报告**：输出可执行的行动方案，不只是分析
- ⚡ **分钟级输出**：基于全网数据的深度调研
- 💾 **历史记录**：本地保存分析历史，随时回顾

## 🛠️ 技术架构

### 前端
- 纯HTML/CSS/JS单页应用
- Tailwind CSS 样式框架
- Chart.js 数据可视化
- Font Awesome 图标库
- 零构建，开箱即用

### 后端
- FastAPI 高性能Web框架
- CrewAI 多Agent编排
- GPT Researcher 深度调研
- LiteLLM 多模型适配
- 支持日日新/OpenAI/Anthropic等多种LLM

### 部署
- Docker 容器化
- 支持多种部署方式
- 环境变量配置

## 📦 安装与运行

### 方式一：Docker运行（推荐）

```bash
# 构建镜像
docker build -t nichefinder .

# 运行容器
docker run -d \
  --name nichefinder \
  -p 8000:8000 \
  -e TAVILY_API_KEY=your_tavily_key \
  -e LITELLM_API_KEY=your_llm_key \
  -e LITELLM_BASE_URL=https://api.example.com/v1 \
  -e LITELLM_MODEL=gpt-4o-mini \
  nichefinder
```

### 方式二：本地运行

```bash
# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的API密钥

# 启动服务
python server.py
```

访问 http://localhost:8000 即可使用。

## 🔧 配置说明

### 环境变量

| 变量名 | 说明 | 必填 | 默认值 |
|--------|------|------|--------|
| `TAVILY_API_KEY` | Tavily搜索API密钥 | 是 | - |
| `LITELLM_API_KEY` | LLM API密钥 | 是 | - |
| `LITELLM_BASE_URL` | LLM API基础地址 | 否 | https://api.openai.com/v1 |
| `LITELLM_MODEL` | 使用的模型名称 | 否 | gpt-4o-mini |
| `PORT` | 服务端口 | 否 | 8000 |
| `HOST` | 监听地址 | 否 | 0.0.0.0 |

### Embedding配置

系统支持多种Embedding后端，按优先级自动降级：

1. 智谱AI Embedding
2. 通义千问 Embedding
3. 本地模型（sentence-transformers）
4. TF-IDF关键词相似度（兜底方案）

配置对应的API密钥即可启用更高质量的Embedding方案。

## 🎯 使用方式

### 四大分析模式

1. **蓝海模式**：在指定领域中寻找低竞争、高增长的空白市场
2. **红海细分模式**：在拥挤的大市场中，找到未被满足的细分需求
3. **跨界机会模式**：探索两个领域交叉融合产生的新产品机会
4. **深度分析模式**：对单个产品方向进行四维深度评估

### API调用

```python
import requests

# 开始分析
response = requests.post("http://localhost:8000/api/analyze", json={
    "mode": "blue-ocean",
    "query": "独立开发者工具"
})
task_id = response.json()["task_id"]

# 查询结果
import time
while True:
    result = requests.get(f"http://localhost:8000/api/tasks/{task_id}")
    data = result.json()
    if data["status"] == "completed":
        print(data["result"])
        break
    time.sleep(3)
```

## 📂 项目结构

```
niche-finder/
├── web/
│   └── index.html          # 前端单页应用
├── niche_finder/
│   ├── agents/             # Agent定义
│   │   └── niche_agents.py
│   ├── tasks/              # 任务定义
│   │   └── niche_tasks.py
│   ├── config/             # 配置
│   │   └── settings.py
│   ├── utils/              # 工具函数
│   │   ├── tools.py
│   │   └── embedding.py
│   ├── research/           # 深度调研
│   │   └── deep_research.py
│   ├── crew.py             # Crew编排
│   ├── discovery_modes.py  # 发现模式
│   └── main.py             # CLI入口
├── server.py               # FastAPI后端
├── Dockerfile              # Docker配置
├── requirements.txt        # Python依赖
└── README.md               # 项目文档
```

## 🚀 开发计划

### v1.0 - 基础版本 ✅
- [x] 多Agent协作框架
- [x] 四大分析模式
- [x] 六维评分体系
- [x] 基础Web界面
- [x] API接口

### v1.5 - 体验优化 🔄
- [ ] 雷达图可视化
- [ ] 历史记录功能
- [ ] 报告分享功能
- [ ] 移动端适配
- [ ] 深色模式

### v2.0 - 用户系统
- [ ] 用户注册登录
- [ ] 付费订阅系统
- [ ] 使用次数限制
- [ ] 报告云同步
- [ ] 团队协作功能

### v3.0 - 高级功能
- [ ] 自定义分析维度
- [ ] 竞品监控
- [ ] 市场趋势追踪
- [ ] 投资回报计算器
- [ ] API开放平台

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## ⚠️ 免责声明

本工具生成的分析仅供参考，不构成投资建议。创业有风险，入市需谨慎。
