"""
FastAPI 后端服务 - AI利基产品发现器
v1.2 - 增加健康检查、统计信息、历史记录等API
"""
import os
import sys
import uuid
import asyncio
from typing import Optional, Dict, Any, List
from pathlib import Path
from datetime import datetime, timedelta

from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# 添加当前目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# 尝试导入配置和核心模块
try:
    from niche_finder import validate_config
    from niche_finder.discovery_modes import DiscoveryModes
    from niche_finder.utils.user_manager import get_user_manager
    NICH_FINDER_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ NicheFinder 模块导入失败: {e}")
    print("⚠️ 将使用模拟数据模式运行")
    NICH_FINDER_AVAILABLE = False
    
    # 提供一个模拟的用户管理器
    class MockUserManager:
        def __init__(self):
            pass
        def register_user(self, email=None, name=None, plan="free"):
            return ("mock_user_id", "mock_api_key")
        def get_user_by_api_key(self, api_key):
            return {"id": "mock_user", "plan": "free"} if api_key else None
        def check_quota(self, user_id):
            return (True, "可以使用", {"daily": 0, "monthly": 0, "total": 0})
        def consume_quota(self, user_id, analysis_id=None):
            return True
        def get_stats(self):
            return {"total_users": 0, "total_analyses": 0}
    
    _user_mgr = MockUserManager()
    def get_user_manager():
        return _user_mgr

app = FastAPI(
    title="NicheFinder AI - 利基产品发现器",
    description="基于多Agent协作的AI创业机会发现引擎",
    version="1.2.0",
)

# ==================== 数据模型 ====================

class AnalyzeRequest(BaseModel):
    mode: str  # blue-ocean, red-niche, cross, analyze
    query: str
    target_audience: Optional[str] = None


class TaskResponse(BaseModel):
    task_id: str
    status: str
    message: str


class TaskResultResponse(BaseModel):
    task_id: str
    status: str
    result: Optional[str] = None
    error: Optional[str] = None


class StatusResponse(BaseModel):
    status: str
    version: str
    config_errors: List[str]
    active_tasks: int
    total_tasks: int
    completed_tasks: int
    failed_tasks: int
    uptime: str


# ==================== 全局状态 ====================

# 任务存储
tasks: Dict[str, Dict[str, Any]] = {}

# 历史记录（内存版，生产环境建议用数据库）
analysis_history: List[Dict[str, Any]] = []
MAX_HISTORY = 100

# 启动时间
start_time = datetime.now()

# 统计数据
stats = {
    "total_requests": 0,
    "total_completed": 0,
    "total_failed": 0,
    "mode_counts": {
        "blue-ocean": 0,
        "red-niche": 0,
        "cross": 0,
        "analyze": 0,
    }
}


# ==================== 挂载静态文件 ====================

web_dir = Path(__file__).parent / "web"
if web_dir.exists():
    app.mount("/static", StaticFiles(directory=str(web_dir)), name="static")


# ==================== 工具函数 ====================

def get_uptime() -> str:
    """获取运行时间"""
    delta = datetime.now() - start_time
    days = delta.days
    hours, remainder = divmod(delta.seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    
    parts = []
    if days > 0:
        parts.append(f"{days}天")
    if hours > 0:
        parts.append(f"{hours}小时")
    if minutes > 0:
        parts.append(f"{minutes}分钟")
    if not parts:
        parts.append(f"{seconds}秒")
    
    return "".join(parts)


def validate_config() -> List[str]:
    """验证配置"""
    errors = []
    
    if not NICH_FINDER_AVAILABLE:
        errors.append("NicheFinder核心模块不可用，将使用模拟数据")
    
    # 检查API密钥等
    tavily_key = os.environ.get("TAVILY_API_KEY", "")
    if not tavily_key:
        errors.append("TAVILY_API_KEY 未设置")
    
    return errors


def run_analysis_task(task_id: str, mode: str, query: str):
    """后台运行分析任务"""
    try:
        tasks[task_id]["started_at"] = datetime.now().isoformat()
        
        # 优先使用轻量级引擎（速度快、稳定）
        try:
            from niche_finder.engine import LightweightEngine
            engine = LightweightEngine()
            
            if mode == "blue-ocean":
                result = engine.blue_ocean(query)
            elif mode == "red-niche":
                result = engine.red_ocean_niche(query)
            elif mode == "cross":
                parts = query.split("+")
                if len(parts) >= 2:
                    domain_a = parts[0].strip()
                    domain_b = parts[1].strip()
                    result = engine.cross_domain(domain_a, domain_b)
                else:
                    parts = query.split(None, 1)
                    if len(parts) >= 2:
                        result = engine.cross_domain(parts[0], parts[1])
                    else:
                        result = engine.cross_domain(query, "AI")
            elif mode == "analyze":
                result = engine.deep_analysis(query)
            else:
                result = f"不支持的模式: {mode}"
        except Exception as engine_err:
            print(f"⚠️ 轻量引擎失败: {engine_err}，尝试CrewAI...")
            if NICH_FINDER_AVAILABLE:
                modes = DiscoveryModes()
                if mode == "blue-ocean":
                    result = modes.blue_ocean_mode(query)
                elif mode == "red-niche":
                    result = modes.red_ocean_niche_mode(query)
                elif mode == "cross":
                    parts = query.split("+")
                    if len(parts) >= 2:
                        result = modes.cross_domain_mode(parts[0].strip(), parts[1].strip())
                    else:
                        result = modes.cross_domain_mode(query, "AI")
                elif mode == "analyze":
                    result = modes.deep_analysis(query)
                else:
                    result = f"不支持的模式: {mode}"
            else:
                result = generate_mock_report(mode, query)
        
        tasks[task_id]["status"] = "completed"
        tasks[task_id]["result"] = result
        tasks[task_id]["completed_at"] = datetime.now().isoformat()
        
        # 更新统计
        stats["total_completed"] += 1
        
        # 添加到历史记录
        add_to_history(task_id, mode, query, result)
        
    except Exception as e:
        import traceback
        tasks[task_id]["status"] = "failed"
        tasks[task_id]["error"] = str(e)
        tasks[task_id]["traceback"] = traceback.format_exc()
        tasks[task_id]["failed_at"] = datetime.now().isoformat()
        
        stats["total_failed"] += 1
        
        print(f"❌ 任务 {task_id} 失败: {e}")
        print(traceback.format_exc())


def generate_mock_report(mode: str, query: str) -> str:
    """生成模拟报告"""
    mode_names = {
        "blue-ocean": "蓝海模式",
        "red-niche": "红海细分模式",
        "cross": "跨界机会模式",
        "analyze": "深度分析模式",
    }
    
    mode_name = mode_names.get(mode, "分析")
    
    return f"""# 📊 {mode_name}分析报告

**分析主题**: {query}  
**分析时间**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

---

## 一、六维评分雷达总览

| 维度 | 权重 | 评分 | 说明 |
|------|------|------|------|
| 市场吸引力 | 30% | 7.5分 | 市场规模较大，增长趋势明显 |
| 竞争友好度 | 20% | 7.0分 | 竞争格局尚未固化，存在差异化空间 |
| 商业可行性 | 20% | 6.5分 | 付费意愿中等，需要验证定价策略 |
| 技术可行性 | 15% | 8.0分 | 技术成熟，开发难度适中 |
| 时机成熟度 | 10% | 7.0分 | 处于成长期，市场教育成本适中 |
| 团队适配度 | 5% | 7.0分 | 所需能力与常见团队配置匹配 |

**加权总分: 7.25分**

---

## 二、核心发现

### 🔍 机会点
1. **市场痛点明确**：用户对现有解决方案有明显不满
2. **增长趋势良好**：近一年搜索量增长超过40%
3. **差异化空间大**：现有产品功能趋同，有明确的细分机会

### ⚠️ 风险点
1. **巨头可能进入**：如果市场验证成功，大厂可能快速跟进
2. **获客成本较高**：需要建立有效的用户获取渠道
3. **付费意愿待验证**：需要通过MVP验证用户付费意愿

---

## 三、Top 3 机会方向

### 🥇 第一名：垂直领域专属AI助手
- **核心逻辑**: 针对特定行业用户的工作流痛点，提供深度整合的AI解决方案
- **目标用户**: 专业从业者、中小企业特定部门、垂直领域爱好者
- **差异化**: 更懂行业术语、更贴合工作流、更专业的输出质量
- **预计市场规模**: 10-50亿元/年
- **进入壁垒**: 行业认知、数据积累、工作流整合

### 🥈 第二名：轻量型工具链整合方案
- **核心逻辑**: 把多个零散工具的核心功能整合到一个平台，降低切换成本
- **目标用户**: 效率追求者、多工具用户、小团队
- **差异化**: 一站式体验、数据打通、自动化工作流
- **预计市场规模**: 5-30亿元/年
- **进入壁垒**: 产品体验、生态整合、用户习惯

### 🥉 第三名：社区驱动的内容与工具平台
- **核心逻辑**: 以优质内容吸引用户，再通过工具变现
- **目标用户**: 学习者、从业者、爱好者社区
- **差异化**: 内容+工具闭环、社区粘性高、口碑传播
- **预计市场规模**: 3-20亿元/年
- **进入壁垒**: 内容积累、社区运营、品牌认知

---

## 四、推荐行动方案

### 第一周：验证阶段
1. **用户访谈**：找到10-20个目标用户，深度了解痛点
2. **竞品分析**：详细分析3-5个主要竞争对手的优劣势
3. **Landing Page测试**：做一个产品介绍页，测试用户注册意愿

### 第二周：MVP阶段
1. **核心功能开发**：只做最核心的1-2个功能
2. **定价测试**：设计2-3个定价方案，测试用户付费意愿
3. **种子用户获取**：通过社区、内容等方式获取第一批用户

---

## 五、风险与建议

> 建议以独立开发者模式启动，控制成本，快速验证。如果数据好看再考虑扩张。

**关键成功因素**：
- 找到真正的痛点，而不是伪需求
- 产品体验足够好，用户愿意主动推荐
- 获客成本低于用户生命周期价值

**建议规避的坑**：
- 不要一开始就做太多功能
- 不要等"完美"了再上线
- 不要忽视用户获取成本

---

*本报告由 NicheFinder AI 自动生成，仅供参考，不构成投资建议。*"""


def add_to_history(task_id: str, mode: str, query: str, result: str):
    """添加到历史记录"""
    item = {
        "id": task_id,
        "mode": mode,
        "query": query,
        "result": result,
        "created_at": datetime.now().isoformat(),
    }
    
    analysis_history.insert(0, item)
    
    if len(analysis_history) > MAX_HISTORY:
        analysis_history.pop()


# ==================== API 路由 ====================

@app.get("/", response_class=HTMLResponse)
async def index_page():
    """首页"""
    html_path = Path(__file__).parent / "web" / "index.html"
    if html_path.exists():
        return HTMLResponse(html_path.read_text(encoding="utf-8"))
    return HTMLResponse("<h1>NicheFinder AI</h1><p>前端页面未找到</p>")


@app.get("/api/status", response_model=StatusResponse)
async def get_status():
    """服务状态检查"""
    errors = validate_config()
    active = len([t for t in tasks.values() if t["status"] == "running"])
    completed = len([t for t in tasks.values() if t["status"] == "completed"])
    failed = len([t for t in tasks.values() if t["status"] == "failed"])
    
    return StatusResponse(
        status="ok" if not errors else "warning",
        version="1.2.0",
        config_errors=errors,
        active_tasks=active,
        total_tasks=len(tasks),
        completed_tasks=completed,
        failed_tasks=failed,
        uptime=get_uptime(),
    )


@app.get("/api/stats")
async def get_stats():
    """获取统计信息"""
    return {
        "total_requests": stats["total_requests"],
        "total_completed": stats["total_completed"],
        "total_failed": stats["total_failed"],
        "mode_counts": stats["mode_counts"].copy(),
        "active_tasks": len([t for t in tasks.values() if t["status"] == "running"]),
        "uptime": get_uptime(),
    }


# ==================== 用户 API ====================

@app.post("/api/auth/register")
async def register_user(request: dict):
    """用户注册 - 返回API Key
    
    Request Body:
        email: 邮箱（可选）
        name: 昵称（可选）
    """
    user_mgr = get_user_manager()
    
    email = request.get("email", "")
    name = request.get("name", "")
    
    # 检查邮箱是否已注册
    if email:
        existing = user_mgr.get_user_by_email(email)
        if existing:
            return JSONResponse(
                status_code=400,
                content={"error": "该邮箱已注册", "code": "EMAIL_EXISTS"}
            )
    
    user_id, api_key = user_mgr.register_user(email=email, name=name)
    
    return {
        "success": True,
        "user_id": user_id,
        "api_key": api_key,
        "message": "注册成功！请保存好您的API Key",
        "quota": user_mgr._get_plan_quota("free"),
    }


@app.get("/api/user/info")
async def get_user_info(Authorization: str = None):
    """获取用户信息"""
    user_mgr = get_user_manager()
    
    # 从 header 中提取 API Key
    api_key = None
    if Authorization and Authorization.startswith("Bearer "):
        api_key = Authorization[7:]
    elif Authorization:
        api_key = Authorization
    
    if not api_key:
        return JSONResponse(
            status_code=401,
            content={"error": "未提供API Key", "code": "NO_API_KEY"}
        )
    
    user = user_mgr.get_user_by_api_key(api_key)
    if not user:
        return JSONResponse(
            status_code=401,
            content={"error": "无效的API Key", "code": "INVALID_API_KEY"}
        )
    
    # 重置配额检查
    user_mgr._reset_quota_if_needed(user)
    
    return {
        "user_id": user["id"],
        "email": user.get("email", ""),
        "name": user.get("name", ""),
        "plan": user["plan"],
        "quota": user["quota"],
        "usage": user["usage"],
        "created_at": user["created_at"],
        "last_active": user["last_active"],
        "history_count": len(user.get("history", [])),
    }


@app.get("/api/user/usage")
async def get_user_usage(Authorization: str = None):
    """获取用户使用情况"""
    user_mgr = get_user_manager()
    
    api_key = None
    if Authorization and Authorization.startswith("Bearer "):
        api_key = Authorization[7:]
    elif Authorization:
        api_key = Authorization
    
    if not api_key:
        return JSONResponse(
            status_code=401,
            content={"error": "未提供API Key", "code": "NO_API_KEY"}
        )
    
    user = user_mgr.get_user_by_api_key(api_key)
    if not user:
        return JSONResponse(
            status_code=401,
            content={"error": "无效的API Key", "code": "INVALID_API_KEY"}
        )
    
    user_mgr._reset_quota_if_needed(user)
    
    return {
        "plan": user["plan"],
        "quota": user["quota"],
        "usage": user["usage"],
        "remaining": {
            "daily": max(0, user["quota"]["daily"] - user["usage"]["daily"]) if user["quota"]["daily"] > 0 else "unlimited",
            "monthly": max(0, user["quota"]["monthly"] - user["usage"]["monthly"]) if user["quota"]["monthly"] > 0 else "unlimited",
            "total": max(0, user["quota"]["total"] - user["usage"]["total"]) if user["quota"]["total"] > 0 else "unlimited",
        }
    }


# ==================== 分析 API ====================

@app.post("/api/analyze", response_model=TaskResponse)
async def start_analysis(request: AnalyzeRequest, background_tasks: BackgroundTasks,
                         Authorization: Optional[str] = None):
    """开始一个新的分析任务
    
    支持三种访问方式：
    1. 带API Key（推荐）：有配额限制
    2. 不带API Key（访客）：限制更严格，每日1次
    3. 开发模式：环境变量设置 DEV_MODE=true 时无限制
    """
    # 开发模式跳过认证
    dev_mode = os.environ.get("DEV_MODE", "").lower() in ("true", "1", "yes")
    
    user_mgr = get_user_manager()
    user_id = None
    is_guest = False
    
    if not dev_mode:
        # 提取 API Key
        api_key = None
        if Authorization and Authorization.startswith("Bearer "):
            api_key = Authorization[7:]
        elif Authorization:
            api_key = Authorization
        
        if api_key:
            # 已注册用户
            user = user_mgr.get_user_by_api_key(api_key)
            if not user:
                raise HTTPException(status_code=401, detail="无效的API Key")
            user_id = user["id"]
        else:
            # 访客模式
            is_guest = True
            user_id = "guest"
            # 简化处理：访客有全局的每日限制，后续可以根据IP细分
            # 这里先不做严格的访客配额，只做提示
        
        # 配额检查（仅非开发模式）
        if not is_guest and user_id:
            can_use, reason, usage = user_mgr.check_quota(user_id)
            if not can_use:
                raise HTTPException(status_code=429, detail=reason)
    
    # 验证模式
    valid_modes = ["blue-ocean", "red-niche", "cross", "analyze"]
    if request.mode not in valid_modes:
        raise HTTPException(status_code=400, detail=f"无效的模式，支持: {valid_modes}")
    
    if not request.query or len(request.query.strip()) < 2:
        raise HTTPException(status_code=400, detail="查询内容不能为空")
    
    # 更新统计
    stats["total_requests"] += 1
    stats["mode_counts"][request.mode] = stats["mode_counts"].get(request.mode, 0) + 1
    
    # 创建任务
    task_id = str(uuid.uuid4())
    tasks[task_id] = {
        "task_id": task_id,
        "mode": request.mode,
        "query": request.query,
        "target_audience": request.target_audience,
        "status": "running",
        "created_at": datetime.now().isoformat(),
        "user_id": user_id,
    }
    
    # 扣减配额
    if not dev_mode and not is_guest and user_id:
        user_mgr.consume_quota(user_id, task_id)
    
    # 后台执行
    background_tasks.add_task(run_analysis_task, task_id, request.mode, request.query)
    
    return TaskResponse(
        task_id=task_id,
        status="running",
        message="分析任务已启动，请使用 task_id 查询结果",
    )


@app.get("/api/tasks/{task_id}", response_model=TaskResultResponse)
async def get_task_result(task_id: str):
    """获取任务结果"""
    task = tasks.get(task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    
    if task["status"] == "running":
        return TaskResultResponse(
            task_id=task_id,
            status="running",
            result=None,
        )
    elif task["status"] == "completed":
        return TaskResultResponse(
            task_id=task_id,
            status="completed",
            result=task.get("result", ""),
        )
    else:
        return TaskResultResponse(
            task_id=task_id,
            status="failed",
            error=task.get("error", "未知错误"),
        )


@app.get("/api/tasks")
async def list_tasks(limit: int = 20, status: Optional[str] = None):
    """列出任务列表"""
    filtered_tasks = list(tasks.values())
    
    if status:
        filtered_tasks = [t for t in filtered_tasks if t["status"] == status]
    
    # 按创建时间倒序
    filtered_tasks.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    
    return {
        "total": len(filtered_tasks),
        "tasks": filtered_tasks[:limit],
    }


@app.get("/api/history")
async def get_history(limit: int = 20):
    """获取历史分析记录"""
    # 返回简要信息，不包含完整报告内容
    history_list = []
    for item in analysis_history[:limit]:
        history_list.append({
            "id": item["id"],
            "mode": item["mode"],
            "query": item["query"],
            "created_at": item["created_at"],
        })
    
    return {
        "total": len(analysis_history),
        "history": history_list,
    }


@app.get("/api/history/{task_id}")
async def get_history_item(task_id: str):
    """获取单条历史记录详情"""
    for item in analysis_history:
        if item["id"] == task_id:
            return item
    raise HTTPException(status_code=404, detail="记录不存在")


@app.get("/api/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.2.0",
    }


# ==================== 启动事件 ====================

@app.on_event("startup")
async def startup_event():
    """启动时检查配置"""
    errors = validate_config()
    if errors:
        print(f"⚠️ 配置警告: {errors}")
    else:
        print("✅ 配置验证通过")
    
    print(f"🚀 NicheFinder AI 服务已启动")
    print(f"📊 版本: 1.2.0")
    print(f"🧩 核心模块: {'可用' if NICH_FINDER_AVAILABLE else '模拟模式'}")


if __name__ == "__main__":
    import uvicorn
    
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 8000))
    
    uvicorn.run(
        "server:app",
        host=host,
        port=port,
        reload=True,
    )
