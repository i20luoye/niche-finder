#!/usr/bin/env python3
"""
端到端真实测试 - AI利基产品发现器
直接用LLM+Tavily搜索生成报告，验证核心价值
"""
import os
import sys
import json
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# 加载环境变量
from dotenv import load_dotenv
load_dotenv()

from openai import OpenAI
from tavily import TavilyClient

# 初始化客户端
llm_client = OpenAI(
    api_key=os.environ.get("SENSENOVA_API_KEY"),
    base_url=os.environ.get("OPENAI_BASE_URL", "https://token.sensenova.cn/v1"),
)

tavily_client = TavilyClient(
    api_key=os.environ.get("TAVILY_API_KEY"),
)

MODEL = os.environ.get("LLM_MODEL", "deepseek-v4-flash")


def search(query: str, max_results: int = 5) -> str:
    """搜索并格式化结果"""
    try:
        result = tavily_client.search(
            query=query,
            max_results=max_results,
            search_depth="advanced",
            include_answer=True,
        )
        output = f"### 搜索: {query}\n\n"
        if result.get("answer"):
            output += f"**摘要**: {result['answer']}\n\n"
        for i, doc in enumerate(result.get("results", []), 1):
            output += f"{i}. **{doc.get('title', '')}**\n"
            output += f"   URL: {doc.get('url', '')}\n"
            output += f"   内容: {doc.get('content', '')[:400]}\n\n"
        return output
    except Exception as e:
        return f"搜索出错: {e}"


def llm_call(system_prompt: str, user_prompt: str, max_tokens: int = 4096) -> str:
    """调用LLM"""
    resp = llm_client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.4,
        max_tokens=max_tokens,
    )
    return resp.choices[0].message.content


def run_blue_ocean_analysis(domain: str, constraints: dict = None) -> str:
    """蓝海模式分析 - 两阶段"""
    print(f"\n{'='*60}")
    print(f"🔵 蓝海模式: {domain}")
    print(f"{'='*60}")
    
    # 阶段1: 搜索市场数据
    print("\n[阶段1] 搜索市场数据...")
    t1 = time.time()
    
    search_queries = [
        f"{domain} 市场空白 机会 2025 2026",
        f"{domain} 用户痛点 未满足需求",
        f"{domain} 竞品分析 新兴趋势",
    ]
    
    search_results = ""
    for q in search_queries:
        search_results += search(q, max_results=3) + "\n---\n"
    
    print(f"  搜索完成 ({time.time()-t1:.1f}s)")
    
    # 阶段2: 机会发现
    print("\n[阶段2] 机会发现...")
    t2 = time.time()
    
    discovery_prompt = f"""你是一位连续创业者和产品猎人，擅长从市场空白中发现利基产品机会。

基于以下搜索结果，在「{domain}」领域发现3-5个蓝海机会。

搜索数据：
{search_results}

约束条件：{json.dumps(constraints or {}, ensure_ascii=False)}

请为每个机会提供：
1. **机会名称**：简洁有力的产品概念
2. **目标用户**：具体到画像（年龄/职业/场景）
3. **核心痛点**：用户现在怎么解决？为什么不满意？
4. **解决方案**：你的产品怎么解决？（核心功能3条）
5. **市场数据**：市场规模/增长率/付费意愿（基于搜索数据估算）
6. **竞争格局**：现有竞品及其不足
7. **六维评分**（1-10分）：
   - 市场需求度
   - 竞争蓝海度（越高=越蓝海）
   - 变现潜力
   - 技术可行性
   - 启动门槛（越高=越容易启动）
   - 增长飞轮

重要：所有市场数据必须有来源依据，不要编造数字。如果搜索数据不足，明确标注"数据待验证"。"""

    opportunities = llm_call(discovery_prompt[:8000], f"请分析「{domain}」领域的蓝海机会", max_tokens=4096)
    print(f"  机会发现完成 ({time.time()-t2:.1f}s)")
    
    # 阶段3: 评审排序
    print("\n[阶段3] 评审排序...")
    t3 = time.time()
    
    ranking_prompt = f"""你是一位铁面无私的首席产品评审官，擅长对创业机会进行评估排序。

以下是在「{domain}」领域发现的蓝海机会：

{opportunities}

请执行以下评审：
1. **评分总表**：用表格展示每个机会的六维评分和加权总分
   - 权重：市场需求度30%、竞争蓝海度25%、变现潜力25%、技术可行性10%、启动门槛5%、增长飞轮5%
2. **Top 1 深度分析**：
   - 为什么是这个而不是其他？（至少3个理由）
   - 7天启动验证方案（具体到每天做什么）
   - 关键风险和应对
3. **最终一句话推荐**

评审原则：只看数据不看情怀，有疑虑就标注。"""

    ranking = llm_call(ranking_prompt[:10000], f"请评审排序以上机会", max_tokens=4096)
    print(f"  评审完成 ({time.time()-t3:.1f}s)")
    
    # 合并报告
    report = f"""# 🔵 蓝海机会分析报告

## 分析领域：{domain}
## 约束条件：{json.dumps(constraints or {}, ensure_ascii=False)}
## 分析时间：{time.strftime('%Y-%m-%d %H:%M')}

---

## 一、市场数据摘要

{search_results[:2000]}

---

## 二、蓝海机会发现

{opportunities}

---

## 三、评审排序与建议

{ranking}

---

*本报告由 AI利基产品发现器 生成，市场数据基于实时搜索，部分数据可能需要进一步验证。*
"""
    return report


def run_red_ocean_niche_analysis(big_market: str, angle: str = "未被满足的需求") -> str:
    """红海细分模式分析"""
    print(f"\n{'='*60}")
    print(f"🔴 红海细分模式: {big_market} | 角度: {angle}")
    print(f"{'='*60}")
    
    # 阶段1: 搜索
    print("\n[阶段1] 搜索市场数据...")
    t1 = time.time()
    
    search_queries = [
        f"{big_market} 细分市场 机会 小众",
        f"{big_market} 用户抱怨 差评 不满",
        f"{big_market} 竞品 缺陷 功能缺失",
    ]
    
    search_results = ""
    for q in search_queries:
        search_results += search(q, max_results=3) + "\n---\n"
    
    print(f"  搜索完成 ({time.time()-t1:.1f}s)")
    
    # 阶段2: 发现细分机会
    print("\n[阶段2] 发现细分机会...")
    t2 = time.time()
    
    discovery_prompt = f"""你是一位红海市场细分专家，擅长在拥挤的大市场中找到被忽视的缝隙。

在「{big_market}」这个已经很拥挤的市场中，从「{angle}」角度找到3-5个细分机会。

搜索数据：
{search_results}

对每个细分机会，提供：
1. **细分方向名称**
2. **目标用户画像**（越具体越好）
3. **被忽视的原因**（为什么大公司不做？）
4. **痛点场景**（用户的真实使用场景）
5. **产品形态**（MVP长什么样？）
6. **差异化壁垒**（别人为什么不容易复制？）
7. **六维评分**（1-10分）

重要：聚焦"小而美"，不要试图颠覆整个市场，而是找到一个足够深的缝隙。"""

    opportunities = llm_call(discovery_prompt[:8000], f"请分析「{big_market}」的细分机会", max_tokens=4096)
    print(f"  机会发现完成 ({time.time()-t2:.1f}s)")
    
    # 阶段3: 评审
    print("\n[阶段3] 评审排序...")
    t3 = time.time()
    
    ranking_prompt = f"""你是首席产品评审官。以下是在「{big_market}」红海中发现的细分机会：

{opportunities}

请执行评审：
1. **评分总表**（六维加权，权重：市场需求30%/蓝海度25%/变现25%/技术10%/门槛5%/飞轮5%）
2. **Top 1深度分析**（为什么是它？7天验证方案？关键风险？）
3. **一句话推荐**"""

    ranking = llm_call(ranking_prompt[:10000], "请评审排序", max_tokens=4096)
    print(f"  评审完成 ({time.time()-t3:.1f}s)")
    
    report = f"""# 🔴 红海细分机会分析报告

## 大市场：{big_market}
## 细分角度：{angle}
## 分析时间：{time.strftime('%Y-%m-%d %H:%M')}

---

## 一、市场数据摘要

{search_results[:2000]}

---

## 二、细分机会发现

{opportunities}

---

## 三、评审排序与建议

{ranking}

---

*本报告由 AI利基产品发现器 生成，市场数据基于实时搜索，部分数据可能需要进一步验证。*
"""
    return report


def run_cross_domain_analysis(domain_a: str, domain_b: str) -> str:
    """跨界模式分析"""
    print(f"\n{'='*60}")
    print(f"🔄 跨界模式: {domain_a} × {domain_b}")
    print(f"{'='*60}")
    
    # 阶段1: 搜索
    print("\n[阶段1] 搜索跨界数据...")
    t1 = time.time()
    
    search_queries = [
        f"{domain_a} {domain_b} 融合 创新应用",
        f"{domain_a} technology applied to {domain_b}",
        f"cross domain innovation {domain_a} {domain_b} startup",
    ]
    
    search_results = ""
    for q in search_queries:
        search_results += search(q, max_results=3) + "\n---\n"
    
    print(f"  搜索完成 ({time.time()-t1:.1f}s)")
    
    # 阶段2: 跨界发现
    print("\n[阶段2] 跨界机会发现...")
    t2 = time.time()
    
    discovery_prompt = f"""你是一位跨界创新专家，擅长将不同领域的知识和技术融合，创造全新产品。

请探索「{domain_a}」×「{domain_b}」的跨界机会。

搜索数据：
{search_results}

对每个跨界机会，提供：
1. **跨界产品概念**（一句话描述）
2. **融合逻辑**（A领域的什么能力解决了B领域的什么问题？）
3. **目标用户**（来自哪个领域？痛点是什么？）
4. **产品形态**（MVP描述）
5. **市场空白**（为什么现在没人做？）
6. **跨界壁垒**（为什么别人不容易想到/做到？）
7. **六维评分**（1-10分）

重要：真正的跨界不是简单叠加，而是1+1>2的化学反应。"""

    opportunities = llm_call(discovery_prompt[:8000], f"请分析「{domain_a}×{domain_b}」的跨界机会", max_tokens=4096)
    print(f"  机会发现完成 ({time.time()-t2:.1f}s)")
    
    # 阶段3: 评审
    print("\n[阶段3] 评审排序...")
    t3 = time.time()
    
    ranking_prompt = f"""你是首席产品评审官。以下是「{domain_a}×{domain_b}」的跨界机会：

{opportunities}

请执行评审：
1. **评分总表**（六维加权）
2. **Top 1深度分析**（跨界可行性？7天验证方案？关键风险？）
3. **一句话推荐**"""

    ranking = llm_call(ranking_prompt[:10000], "请评审排序", max_tokens=4096)
    print(f"  评审完成 ({time.time()-t3:.1f}s)")
    
    report = f"""# 🔄 跨界机会分析报告

## 领域A：{domain_a}
## 领域B：{domain_b}
## 分析时间：{time.strftime('%Y-%m-%d %H:%M')}

---

## 一、跨界数据摘要

{search_results[:2000]}

---

## 二、跨界机会发现

{opportunities}

---

## 三、评审排序与建议

{ranking}

---

*本报告由 AI利基产品发现器 生成，市场数据基于实时搜索，部分数据可能需要进一步验证。*
"""
    return report


if __name__ == "__main__":
    print("🚀 AI利基产品发现器 - 端到端真实测试")
    print("=" * 60)
    
    total_start = time.time()
    
    # 测试1: 蓝海模式 - 独立开发者AI副业方向
    report1 = run_blue_ocean_analysis(
        "独立开发者AI副业方向",
        {"budget": "5000元/月", "time": "业余时间", "skills": "编程+产品设计"}
    )
    with open("test_report_1_blue_ocean.md", "w") as f:
        f.write(report1)
    print(f"\n✅ 报告1已保存: test_report_1_blue_ocean.md")
    
    # 测试2: 红海细分 - AI写作工具
    report2 = run_red_ocean_niche_analysis(
        "AI写作工具",
        "特定场景的未被满足需求"
    )
    with open("test_report_2_red_ocean.md", "w") as f:
        f.write(report2)
    print(f"\n✅ 报告2已保存: test_report_2_red_ocean.md")
    
    # 测试3: 跨界模式 - AI × 健身
    report3 = run_cross_domain_analysis("AI", "健身")
    with open("test_report_3_cross_domain.md", "w") as f:
        f.write(report3)
    print(f"\n✅ 报告3已保存: test_report_3_cross_domain.md")
    
    total_time = time.time() - total_start
    print(f"\n{'='*60}")
    print(f"🏁 全部测试完成！总耗时: {total_time:.1f}s")
    print(f"{'='*60}")
