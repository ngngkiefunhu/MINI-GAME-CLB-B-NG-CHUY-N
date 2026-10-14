import React from 'react';
import { GameSettings } from '../types/game';
import { X, Volume2, VolumeX, Maximize, Sparkles, Trophy, Clock } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const toggleSound = () => {
    const nextVal = !settings.soundEnabled;
    soundManager.setEnabled(nextVal);
    if (nextVal) {
      soundManager.playWhistle();
    }
    onUpdateSettings({ ...settings, soundEnabled: nextVal });
  };

  const toggleAnimation = () => {
    onUpdateSettings({ ...settings, animationEnabled: !settings.animationEnabled });
  };

  const toggleChallenges = () => {
    onUpdateSettings({ ...settings, teamChallengesEnabled: !settings.teamChallengesEnabled });
  };

  const setTotalDuration = (seconds: number) => {
    onUpdateSettings({ ...settings, totalDuration: seconds });
  };

  const setTurnDuration = (seconds: number) => {
    onUpdateSettings({ ...settings, turnDuration: seconds });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[#151F3D] border border-[#22335E] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#22335E]">
          <h3 className="text-lg font-black text-[#F5F7FA] tracking-tight flex items-center gap-2">
            <span>CÀI ĐẶT TRÒ CHƠI</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#AAB6CC] hover:text-[#F5F7FA] hover:bg-[#0B132B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-sm">
          {/* Game Duration */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#AAB6CC] flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 text-[#39FF88]" />
              <span>Thời lượng trận đấu (Tổng game)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '5 Phút', sec: 300 },
                { label: '7 Phút (Mặc định)', sec: 420 },
                { label: '10 Phút', sec: 600 },
              ].map((item) => (
                <button
                  key={item.sec}
                  onClick={() => setTotalDuration(item.sec)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    settings.totalDuration === item.sec
                      ? 'bg-[#39FF88] text-[#0B132B] border-[#39FF88]'
                      : 'bg-[#0B132B] text-[#F5F7FA] border-[#22335E] hover:border-[#39FF88]/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Turn Duration */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#AAB6CC] flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 text-[#FF8A36]" />
              <span>Thời gian giới thiệu mỗi lượt</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '5 Giây', sec: 5 },
                { label: '10 Giây (Mặc định)', sec: 10 },
                { label: '15 Giây', sec: 15 },
              ].map((item) => (
                <button
                  key={item.sec}
                  onClick={() => setTurnDuration(item.sec)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    settings.turnDuration === item.sec
                      ? 'bg-[#FF8A36] text-[#0B132B] border-[#FF8A36]'
                      : 'bg-[#0B132B] text-[#F5F7FA] border-[#22335E] hover:border-[#FF8A36]/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Team Challenges Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B132B] border border-[#22335E]">
            <div className="flex items-center gap-3">
              <Trophy className="w-4 h-4 text-[#39FF88]" />
              <div>
                <p className="font-bold text-[#F5F7FA]">Thử thách đồng đội</p>
                <p className="text-xs text-[#AAB6CC]">Xuất hiện sau mỗi 5 lượt chuyền bóng thành công</p>
              </div>
            </div>
            <button
              onClick={toggleChallenges}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                settings.teamChallengesEnabled ? 'bg-[#39FF88]' : 'bg-[#22335E]'
              }`}
            >
              <div
                className={`bg-[#0B132B] w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.teamChallengesEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B132B] border border-[#22335E]">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#FF8A36]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#AAB6CC]" />
              )}
              <div>
                <p className="font-bold text-[#F5F7FA]">Âm thanh còi trọng tài & bóng</p>
                <p className="text-xs text-[#AAB6CC]">Mặc định tắt để tránh ồn buổi sinh hoạt</p>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                settings.soundEnabled ? 'bg-[#FF8A36]' : 'bg-[#22335E]'
              }`}
            >
              <div
                className={`bg-[#0B132B] w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Animation Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B132B] border border-[#22335E]">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#39FF88]" />
              <div>
                <p className="font-bold text-[#F5F7FA]">Hoạt ảnh bóng chuyền bay</p>
                <p className="text-xs text-[#AAB6CC]">Hiệu ứng quỹ đạo đường chuyền cong</p>
              </div>
            </div>
            <button
              onClick={toggleAnimation}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                settings.animationEnabled ? 'bg-[#39FF88]' : 'bg-[#22335E]'
              }`}
            >
              <div
                className={`bg-[#0B132B] w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.animationEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1C2A52] hover:bg-[#233566] text-[#F5F7FA] font-bold text-xs flex items-center justify-center gap-2 border border-[#22335E] transition-colors cursor-pointer"
          >
            <Maximize className="w-4 h-4 text-[#39FF88]" />
            <span>BẬT / TẮT TOÀN MÀN HÌNH (CHO MÁY CHIẾU)</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#22335E] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#39FF88] text-[#0B132B] font-black text-xs uppercase tracking-wide cursor-pointer"
          >
            LƯU & ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
};
