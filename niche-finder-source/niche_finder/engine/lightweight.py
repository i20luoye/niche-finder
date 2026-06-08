#!/usr/bin/env python3
"""
轻量级分析引擎 - AI利基产品发现器
直接用LLM + Tavily搜索生成报告，替代CrewAI重模式
优势：速度快（~90秒 vs 5-8分钟）、成本低、稳定性高
"""
import os
import json
import time
from typing import Optional

from openai import OpenAI
from tavily import TavilyClient


class LightweightEngine:
    """轻量级分析引擎"""
    
    def __init__(self):
        self.llm = OpenAI(
            api_key=os.environ.get("SENSENOVA_API_KEY") or os.environ.get("OPENAI_API_KEY"),
            base_url=os.environ.get("OPENAI_BASE_URL", "https://token.sensenova.cn/v1"),
        )
        self.tavily = TavilyClient(
            api_key=os.environ.get("TAVILY_API_KEY"),
        )
        self.model = os.environ.get("LLM_MODEL", "deepseek-v4-flash")
    
    def _search(self, queries: list, max_results: int = 3) -> str:
        """多轮搜索并格式化"""
        results = ""
        for q in queries:
            try:
                r = self.tavily.search(
                    query=q,
                    max_results=max_results,
                    search_depth="advanced",
                    include_answer=True,
                )
                results += f"### 搜索: {q}\n"
                if r.get("answer"):
                    results += f"摘要: {r['answer']}\n"
                for d in r.get("results", []):
                    results += f"- {d.get('title','')} | {d.get('content','')[:400]}\n"
                results += "\n"
            except Exception as e:
                results += f"搜索出错({q}): {e}\n"
        return results
    
    def _llm(self, system: str, user: str, max_tokens: int = 4096) -> str:
        """调用LLM"""
        resp = self.llm.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            temperature=0.4,
            max_tokens=max_tokens,
        )
        return resp.choices[0].message.content
    
    def blue_ocean(self, domain: str, constraints: dict = None) -> str:
        """蓝海模式分析"""
        t0 = time.time()
        constraints_str = json.dumps(constraints or {}, ensure_ascii=False)
        
        # 搜索
        search_data = self._search([
            f"{domain} 市场空白 蓝海机会 2025 2026",
            f"{domain} 用户痛点 未满足需求",
            f"{domain} 竞品分析 新兴趋势 startup",
        ])
        search_time = time.time() - t0
        
        # 发现
        t1 = time.time()
        discovery = self._llm(
            "你是一位连续创业者和产品猎人，擅长从市场空白中发现利基产品机会。输出必须基于真实搜索数据，不要编造。",
            f"""在「{domain}」领域发现3-5个蓝海机会。

搜索数据：
{search_data[:5000]}

约束条件：{constraints_str}

对每个机会提供：
1. **机会名称**：简洁有力的产品概念
2. **目标用户**：具体画像（年龄/职业/场景）
3. **核心痛点**：用户现在怎么解决？为什么不满意？
4. **解决方案**：核心功能3条
5. **市场数据**：基于搜索数据估算（标注数据来源）
6. **竞争格局**：现有竞品及不足
7. **六维评分**（1-10分）：市场需求度/竞争蓝海度/变现潜力/技术可行性/启动门槛/增长飞轮"""
        )
        discovery_time = time.time() - t1
        
        # 评审
        t2 = time.time()
        ranking = self._llm(
            "你是一位铁面无私的首席产品评审官，只看数据不看情怀。",
            f"""以下是在「{domain}」领域发现的蓝海机会：

{discovery}

请执行评审：
1. **评分总表**（六维加权：市场需求30%/蓝海度25%/变现25%/技术10%/门槛5%/飞轮5%）
2. **Top 1深度分析**：为什么是这个？7天启动验证方案？关键风险？
3. **为什么不推荐其他**（简述）
4. **最终一句话推荐**"""
        )
        ranking_time = time.time() - t2
        
        return f"""# 🔵 蓝海机会分析报告

## 分析领域：{domain}
## 约束条件：{constraints_str}
## 分析时间：{time.strftime('%Y-%m-%d %H:%M')}
## 耗时：搜索{search_time:.0f}s + 发现{discovery_time:.0f}s + 评审{ranking_time:.0f}s = {time.time()-t0:.0f}s

---

## 一、市场数据摘要

{search_data[:2000]}

---

## 二、蓝海机会发现

{discovery}

---

## 三、评审排序与建议

{ranking}

---

*本报告由 AI利基产品发现器 生成，市场数据基于实时搜索，部分数据需进一步验证。*
"""
    
    def red_ocean_niche(self, big_market: str, angle: str = "未被满足的需求") -> str:
        """红海细分模式分析"""
        t0 = time.time()
        
        search_data = self._search([
            f"{big_market} 细分市场 机会 小众",
            f"{big_market} 用户抱怨 差评 不满 缺陷",
            f"{big_market} 竞品 功能缺失 niche startup",
        ])
        search_time = time.time() - t0
        
        t1 = time.time()
        discovery = self._llm(
            "你是一位红海市场细分专家，擅长在拥挤的大市场中找到被忽视的缝隙。输出必须基于真实搜索数据。",
            f"""在「{big_market}」这个拥挤市场中，从「{angle}」角度找到3-5个细分机会。

搜索数据：
{search_data[:5000]}

对每个机会提供：
1. **细分方向名称**
2. **目标用户画像**（越具体越好）
3. **被忽视的原因**（为什么大公司不做？）
4. **痛点场景**（用户的真实使用场景）
5. **产品形态**（MVP长什么样？）
6. **差异化壁垒**（别人为什么不容易复制？）
7. **六维评分**（1-10分）

聚焦"小而美"，找一个足够深的缝隙。"""
        )
        discovery_time = time.time() - t1
        
        t2 = time.time()
        ranking = self._llm(
            "你是一位铁面无私的首席产品评审官，只看数据不看情怀。",
            f"""以下是在「{big_market}」红海中发现的细分机会：

{discovery}

请执行评审：
1. **评分总表**（六维加权）
2. **Top 1深度分析**（为什么是它？7天验证方案？关键风险？）
3. **为什么不推荐其他**
4. **一句话推荐**"""
        )
        ranking_time = time.time() - t2
        
        return f"""# 🔴 红海细分机会分析报告

## 大市场：{big_market}
## 细分角度：{angle}
## 分析时间：{time.strftime('%Y-%m-%d %H:%M')}
## 耗时：搜索{search_time:.0f}s + 发现{discovery_time:.0f}s + 评审{ranking_time:.0f}s = {time.time()-t0:.0f}s

---

## 一、市场数据摘要

{search_data[:2000]}

---

## 二、细分机会发现

{discovery}

---

## 三、评审排序与建议

{ranking}

---

*本报告由 AI利基产品发现器 生成，市场数据基于实时搜索，部分数据需进一步验证。*
"""
    
    def cross_domain(self, domain_a: str, domain_b: str) -> str:
        """跨界模式分析"""
        t0 = time.time()
        
        search_data = self._search([
            f"{domain_a} {domain_b} 融合 创新应用",
            f"{domain_a} technology applied to {domain_b} startup",
            f"cross domain innovation {domain_a} {domain_b}",
        ])
        search_time = time.time() - t0
        
        t1 = time.time()
        discovery = self._llm(
            "你是一位跨界创新专家，擅长将不同领域的知识和技术融合，创造全新产品。输出必须基于真实搜索数据。",
            f"""请探索「{domain_a}」×「{domain_b}」的跨界机会。

搜索数据：
{search_data[:5000]}

对每个机会提供：
1. **跨界产品概念**（一句话描述）
2. **融合逻辑**（A领域的什么能力解决了B领域的什么问题？）
3. **目标用户**（来自哪个领域？痛点是什么？）
4. **产品形态**（MVP描述）
5. **市场空白**（为什么现在没人做？）
6. **跨界壁垒**（为什么别人不容易想到/做到？）
7. **六维评分**（1-10分）

真正的跨界是1+1>2的化学反应。"""
        )
        discovery_time = time.time() - t1
        
        t2 = time.time()
        ranking = self._llm(
            "你是一位铁面无私的首席产品评审官，只看数据不看情怀。",
            f"""以下是「{domain_a}×{domain_b}」的跨界机会：

{discovery}

请执行评审：
1. **评分总表**（六维加权）
2. **Top 1深度分析**（跨界可行性？7天验证方案？关键风险？）
3. **为什么不推荐其他**
4. **一句话推荐**"""
        )
        ranking_time = time.time() - t2
        
        return f"""# 🔄 跨界机会分析报告

## 领域A：{domain_a}
## 领域B：{domain_b}
## 分析时间：{time.strftime('%Y-%m-%d %H:%M')}
## 耗时：搜索{search_time:.0f}s + 发现{discovery_time:.0f}s + 评审{ranking_time:.0f}s = {time.time()-t0:.0f}s

---

## 一、跨界数据摘要

{search_data[:2000]}

---

## 二、跨界机会发现

{discovery}

---

## 三、评审排序与建议

{ranking}

---

*本报告由 AI利基产品发现器 生成，市场数据基于实时搜索，部分数据需进一步验证。*
"""
    
    def deep_analysis(self, product_idea: str, target_audience: str = None) -> str:
        """单个产品深度分析"""
        t0 = time.time()
        
        # 四维搜索
        search_data = self._search([
            f"{product_idea} 市场规模 增长趋势",
            f"{product_idea} 竞品分析 优劣势",
            f"{product_idea} 商业模式 定价 盈利",
            f"{product_idea} 技术可行性 开发难度",
        ], max_results=3)
        search_time = time.time() - t0
        
        # 综合分析
        t1 = time.time()
        analysis = self._llm(
            "你是一位资深商业分析师，擅长从市场、竞争、财务、技术四个维度深度评估产品想法。输出必须基于真实搜索数据。",
            f"""对「{product_idea}」进行深度四维分析。

目标用户：{target_audience or '待确认'}

搜索数据：
{search_data[:6000]}

请从以下维度分析：

## 1. 市场分析
- 市场规模（TAM/SAM/SOM）
- 增长趋势（CAGR）
- 目标用户画像
- 付费意愿

## 2. 竞争分析
- 主要竞品（至少3个）
- 竞品优劣势对比表
- 差异化空间
- 进入壁垒

## 3. 商业模式
- 推荐定价策略
- 收入模型（订阅/按次/免费增值）
- 成本结构
- 盈亏平衡点

## 4. 技术评估
- 技术栈建议
- 开发周期估算
- 关键技术风险
- MVP范围建议

## 5. 综合评审
- 六维评分（市场需求/竞争蓝海/变现潜力/技术可行/启动门槛/增长飞轮）
- 7天启动验证方案
- 关键风险与应对
- 最终建议：做还是不做？"""
        )
        analysis_time = time.time() - t1
        
        return f"""# 🔬 深度分析报告

## 产品想法：{product_idea}
## 目标用户：{target_audience or '综合评估'}
## 分析时间：{time.strftime('%Y-%m-%d %H:%M')}
## 耗时：搜索{search_time:.0f}s + 分析{analysis_time:.0f}s = {time.time()-t0:.0f}s

---

## 市场数据

{search_data[:2000]}

---

{analysis}

---

*本报告由 AI利基产品发现器 生成，市场数据基于实时搜索，部分数据需进一步验证。*
"""
