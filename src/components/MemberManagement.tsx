import React, { useState } from 'react';
import { Member, GameSettings } from '../types/game';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Check, 
  ArrowLeft, 
  AlertTriangle, 
  Clipboard, 
  Sparkles,
  X
} from 'lucide-react';

interface MemberManagementProps {
  members: Member[];
  onSaveMembers: (newMembers: Member[]) => void;
  onBack: () => void;
  settings: GameSettings;
}

export const MemberManagement: React.FC<MemberManagementProps> = ({
  members: initialMembers,
  onSaveMembers,
  onBack,
  settings,
}) => {
  const [memberList, setMemberList] = useState<Member[]>(initialMembers);
  
  // Single input form
  const [nameInput, setNameInput] = useState('');
  const [classInput, setClassInput] = useState('');
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editClass, setEditClass] = useState('');

  // Bulk paste modal
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedText, setPastedText] = useState('');

  // Confirmation modals
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [fieldWarning, setFieldWarning] = useState<string | null>(null);

  const maxMembers = settings.maxMembers || 20;

  // Add individual member
  const handleAddMember = (bypassDuplicateCheck = false) => {
    setFieldWarning(null);
    setDuplicateWarning(null);

    const trimmedName = nameInput.trim();
    const trimmedClass = classInput.trim();

    if (!trimmedName) {
      setFieldWarning('Họ và tên không được để trống.');
      return;
    }

    if (!trimmedClass) {
      setFieldWarning('Lớp không được để trống.');
      return;
    }

    if (memberList.length >= maxMembers) {
      setFieldWarning(`Đã đạt giới hạn tối đa ${maxMembers} thành viên.`);
      return;
    }

    // Check duplicate
    const isDuplicate = memberList.some(
      (m) => m.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate && !bypassDuplicateCheck) {
      setDuplicateWarning(`Tên "${trimmedName}" đã có trong danh sách.`);
      return;
    }

    const newMember: Member = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      order: memberList.length + 1,
      name: trimmedName,
      className: trimmedClass,
      status: 'pending',
    };

    setMemberList([...memberList, newMember]);
    setNameInput('');
    setClassInput('');
  };

  // Start editing member
  const startEdit = (m: Member) => {
    setEditingId(m.id);
    setEditName(m.name);
    setEditClass(m.className);
  };

  // Save edited member
  const saveEdit = (id: string) => {
    if (!editName.trim() || !editClass.trim()) {
      return;
    }
    setMemberList(
      memberList.map((m) =>
        m.id === id ? { ...m, name: editName.trim(), className: editClass.trim() } : m
      )
    );
    setEditingId(null);
  };

  // Delete individual member
  const handleDelete = (id: string) => {
    const updated = memberList
      .filter((m) => m.id !== id)
      .map((m, idx) => ({ ...m, order: idx + 1 }));
    setMemberList(updated);
  };

  // Clear all members
  const handleClearAll = () => {
    setMemberList([]);
    setShowClearConfirm(false);
  };

  // Parse bulk paste from Excel / Google Sheets
  const handleParsePaste = () => {
    if (!pastedText.trim()) {
      setShowPasteModal(false);
      return;
    }

    const lines = pastedText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const parsed: Member[] = [];
    let startOrder = memberList.length + 1;

    for (const line of lines) {
      if (memberList.length + parsed.length >= maxMembers) break;

      // Check tab or comma or multiple spaces
      let parts: string[] = [];
      if (line.includes('\t')) {
        parts = line.split('\t').map((p) => p.trim());
      } else if (line.includes(',')) {
        parts = line.split(',').map((p) => p.trim());
      } else if (line.includes('-')) {
        parts = line.split('-').map((p) => p.trim());
      } else {
        parts = [line];
      }

      const name = parts[0] || '';
      const className = parts[1] || 'CLB FPT';

      if (name) {
        parsed.push({
          id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${parsed.length}`,
          order: startOrder++,
          name,
          className,
          status: 'pending',
        });
      }
    }

    if (parsed.length > 0) {
      setMemberList([...memberList, ...parsed]);
    }
    setPastedText('');
    setShowPasteModal(false);
  };

  // Optional: Sample list for testing convenience
  const handleLoadSampleList = () => {
    const sampleNames = [
      { name: 'Nguyễn Văn An', className: '10A1' },
      { name: 'Trần Thị Bình', className: '10A2' },
      { name: 'Lê Hoàng Cường', className: '11B1' },
      { name: 'Phạm Ngọc Dung', className: '11B3' },
      { name: 'Võ Minh Đạt', className: '12C1' },
      { name: 'Đặng Thanh Giang', className: '12C2' },
      { name: 'Bùi Quốc Huy', className: '10A3' },
      { name: 'Hoàng Mai Hoa', className: '11B2' },
      { name: 'Đỗ Hữu Khánh', className: '12C4' },
      { name: 'Ngô Tấn Lộc', className: '10A4' },
      { name: 'Vũ Thị Mai', className: '11B5' },
      { name: 'Lý Trọng Nghĩa', className: '12C3' },
      { name: 'Dương Thảo Nhi', className: '10A2' },
      { name: 'Phan Tuấn Phong', className: '11B4' },
      { name: 'Trịnh Hoài Phương', className: '12C1' },
      { name: 'Cao Đình Quân', className: '10A5' },
      { name: 'Lâm Gia Sơn', className: '11B1' },
      { name: 'Mai Quốc Thịnh', className: '12C2' },
      { name: 'Hồ Kim Uyên', className: '10A1' },
      { name: 'Tạ Quang Vinh', className: '11B3' },
    ];

    const generated: Member[] = sampleNames.slice(0, maxMembers).map((item, idx) => ({
      id: `sample_${idx + 1}`,
      order: idx + 1,
      name: item.name,
      className: item.className,
      status: 'pending',
    }));

    setMemberList(generated);
  };

  const handleSaveAndConfirm = () => {
    if (memberList.length < 2) {
      setFieldWarning('Cần ít nhất 2 thành viên để bắt đầu trò chơi chuyền bóng.');
      return;
    }
    onSaveMembers(memberList);
    onBack();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#22335E]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151F3D] hover:bg-[#1C2A52] text-[#F5F7FA] text-sm font-semibold border border-[#22335E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>QUAY LẠI</span>
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#F5F7FA] tracking-tight">
              QUẢN LÝ DANH SÁCH THÀNH VIÊN
            </h2>
            <p className="text-xs sm:text-sm text-[#AAB6CC]">
              Nhập danh sách thành viên tham gia buổi sinh hoạt CLB Bóng Chuyền FPT Hậu Giang
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#151F3D] border border-[#22335E]">
            <Users className="w-4 h-4 text-[#39FF88]" />
            <span className="text-sm font-mono font-bold text-[#F5F7FA] tabular-nums">
              {memberList.length}/{maxMembers} thành viên
            </span>
          </div>

          <button
            onClick={handleSaveAndConfirm}
            className="px-4 py-2 rounded-xl bg-[#39FF88] hover:bg-[#2EE677] text-[#0B132B] text-sm font-black tracking-wide shadow-lg shadow-[#39FF88]/20 transition-all cursor-pointer"
          >
            XÁC NHẬN DANH SÁCH
          </button>
        </div>
      </div>

      {/* Warnings & Alerts */}
      {fieldWarning && (
        <div className="mb-4 flex items-center justify-between gap-2 p-3 rounded-xl bg-[#FF5C65]/15 border border-[#FF5C65]/30 text-[#FF5C65] text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{fieldWarning}</span>
          </div>
          <button onClick={() => setFieldWarning(null)} className="p-1 hover:bg-[#FF5C65]/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {duplicateWarning && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[#FF8A36]/15 border border-[#FF8A36]/30 text-[#FF8A36] text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{duplicateWarning} Bạn có muốn vẫn thêm người này?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAddMember(true)}
              className="px-3 py-1 rounded bg-[#FF8A36] text-[#0B132B] font-bold text-xs"
            >
              Vẫn thêm (2 người khác nhau)
            </button>
            <button
              onClick={() => setDuplicateWarning(null)}
              className="px-3 py-1 rounded bg-[#151F3D] text-[#F5F7FA] font-medium text-xs border border-[#22335E]"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Controls Strip: Input One-by-One & Bulk Paste */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Direct Input Card */}
        <div className="md:col-span-2 p-4 rounded-2xl bg-[#151F3D] border border-[#22335E] shadow-sm">
          <h3 className="text-sm font-bold text-[#F5F7FA] mb-3 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#39FF88]" />
            <span>Thêm từng thành viên</span>
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddMember(false);
            }}
            className="grid grid-cols-1 sm:grid-cols-12 gap-2.5"
          >
            <div className="sm:col-span-6">
              <input
                type="text"
                placeholder="Họ và tên (ví dụ: Nguyễn Văn An)"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B132B] border border-[#22335E] text-[#F5F7FA] text-sm placeholder-[#AAB6CC]/50 focus:outline-none focus:border-[#39FF88] transition-colors"
              />
            </div>
            <div className="sm:col-span-3">
              <input
                type="text"
                placeholder="Lớp (ví dụ: 10A1)"
                value={classInput}
                onChange={(e) => setClassInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B132B] border border-[#22335E] text-[#F5F7FA] text-sm placeholder-[#AAB6CC]/50 focus:outline-none focus:border-[#39FF88] transition-colors"
              />
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={memberList.length >= maxMembers}
                className="w-full h-full py-2 px-3 rounded-xl bg-[#39FF88] hover:bg-[#2EE677] disabled:opacity-50 text-[#0B132B] font-bold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Thêm</span>
              </button>
            </div>
          </form>
        </div>

        {/* Action Shortcuts Card */}
        <div className="p-4 rounded-2xl bg-[#151F3D] border border-[#22335E] flex flex-col justify-between gap-2.5">
          <h3 className="text-sm font-bold text-[#F5F7FA] flex items-center gap-2">
            <Clipboard className="w-4 h-4 text-[#FF8A36]" />
            <span>Tiện ích nhập liệu</span>
          </h3>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowPasteModal(true)}
              className="w-full py-1.5 px-3 rounded-xl bg-[#0B132B] hover:bg-[#1F2F5A] text-[#F5F7FA] text-xs font-semibold border border-[#22335E] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Clipboard className="w-3.5 h-3.5 text-[#39FF88]" />
              <span>Dán từ Excel / Sheets</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleLoadSampleList}
                title="Nạp nhanh 20 tên mẫu để thử nghiệm game ngay lập tức"
                className="flex-1 py-1.5 px-2 rounded-xl bg-[#0B132B] hover:bg-[#1F2F5A] text-[#AAB6CC] hover:text-[#F5F7FA] text-xs font-medium border border-[#22335E] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#FF8A36]" />
                <span>Nạp 20 mẫu</span>
              </button>

              <button
                onClick={() => setShowClearConfirm(true)}
                disabled={memberList.length === 0}
                className="py-1.5 px-3 rounded-xl bg-[#FF5C65]/15 hover:bg-[#FF5C65]/25 text-[#FF5C65] disabled:opacity-40 text-xs font-bold border border-[#FF5C65]/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Xóa hết</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Member Table / List */}
      <div className="rounded-2xl bg-[#151F3D] border border-[#22335E] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#22335E] flex items-center justify-between bg-[#111A33]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#AAB6CC]">
            DANH SÁCH HIỆN CÓ ({memberList.length}/{maxMembers})
          </span>
          <span className="text-xs text-[#AAB6CC]">
            Tối thiểu 2 người để chơi
          </span>
        </div>

        {memberList.length === 0 ? (
          <div className="py-16 text-center text-[#AAB6CC]">
            <Users className="w-12 h-12 mx-auto mb-3 text-[#22335E]" />
            <p className="text-base font-bold text-[#F5F7FA]">Chưa có thành viên nào</p>
            <p className="text-sm mt-1">
              Hãy nhập họ tên và lớp ở trên hoặc dán trực tiếp từ bảng tính Excel.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#22335E] max-h-[440px] overflow-y-auto">
            {memberList.map((m) => {
              const isEditing = editingId === m.id;

              return (
                <div
                  key={m.id}
                  className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-[#182447] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="w-7 h-7 rounded-lg bg-[#0B132B] border border-[#22335E] flex items-center justify-center text-xs font-mono font-bold text-[#AAB6CC]">
                      {String(m.order).padStart(2, '0')}
                    </span>

                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="px-2 py-1 rounded bg-[#0B132B] border border-[#39FF88] text-sm text-[#F5F7FA] flex-1"
                        />
                        <input
                          type="text"
                          value={editClass}
                          onChange={(e) => setEditClass(e.target.value)}
                          className="w-24 px-2 py-1 rounded bg-[#0B132B] border border-[#39FF88] text-sm text-[#F5F7FA]"
                        />
                      </div>
                    ) : (
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base font-bold text-[#F5F7FA] truncate">
                          {m.name}
                        </p>
                        <p className="text-xs text-[#AAB6CC] truncate">
                          Lớp: {m.className}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Row Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isEditing ? (
                      <button
                        onClick={() => saveEdit(m.id)}
                        className="p-1.5 rounded-lg bg-[#39FF88] text-[#0B132B] hover:bg-[#2EE677] transition-colors cursor-pointer"
                        title="Lưu thay đổi"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(m)}
                        className="p-1.5 rounded-lg bg-[#0B132B] text-[#AAB6CC] hover:text-[#F5F7FA] hover:bg-[#1E2E59] border border-[#22335E] transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-1.5 rounded-lg bg-[#0B132B] text-[#FF5C65] hover:bg-[#FF5C65]/20 border border-[#22335E] transition-colors cursor-pointer"
                      title="Xóa thành viên"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bulk Paste Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#151F3D] border border-[#22335E] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#F5F7FA] flex items-center gap-2">
                <Clipboard className="w-5 h-5 text-[#39FF88]" />
                <span>Dán danh sách từ Excel hoặc Sheets</span>
              </h3>
              <button
                onClick={() => setShowPasteModal(false)}
                className="p-1 rounded-lg text-[#AAB6CC] hover:text-[#F5F7FA] hover:bg-[#0B132B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#AAB6CC] mb-3 leading-relaxed">
              Copy cột <strong>Họ tên</strong> và <strong>Lớp</strong> trong bảng tính rồi dán vào đây. Ứng dụng tự động nhận diện phân cách bằng Tab hoặc xuống dòng.
            </p>

            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder={`Ví dụ:\nNguyễn Văn An\t10A1\nTrần Thị Bình\t10A2\nLê Hoàng Cường\t11B1`}
              className="w-full p-3 rounded-xl bg-[#0B132B] border border-[#22335E] text-[#F5F7FA] text-sm font-mono focus:outline-none focus:border-[#39FF88] resize-none"
            />

            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => setShowPasteModal(false)}
                className="px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-[#1E2E59] text-[#AAB6CC] hover:text-[#F5F7FA] text-sm font-semibold border border-[#22335E]"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleParsePaste}
                className="px-4 py-2 rounded-xl bg-[#39FF88] hover:bg-[#2EE677] text-[#0B132B] text-sm font-black tracking-wide"
              >
                Nhập danh sách
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#151F3D] border border-[#FF5C65]/50 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-3 text-[#FF5C65]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold">Xác nhận xóa tất cả</h3>
            </div>
            <p className="text-sm text-[#AAB6CC] mb-6">
              Bạn có chắc chắn muốn xóa toàn bộ {memberList.length} thành viên khỏi danh sách? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-[#1E2E59] text-[#F5F7FA] text-sm font-semibold border border-[#22335E]"
              >
                Giữ lại
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl bg-[#FF5C65] hover:bg-[#E04B54] text-white text-sm font-bold"
              >
                Xóa tất cả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
