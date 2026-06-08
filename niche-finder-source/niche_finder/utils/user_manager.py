"""
用户管理模块 - AI利基产品发现器
v1.0 - 轻量级用户系统：API Key认证 + 使用次数限制 + 配额管理
"""
import os
import json
import uuid
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional, Dict, List, Tuple


class UserManager:
    """用户管理器 - 基于JSON文件存储，适合小规模使用"""
    
    def __init__(self, data_file: str = None):
        if data_file:
            self.data_file = Path(data_file)
        else:
            self.data_file = Path(__file__).parent.parent / "data" / "users.json"
        
        # 确保目录存在
        self.data_file.parent.mkdir(parents=True, exist_ok=True)
        
        # 默认配额配置
        self.default_quota = {
            "daily": 5,      # 每日免费次数
            "monthly": 20,   # 每月免费次数
            "total": 100,    # 总次数限制（免费用户）
        }
        
        # 加载数据
        self._load()
    
    def _load(self):
        """加载用户数据"""
        if self.data_file.exists():
            with open(self.data_file, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
        else:
            self.data = {
                "users": {},
                "api_keys": {},  # api_key -> user_id 映射
                "stats": {
                    "total_users": 0,
                    "total_analyses": 0,
                }
            }
            self._save()
    
    def _save(self):
        """保存用户数据"""
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, ensure_ascii=False, indent=2)
    
    # ==================== 用户注册 ====================
    
    def register_user(self, email: str = None, name: str = None, 
                      plan: str = "free") -> Tuple[str, str]:
        """
        注册新用户
        
        Returns:
            (user_id, api_key)
        """
        user_id = str(uuid.uuid4())
        api_key = "nk_" + str(uuid.uuid4()).replace('-', '')[:24]  # nich finder key
        
        user = {
            "id": user_id,
            "email": email or "",
            "name": name or "",
            "api_key": api_key,
            "plan": plan,  # free, pro, enterprise
            "created_at": datetime.now().isoformat(),
            "last_active": datetime.now().isoformat(),
            "quota": self._get_plan_quota(plan),
            "usage": {
                "daily": 0,
                "monthly": 0,
                "total": 0,
                "last_reset_date": datetime.now().strftime("%Y-%m-%d"),
                "last_reset_month": datetime.now().strftime("%Y-%m"),
            },
            "history": [],  # 分析历史记录ID列表
        }
        
        self.data["users"][user_id] = user
        self.data["api_keys"][api_key] = user_id
        self.data["stats"]["total_users"] += 1
        
        self._save()
        
        return user_id, api_key
    
    def _get_plan_quota(self, plan: str) -> Dict:
        """获取套餐对应的配额"""
        quotas = {
            "free": {
                "daily": 3,
                "monthly": 10,
                "total": 50,
            },
            "pro": {
                "daily": 20,
                "monthly": 100,
                "total": -1,  # 不限
            },
            "enterprise": {
                "daily": -1,
                "monthly": -1,
                "total": -1,
            }
        }
        return quotas.get(plan, quotas["free"])
    
    # ==================== 用户查询 ====================
    
    def get_user_by_id(self, user_id: str) -> Optional[Dict]:
        """根据用户ID获取用户"""
        return self.data["users"].get(user_id)
    
    def get_user_by_api_key(self, api_key: str) -> Optional[Dict]:
        """根据API Key获取用户"""
        user_id = self.data["api_keys"].get(api_key)
        if user_id:
            return self.data["users"].get(user_id)
        return None
    
    def get_user_by_email(self, email: str) -> Optional[Dict]:
        """根据邮箱获取用户"""
        for user in self.data["users"].values():
            if user.get("email") == email:
                return user
        return None
    
    # ==================== 配额检查与扣减 ====================
    
    def check_quota(self, user_id: str) -> Tuple[bool, str, Dict]:
        """
        检查用户是否还有可用配额
        
        Returns:
            (是否可用, 原因说明, 当前使用情况)
        """
        user = self.get_user_by_id(user_id)
        if not user:
            return False, "用户不存在", {}
        
        # 重置过期的配额
        self._reset_quota_if_needed(user)
        
        usage = user["usage"]
        quota = user["quota"]
        
        # 检查每日限额
        if quota["daily"] > 0 and usage["daily"] >= quota["daily"]:
            return False, "今日使用次数已用完，请明天再来", usage
        
        # 检查每月限额
        if quota["monthly"] > 0 and usage["monthly"] >= quota["monthly"]:
            return False, "本月使用次数已用完，请升级套餐", usage
        
        # 检查总限额
        if quota["total"] > 0 and usage["total"] >= quota["total"]:
            return False, "总使用次数已用完，请升级套餐", usage
        
        return True, "可以使用", usage
    
    def consume_quota(self, user_id: str, analysis_id: str = None) -> bool:
        """扣减一次使用配额"""
        user = self.get_user_by_id(user_id)
        if not user:
            return False
        
        # 先检查
        can_use, _, _ = self.check_quota(user_id)
        if not can_use:
            return False
        
        # 扣减
        user["usage"]["daily"] += 1
        user["usage"]["monthly"] += 1
        user["usage"]["total"] += 1
        user["last_active"] = datetime.now().isoformat()
        
        # 添加历史记录
        if analysis_id:
            user["history"].append({
                "id": analysis_id,
                "time": datetime.now().isoformat(),
            })
            # 最多保留50条
            if len(user["history"]) > 50:
                user["history"] = user["history"][-50:]
        
        self.data["stats"]["total_analyses"] += 1
        
        self._save()
        return True
    
    def _reset_quota_if_needed(self, user: Dict):
        """检查并重置过期的配额"""
        now = datetime.now()
        today = now.strftime("%Y-%m-%d")
        this_month = now.strftime("%Y-%m")
        
        usage = user["usage"]
        
        # 日重置
        if usage.get("last_reset_date") != today:
            usage["daily"] = 0
            usage["last_reset_date"] = today
        
        # 月重置
        if usage.get("last_reset_month") != this_month:
            usage["monthly"] = 0
            usage["last_reset_month"] = this_month
    
    # ==================== 用户管理 ====================
    
    def update_user_plan(self, user_id: str, plan: str) -> bool:
        """更新用户套餐"""
        user = self.get_user_by_id(user_id)
        if not user:
            return False
        
        user["plan"] = plan
        user["quota"] = self._get_plan_quota(plan)
        
        self._save()
        return True
    
    def add_quota(self, user_id: str, count: int, type: str = "total") -> bool:
        """给用户增加使用次数（比如购买后）"""
        user = self.get_user_by_id(user_id)
        if not user:
            return False
        
        if type in user["quota"] and user["quota"][type] > 0:
            user["quota"][type] += count
        elif type in user["quota"] and user["quota"][type] == -1:
            # 不限量，不用加
            pass
        
        self._save()
        return True
    
    def list_users(self, limit: int = 50, offset: int = 0) -> List[Dict]:
        """列出用户（管理用）"""
        users = list(self.data["users"].values())
        users.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return users[offset:offset+limit]
    
    def get_stats(self) -> Dict:
        """获取统计数据"""
        return {
            **self.data["stats"],
            "active_today": self._count_active_today(),
        }
    
    def _count_active_today(self) -> int:
        """统计今日活跃用户数"""
        today = datetime.now().strftime("%Y-%m-%d")
        count = 0
        for user in self.data["users"].values():
            if user.get("last_active", "").startswith(today):
                count += 1
        return count
    
    # ==================== 访客模式 ====================
    
    def get_guest_user(self) -> Dict:
        """获取访客用户（无需注册，基于IP或设备标识）
        
        简化版：返回一个虚拟的访客用户，有很低的配额限制
        """
        # 这里简化处理，实际可以基于IP/设备ID来识别
        return {
            "id": "guest",
            "plan": "guest",
            "quota": {
                "daily": 1,
                "monthly": 3,
                "total": 3,
            },
            "usage": {
                "daily": 0,
                "monthly": 0,
                "total": 0,
                "last_reset_date": datetime.now().strftime("%Y-%m-%d"),
                "last_reset_month": datetime.now().strftime("%Y-%m"),
            }
        }


# 全局单例
_user_manager = None

def get_user_manager() -> UserManager:
    """获取用户管理器单例"""
    global _user_manager
    if not _user_manager:
        _user_manager = UserManager()
    return _user_manager
