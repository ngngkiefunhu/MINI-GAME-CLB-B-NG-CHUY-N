import React from 'react';
import { VolleyballIcon } from './VolleyballIcon';
import { Users, Clock, Play, ListFilter, HelpCircle, Settings, Flame } from 'lucide-react';
import { GameSettings } from '../types/game';

interface HomeScreenProps {
  memberCount: number;
  settings: GameSettings;
  onStartGame: () => void;
  onOpenMembers: () => void;
  onOpenInstructions: () => void;
  onOpenSettings: () => void;
  invalidNotice: string | null;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  memberCount,
  settings,
  onStartGame,
  onOpenMembers,
  onOpenInstructions,
  onOpenSettings,
  invalidNotice,
}) => {
  const durationMinutes = Math.round(settings.totalDuration / 60);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center px-4 py-8 max-w-4xl mx-auto">
      {/* Top Bar with Club Branding & Settings */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold tracking-widest text-[#AAB6CC] uppercase">
            CLB BÓNG CHUYỀN FPT HẬU GIANG
          </span>
        </div>

        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-xl bg-[#151F3D] hover:bg-[#1C2A52] text-[#AAB6CC] hover:text-[#F5F7FA] border border-[#22335E] transition-colors cursor-pointer"
          title="Cài đặt trò chơi"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Center Hero Area */}
      <div className="my-auto text-center flex flex-col items-center max-w-2xl">
        {/* Animated Volleyball Icon Badge */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#FF8A36]/20 blur-2xl rounded-full" />
          <div className="relative p-4 rounded-3xl bg-[#151F3D] border border-[#22335E] shadow-2xl flex items-center justify-center">
            <VolleyballIcon size={76} />
          </div>
        </div>

        {/* Club & Title */}
        <p className="text-xs sm:text-sm font-black tracking-widest text-[#39FF88] uppercase mb-1 flex items-center gap-1.5 justify-center">
          <Flame className="w-4 h-4 text-[#FF8A36]" />
          <span>VOLLEYBALL CLUB</span>
        </p>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#F5F7FA] tracking-tight uppercase mb-3">
          CHUYỀN BÓNG GỌI TÊN
        </h1>

        <p className="text-base sm:text-lg text-[#AAB6CC] italic font-medium mb-8">
          “Một đường chuyền – Một người bạn – Một tập thể.”
        </p>

        {/* Game Specs Metadata Strip */}
        <div className="grid grid-cols-3 gap-3 w-full mb-8">
          <div className="p-3 rounded-2xl bg-[#151F3D] border border-[#22335E] flex flex-col items-center text-center">
            <Users className="w-5 h-5 text-[#39FF88] mb-1" />
            <span className="text-[11px] text-[#AAB6CC] uppercase tracking-wider font-semibold">Người chơi</span>
            <span className="text-base sm:text-lg font-mono font-bold text-[#F5F7FA] tabular-nums">
              {memberCount > 0 ? `${memberCount} người` : '20 người'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#151F3D] border border-[#22335E] flex flex-col items-center text-center">
            <Clock className="w-5 h-5 text-[#FF8A36] mb-1" />
            <span className="text-[11px] text-[#AAB6CC] uppercase tracking-wider font-semibold">Thời lượng</span>
            <span className="text-base sm:text-lg font-mono font-bold text-[#F5F7FA] tabular-nums">
              {durationMinutes} phút
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#151F3D] border border-[#22335E] flex flex-col items-center text-center">
            <Flame className="w-5 h-5 text-[#39FF88] mb-1" />
            <span className="text-[11px] text-[#AAB6CC] uppercase tracking-wider font-semibold">Chế độ</span>
            <span className="text-xs sm:text-sm font-bold text-[#F5F7FA] mt-0.5 line-clamp-1">
              Làm quen & kết nối
            </span>
          </div>
        </div>

        {/* Invalid Notice Notification (e.g. Needs >= 2 members) */}
        {invalidNotice && (
          <div className="w-full mb-5 p-3.5 rounded-xl bg-[#FF5C65]/15 border border-[#FF5C65]/30 text-[#FF5C65] text-xs sm:text-sm text-center font-medium animate-shake">
            {invalidNotice}
          </div>
        )}

        {/* 3 Main Action Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-md">
          {/* 1. START GAME: Neon green background with bold dark navy text */}
          <button
            onClick={onStartGame}
            className="w-full py-4 px-6 rounded-2xl bg-[#39FF88] hover:bg-[#2EE677] active:scale-[0.99] text-[#0B132B] font-black text-lg sm:text-xl tracking-wide uppercase shadow-[0_10px_25px_rgba(57,255,136,0.3)] transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Play className="w-6 h-6 fill-[#0B132B]" />
            <span>BẮT ĐẦU GAME</span>
          </button>

          {/* 2. MEMBER LIST */}
          <button
            onClick={onOpenMembers}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#151F3D] hover:bg-[#1C2A52] text-[#F5F7FA] font-bold text-base border border-[#22335E] hover:border-[#39FF88]/50 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <ListFilter className="w-5 h-5 text-[#39FF88]" />
            <span>DANH SÁCH THÀNH VIÊN ({memberCount})</span>
          </button>

          {/* 3. HOW TO PLAY */}
          <button
            onClick={onOpenInstructions}
            className="w-full py-3 px-6 rounded-2xl bg-transparent hover:bg-[#151F3D]/50 text-[#AAB6CC] hover:text-[#F5F7FA] font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-[#AAB6CC]" />
            <span>HƯỚNG DẪN CHƠI</span>
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="w-full text-center pt-6 text-xs text-[#AAB6CC]/70 border-t border-[#22335E]/40">
        CLB BÓNG CHUYỀN FPT HẬU GIANG · PHIÊN BẢN LÀM QUEN & TỔNG KẾT SINH HOẠT
      </div>
    </div>
  );
};
