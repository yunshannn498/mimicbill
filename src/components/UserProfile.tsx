import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface UserProfileProps {
  onLoginClick: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onLoginClick }) => {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <button
        onClick={onLoginClick}
        className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm md:text-base"
      >
        <User className="w-4 h-4 md:w-5 md:h-5" />
        <span className="hidden sm:inline">登录/注册</span>
        <span className="sm:hidden">登录</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-gray-100 rounded-lg">
        <User className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
        <span className="text-xs md:text-sm font-medium text-gray-700 max-w-[100px] md:max-w-none truncate">{user.email}</span>
      </div>
      <button
        onClick={signOut}
        className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
        title="退出登录"
      >
        <LogOut className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </div>
  );
};