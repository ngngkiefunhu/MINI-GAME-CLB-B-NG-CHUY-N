import React from 'react';
import { X, Play, MessageSquare, ArrowRight, Trophy, Flame } from 'lucide-react';
import { VolleyballIcon } from './VolleyballIcon';

interface InstructionsModalProps {
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-[#151F3D] border border-[#22335E] p-6 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#22335E] shrink-0">
          <div className="flex items-center gap-2.5">
            <VolleyballIcon size={26} />
            <div>
              <h3 className="text-lg font-black text-[#F5F7FA] tracking-tight">
                HƯỚNG DẪN CHƠI: CHUYỀN BÓNG GỌI TÊN
              </h3>
              <p className="text-xs text-[#39FF88] font-bold">
                CLB BÓNG CHUYỀN FPT HẬU GIANG · “Một đường chuyền – Một người bạn – Một tập thể”
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#AAB6CC] hover:text-[#F5F7FA] hover:bg-[#0B132B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-4 overflow-y-auto pr-1 text-sm text-[#F5F7FA]">
          {/* Step 1 */}
          <div className="p-3.5 rounded-xl bg-[#0B132B] border border-[#22335E]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#39FF88] uppercase tracking-wider mb-1">
              <Play className="w-3.5 h-3.5" />
              <span>Bước 1: Bắt đầu & Chọn người giữ bóng đầu tiên</span>
            </div>
            <p className="text-xs text-[#AAB6CC] leading-relaxed">
              Hệ thống chọn ngẫu nhiên một thành viên để giữ bóng đầu tiên. Đồng hồ tổng 7 phút bắt đầu đếm ngược. Thẻ của người được chọn sẽ phát sáng viền cam.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-xl bg-[#0B132B] border border-[#22335E]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF8A36] uppercase tracking-wider mb-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Bước 2: Giới thiệu bản thân (Tối đa 10 giây)</span>
            </div>
            <p className="text-xs text-[#AAB6CC] leading-relaxed mb-2">
              Thành viên đứng dậy hoặc phát biểu nhanh:
            </p>
            <ul className="text-xs text-[#F5F7FA] space-y-1 list-disc list-inside bg-[#151F3D]/60 p-2.5 rounded-lg border border-[#22335E]">
              <li>Họ tên & Lớp</li>
              <li>Một sở thích hoặc thế mạnh bản thân</li>
              <li>Vị trí yêu thích trong bóng chuyền (Chuyền 2, Chủ công, Libero...)</li>
            </ul>
            <p className="text-[11px] text-[#AAB6CC] italic mt-1.5">
              Ví dụ: “Mình là Minh, lớp 11A. Mình thích đập bóng và luôn sẵn sàng hỗ trợ đồng đội!”
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-xl bg-[#0B132B] border border-[#22335E]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#39FF88] uppercase tracking-wider mb-1">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Bước 3: Chuyền bóng cho đồng đội</span>
            </div>
            <p className="text-xs text-[#AAB6CC] leading-relaxed">
              Sau khi nói xong, người chơi ấn <strong>“ĐÃ GIỚI THIỆU XONG”</strong>, sau đó chọn tên một đồng đội chưa giới thiệu trên màn hình rồi nhấn <strong>“CHUYỀN BÓNG”</strong>. Quả bóng sẽ bay sang thẻ của người tiếp theo!
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 rounded-xl bg-[#0B132B] border border-[#22335E]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF8A36] uppercase tracking-wider mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>Bước 4: Thử thách đồng đội mỗi 5 lượt</span>
            </div>
            <p className="text-xs text-[#AAB6CC] leading-relaxed">
              Cứ sau 5 lượt chuyền thành công, cả nhóm sẽ cùng thực hiện một thử thách mini (hô khẩu hiệu, mô phỏng động tác bóng chuyền, trả lời câu hỏi...) trong 15–20 giây để nhận thêm điểm thưởng tinh thần!
            </p>
          </div>

          {/* Core Spirit */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#FF8A36]/20 via-[#151F3D] to-[#39FF88]/20 border border-[#22335E]">
            <div className="flex items-center gap-2 text-xs font-black text-[#F5F7FA] uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 text-[#FF8A36]" />
              <span>Mục tiêu cốt lõi: Kết nối & Lửa Trẻ</span>
            </div>
            <p className="text-xs text-[#AAB6CC] leading-relaxed">
              Không tính điểm thắng thua cá nhân! Trò chơi được thiết kế nhằm giúp tất cả 20 thành viên nhớ mặt, nhớ tên và sẵn sàng kề vai sát cánh trên sân bóng chuyền.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#22335E] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#39FF88] hover:bg-[#2EE677] text-[#0B132B] font-black text-xs uppercase tracking-wide cursor-pointer"
          >
            ĐÃ HIỂU LUẬT CHƠI
          </button>
        </div>
      </div>
    </div>
  );
};
