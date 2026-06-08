#!/usr/bin/env python3
"""
AI利基产品发现器 - 主入口
v1.3 - 支持三大发现模式 + 深度研究
"""
import os
import sys
import argparse
from datetime import datetime

# 添加当前目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from niche_finder import NicheFinderCrew, DiscoveryModes, validate_config
from niche_finder.research import DeepResearchEngine


def run_full_analysis(product_idea: str, output_file: str = None):
    """运行完整四维分析"""
    print(f"🔍 开始深度分析: {product_idea}")
    print("=" * 60)
    
    errors = validate_config()
    if errors:
        print("❌ 配置错误:")
        for error in errors:
            print(f"   - {error}")
        sys.exit(1)
    
    print("✅ 配置验证通过")
    print()
    
    crew = NicheFinderCrew().full_analysis_crew(product_idea)
    
    print("🤖 分析团队就位:")
    print("   - 市场分析师")
    print("   - 竞争情报专家")
    print("   - 财务建模专家")
    print("   - 技术评估专家")
    print("   - 首席评审官")
    print()
    print("⏳ 预计耗时: 3-8分钟")
    print("=" * 60)
    print()
    
    start_time = datetime.now()
    
    try:
        result = crew.kickoff()
        elapsed = (datetime.now() - start_time).total_seconds()
        
        print()
        print("=" * 60)
        print(f"🎉 分析完成! 耗时: {elapsed:.1f}秒")
        print("=" * 60)
        print()
        print(str(result))
        
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(str(result))
            print(f"\n📄 报告已保存到: {output_file}")
        
        return result
        
    except Exception as e:
        print(f"❌ 分析出错: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


def run_blue_ocean(domain: str, output_file: str = None):
    """运行蓝海模式"""
    print(f"🌊 蓝海模式 - 在「{domain}」领域寻找蓝海机会")
    print()
    
    modes = DiscoveryModes()
    result = modes.blue_ocean_mode(domain)
    
    print(result)
    
    if output_file:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(str(result))
        print(f"\n📄 报告已保存到: {output_file}")
    
    return result


def run_red_ocean_niche(big_market: str, angle: str = "未被满足的需求", output_file: str = None):
    """运行红海细分模式"""
    print(f"🔴 红海细分模式 - 在「{big_market}」中找{angle}")
    print()
    
    modes = DiscoveryModes()
    result = modes.red_ocean_niche_mode(big_market, angle)
    
    print(result)
    
    if output_file:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(str(result))
        print(f"\n📄 报告已保存到: {output_file}")
    
    return result


def run_cross_domain(domain_a: str, domain_b: str, output_file: str = None):
    """运行跨界模式"""
    print(f"🔀 跨界模式 - {domain_a} × {domain_b}")
    print()
    
    modes = DiscoveryModes()
    result = modes.cross_domain_mode(domain_a, domain_b)
    
    print(result)
    
    if output_file:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(str(result))
        print(f"\n📄 报告已保存到: {output_file}")
    
    return result


def run_deep_research(opportunity: str, desc: str = None, research_type: str = "opportunity"):
    """运行深度研究"""
    print(f"📚 深度研究模式 - {opportunity}")
    print()
    
    engine = DeepResearchEngine()
    
    if not engine.gptr_available:
        print("❌ GPT Researcher 未安装，无法进行深度研究")
        sys.exit(1)
    
    if research_type == "opportunity":
        result = engine.research_opportunity(opportunity, desc or "")
    elif research_type == "competitors":
        result = engine.research_competitors(opportunity, desc or "SaaS")
    elif research_type == "painpoints":
        result = engine.research_user_painpoints(opportunity, desc or "用户")
    else:
        result = engine.research_opportunity(opportunity, desc or "")
    
    print(result)
    return result


def main():
    parser = argparse.ArgumentParser(
        description="AI利基产品发现器 - 找到你的下一个创业机会",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  python main.py analyze "AI配音工具"
  python main.py blue-ocean "独立开发者工具"
  python main.py red-niche "AI写作工具"
  python main.py cross "AI" "健身"
  python main.py deep-research "App Store评论分析工具" --type opportunity
        """
    )
    
    subparsers = parser.add_subparsers(dest="mode", help="发现模式")
    
    # 完整分析模式
    analyze_parser = subparsers.add_parser("analyze", help="分析一个具体的产品想法（四维分析）")
    analyze_parser.add_argument("idea", help="产品想法或方向描述")
    analyze_parser.add_argument("-o", "--output", help="输出文件路径")
    
    # 蓝海模式
    blue_parser = subparsers.add_parser("blue-ocean", help="蓝海模式 - 寻找低竞争高增长机会")
    blue_parser.add_argument("domain", help="目标领域，如'AI工具'、'开发者服务'")
    blue_parser.add_argument("-o", "--output", help="输出文件路径")
    
    # 红海细分模式
    red_parser = subparsers.add_parser("red-niche", help="红海细分模式 - 在大市场中找细分机会")
    red_parser.add_argument("market", help="大市场方向，如'AI写作'、'CRM'")
    red_parser.add_argument("--angle", default="未被满足的需求", help="寻找角度")
    red_parser.add_argument("-o", "--output", help="输出文件路径")
    
    # 跨界模式
    cross_parser = subparsers.add_parser("cross", help="跨界模式 - 两个领域的交叉机会")
    cross_parser.add_argument("domain_a", help="领域A")
    cross_parser.add_argument("domain_b", help="领域B")
    cross_parser.add_argument("-o", "--output", help="输出文件路径")
    
    # 深度研究模式
    deep_parser = subparsers.add_parser("deep-research", help="深度研究 - 对特定机会做全网调研")
    deep_parser.add_argument("topic", help="研究主题")
    deep_parser.add_argument("--desc", help="补充描述")
    deep_parser.add_argument("--type", choices=["opportunity", "competitors", "painpoints"], 
                            default="opportunity", help="研究类型")
    
    args = parser.parse_args()
    
    if not args.mode:
        parser.print_help()
        return
    
    if args.mode == "analyze":
        run_full_analysis(args.idea, args.output)
    elif args.mode == "blue-ocean":
        run_blue_ocean(args.domain, args.output)
    elif args.mode == "red-niche":
        run_red_ocean_niche(args.market, args.angle, args.output)
    elif args.mode == "cross":
        run_cross_domain(args.domain_a, args.domain_b, args.output)
    elif args.mode == "deep-research":
        run_deep_research(args.topic, args.desc, args.type)


if __name__ == "__main__":
    main()
