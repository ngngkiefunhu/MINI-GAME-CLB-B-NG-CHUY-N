import React, { useState } from 'react';
import { Member, GameStats } from '../types/game';
import { VolleyballIcon } from './VolleyballIcon';
import { 
  Trophy, 
  RotateCcw, 
  Home, 
  Download, 
  Copy, 
  Check, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Flame,
  Award
} from 'lucide-react';

interface ResultsScreenProps {
  members: Member[];
  stats: GameStats;
  totalDuration: number;
  onPlayAgain: () => void;
  onPlayRoundTwo: () => void;
  onGoHome: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  members,
  stats,
  totalDuration,
  onPlayAgain,
  onPlayRoundTwo,
  onGoHome,
}) => {
  const [copied, setCopied] = useState(false);

  const completedMembers = members.filter((m) => m.status === 'completed');
  const skippedMembers = members.filter((m) => m.status === 'skipped');
  const pendingMembers = members.filter((m) => m.status === 'pending' || m.status === 'holding');

  const totalMembers = members.length;
  const isAllIntroduced = completedMembers.length === totalMembers && totalMembers > 0;

  // Format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Generate downloadable CSV
  const handleExportCSV = () => {
    const headers = ['STT', 'Họ và tên', 'Lớp', 'Trạng thái'];
    const rows = members.map((m) => [
      m.order,
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.className.replace(/"/g, '""')}"`,
      m.status === 'completed'
        ? 'Đã giới thiệu'
        : m.status === 'skipped'
        ? 'Bỏ lượt'
        : 'Chưa đến lượt',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Ket_Qua_Chuyen_Bong_FPT_Hau_Giang_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy text summary to clipboard for Zalo / messaging
  const handleCopyTextReport = () => {
    const report = [
      `🏐 BÁO CÁO GAME: CHUYỀN BÓNG GỌI TÊN`,
      `CLB BÓNG CHUYỀN FPT HẬU GIANG`,
      `Khẩu hiệu: “Một đường chuyền – Một người bạn – Một tập thể.”`,
      `-----------------------------------------`,
      `⏱ Thời gian diễn ra: ${formatTime(stats.elapsedTime)} / ${formatTime(totalDuration)}`,
      `⭐ Tổng điểm đóng góp: ${stats.totalScore} điểm`,
      `👥 Đã giới thiệu: ${completedMembers.length}/${totalMembers} thành viên`,
      `🎯 Số đường chuyền thành công: ${stats.passedCount} lượt`,
      `🏆 Thử thách đồng đội hoàn thành: ${stats.challengeCount}`,
      `-----------------------------------------`,
      `DANH SÁCH THÀNH VIÊN ĐÃ LÊN TIẾNG:`,
      ...completedMembers.map((m) => `✓ #${m.order} ${m.name} (${m.className})`),
      ...(skippedMembers.length > 0
        ? [
            `\nTHÀNH VIÊN BỎ LƯỢT:`,
            ...skippedMembers.map((m) => `! #${m.order} ${m.name} (${m.className})`),
          ]
        : []),
      ...(pendingMembers.length > 0
        ? [
            `\nTHÀNH VIÊN CHƯA ĐẾN LƯỢT:`,
            ...pendingMembers.map((m) => `- #${m.order} ${m.name} (${m.className})`),
          ]
        : []),
      `\nLỬA TRẺ SẴN SÀNG KẾT NỐI! 🔥`,
    ].join('\n');

    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#151F3D] border border-[#22335E] mb-3">
          <VolleyballIcon size={48} />
        </div>
        
        <p className="text-xs sm:text-sm font-black text-[#FF8A36] uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1">
          <Flame className="w-4 h-4 text-[#FF8A36]" />
          <span>KẾT QUẢ BUỔI SINH HOẠT</span>
        </p>

        <h2 className="text-3xl sm:text-5xl font-black text-[#F5F7FA] tracking-tight uppercase mb-2">
          GAME OVER – LỬA TRẺ!
        </h2>

        {/* Motivational or Congratulatory Message */}
        <div className="max-w-xl mx-auto mt-3 p-3.5 rounded-xl bg-[#151F3D] border border-[#22335E]">
          {isAllIntroduced ? (
            <p className="text-sm sm:text-base font-bold text-[#39FF88] flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>
                {totalMembers}/{totalMembers} thành viên đã lên tiếng! Lửa Trẻ đã sẵn sàng kết nối và đồng hành cùng nhau.
              </span>
            </p>
          ) : (
            <p className="text-sm text-[#AAB6CC]">
              Mỗi thành viên là một mắt xích của đội. Hãy tiếp tục vòng hai để mọi người có cơ hội làm quen!
            </p>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {/* Total Score */}
        <div className="p-4 rounded-2xl bg-[#151F3D] border border-[#39FF88]/40 shadow-lg text-center flex flex-col items-center">
          <Trophy className="w-5 h-5 text-[#39FF88] mb-1" />
          <span className="text-xs text-[#AAB6CC] uppercase font-bold tracking-wider">Tổng điểm đội</span>
          <span className="text-2xl sm:text-3xl font-mono font-black text-[#39FF88] tabular-nums mt-0.5">
            {stats.totalScore}
          </span>
          <span className="text-[10px] text-[#AAB6CC] mt-1">1đ/lượt + 2đ/thử thách</span>
        </div>

        {/* Introduced Members */}
        <div className="p-4 rounded-2xl bg-[#151F3D] border border-[#22335E] shadow-lg text-center flex flex-col items-center">
          <CheckCircle2 className="w-5 h-5 text-[#39FF88] mb-1" />
          <span className="text-xs text-[#AAB6CC] uppercase font-bold tracking-wider">Đã giới thiệu</span>
          <span className="text-2xl sm:text-3xl font-mono font-black text-[#F5F7FA] tabular-nums mt-0.5">
            {completedMembers.length}/{totalMembers}
          </span>
          <span className="text-[10px] text-[#AAB6CC] mt-1">Thành viên lên tiếng</span>
        </div>

        {/* Passes Count */}
        <div className="p-4 rounded-2xl bg-[#151F3D] border border-[#22335E] shadow-lg text-center flex flex-col items-center">
          <VolleyballIcon size={20} className="mb-1" />
          <span className="text-xs text-[#AAB6CC] uppercase font-bold tracking-wider">Chuyền thành công</span>
          <span className="text-2xl sm:text-3xl font-mono font-black text-[#FF8A36] tabular-nums mt-0.5">
            {stats.passedCount}
          </span>
          <span className="text-[10px] text-[#AAB6CC] mt-1">Lượt kết nối</span>
        </div>

        {/* Time Elapsed */}
        <div className="p-4 rounded-2xl bg-[#151F3D] border border-[#22335E] shadow-lg text-center flex flex-col items-center">
          <Clock className="w-5 h-5 text-[#AAB6CC] mb-1" />
          <span className="text-xs text-[#AAB6CC] uppercase font-bold tracking-wider">Thời gian dùng</span>
          <span className="text-2xl sm:text-3xl font-mono font-black text-[#F5F7FA] tabular-nums mt-0.5">
            {formatTime(stats.elapsedTime)}
          </span>
          <span className="text-[10px] text-[#AAB6CC] mt-1">Giới hạn {formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Categorized Member Lists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Completed list */}
        <div className="p-4 rounded-2xl bg-[#151F3D] border border-[#39FF88]/30">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#22335E]">
            <h4 className="text-xs font-bold text-[#39FF88] uppercase tracking-wider flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>ĐÃ GIỚI THIỆU ({completedMembers.length})</span>
            </h4>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {completedMembers.length === 0 ? (
              <p className="text-xs text-[#AAB6CC] italic">Chưa có ai hoàn thành</p>
            ) : (
              completedMembers.map((m) => (
                <div key={m.id} className="text-xs flex items-center justify-between p-1.5 rounded bg-[#0B132B]">
                  <span className="font-bold text-[#F5F7FA] truncate">{m.name}</span>
                  <span className="text-[10px] text-[#AAB6CC] font-mono">{m.className}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending list */}
        <div className="p-4 rounded-2xl bg-[#151F3D] border border-[#22335E]">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#22335E]">
            <h4 className="text-xs font-bold text-[#AAB6CC] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>CHƯA ĐẾN LƯỢT ({pendingMembers.length})</span>
            </h4>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {pendingMembers.length === 0 ? (
              <p className="text-xs text-[#39FF88] italic">Tất cả đều đã tham gia!</p>
            ) : (
              pendingMembers.map((m) => (
                <div key={m.id} className="text-xs flex items-center justify-between p-1.5 rounded bg-[#0B132B]">
                  <span className="font-medium text-[#AAB6CC] truncate">{m.name}</span>
                  <span className="text-[10px] text-[#AAB6CC]/70 font-mono">{m.className}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Skipped list */}
        <div className="p-4 rounded-2xl bg-[#151F3D] border border-[#FF5C65]/30">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#22335E]">
            <h4 className="text-xs font-bold text-[#FF5C65] uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>BỎ LƯỢT ({skippedMembers.length})</span>
            </h4>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {skippedMembers.length === 0 ? (
              <p className="text-xs text-[#AAB6CC] italic">Không ai bỏ lượt!</p>
            ) : (
              skippedMembers.map((m) => (
                <div key={m.id} className="text-xs flex items-center justify-between p-1.5 rounded bg-[#0B132B]">
                  <span className="font-medium text-[#FF5C65] truncate">{m.name}</span>
                  <span className="text-[10px] text-[#AAB6CC] font-mono">{m.className}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Honorary Team Accolades (Fun Spirit Badges) */}
      <div className="p-4 rounded-2xl bg-[#151F3D] border border-[#22335E] mb-8">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF8A36] mb-3 flex items-center gap-2">
          <Award className="w-4 h-4" />
          <span>DANH HIỆU TINH THẦN ĐỒNG ĐỘI (GỢI Ý TUYÊN DƯƠNG)</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-[#0B132B] border border-[#22335E]">
            <p className="font-bold text-[#39FF88]">Cây Chuyền Vàng</p>
            <p className="text-[11px] text-[#AAB6CC]">Dành cho người chuyền bóng dứt khoát và gọi tên to rõ nhất.</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0B132B] border border-[#22335E]">
            <p className="font-bold text-[#FF8A36]">Người Lan Tỏa Năng Lượng</p>
            <p className="text-[11px] text-[#AAB6CC]">Thành viên giới thiệu nhiệt tình, hâm nóng bầu không khí.</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0B132B] border border-[#22335E]">
            <p className="font-bold text-[#F5F7FA]">Đồng Đội Nhiệt Tình</p>
            <p className="text-[11px] text-[#AAB6CC]">Tập thể cùng tham gia trọn vẹn các thử thách hô khẩu hiệu CLB.</p>
          </div>
        </div>
      </div>

      {/* 4 Bottom Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onPlayAgain}
          className="px-5 py-3 rounded-xl bg-[#39FF88] hover:bg-[#2EE677] text-[#0B132B] font-black text-sm flex items-center gap-2 shadow-lg shadow-[#39FF88]/20 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>CHƠI LẠI</span>
        </button>

        <button
          onClick={onPlayRoundTwo}
          className="px-5 py-3 rounded-xl bg-[#FF8A36] hover:bg-[#E87825] text-[#0B132B] font-black text-sm flex items-center gap-2 shadow-lg shadow-[#FF8A36]/20 transition-all cursor-pointer"
        >
          <Flame className="w-4 h-4" />
          <span>CHƠI VÒNG HAI</span>
        </button>

        <button
          onClick={onGoHome}
          className="px-5 py-3 rounded-xl bg-[#151F3D] hover:bg-[#1C2A52] text-[#F5F7FA] font-bold text-sm border border-[#22335E] flex items-center gap-2 transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>VỀ TRANG CHỦ</span>
        </button>

        <button
          onClick={handleExportCSV}
          className="px-4 py-3 rounded-xl bg-[#0B132B] hover:bg-[#151F3D] text-[#AAB6CC] hover:text-[#F5F7FA] font-semibold text-xs border border-[#22335E] flex items-center gap-1.5 transition-all cursor-pointer"
          title="Tải bảng kết quả CSV"
        >
          <Download className="w-4 h-4" />
          <span>TẢI CSV</span>
        </button>

        <button
          onClick={handleCopyTextReport}
          className="px-4 py-3 rounded-xl bg-[#0B132B] hover:bg-[#151F3D] text-[#AAB6CC] hover:text-[#F5F7FA] font-semibold text-xs border border-[#22335E] flex items-center gap-1.5 transition-all cursor-pointer"
          title="Sao chép báo cáo dán vào nhóm Zalo"
        >
          {copied ? <Check className="w-4 h-4 text-[#39FF88]" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'ĐÃ SAO CHÉP!' : 'COPY BÁO CÁO ZALO'}</span>
        </button>
      </div>
    </div>
  );
};
