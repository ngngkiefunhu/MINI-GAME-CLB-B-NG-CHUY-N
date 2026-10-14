import React, { useRef, useEffect, useState } from 'react';
import { Member } from '../types/game';
import { VolleyballIcon } from './VolleyballIcon';
import { Check, User, ArrowRight } from 'lucide-react';

interface VolleyballCourtProps {
  members: Member[];
  currentHolderId: string | null;
  selectedReceiverId: string | null;
  onSelectReceiver: (memberId: string) => void;
  isSelectingReceiver: boolean;
  isPassingAnimation: boolean;
  passFromId: string | null;
  passToId: string | null;
  animationEnabled: boolean;
}

export const VolleyballCourt: React.FC<VolleyballCourtProps> = ({
  members,
  currentHolderId,
  selectedReceiverId,
  onSelectReceiver,
  isSelectingReceiver,
  isPassingAnimation,
  passFromId,
  passToId,
  animationEnabled,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // Coordinates for the flying ball animation
  const [ballPos, setBallPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!isPassingAnimation || !passFromId || !passToId || !animationEnabled) {
      setBallPos(null);
      return;
    }

    const container = containerRef.current;
    const fromCard = cardRefs.current.get(passFromId);
    const toCard = cardRefs.current.get(passToId);

    if (!container || !fromCard || !toCard) return;

    const cRect = container.getBoundingClientRect();
    const fRect = fromCard.getBoundingClientRect();
    const tRect = toCard.getBoundingClientRect();

    const startX = fRect.left + fRect.width / 2 - cRect.left;
    const startY = fRect.top + fRect.height / 2 - cRect.top;
    const endX = tRect.left + tRect.width / 2 - cRect.left;
    const endY = tRect.top + tRect.height / 2 - cRect.top;

    setBallPos({ x: startX, y: startY });

    // Animate ball along arc using requestAnimationFrame
    const startTime = performance.now();
    const duration = 750; // ms

    let animFrame: number;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease in-out
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      
      const currX = startX + (endX - startX) * ease;
      // Parabolic arc for volleyball flight trajectory
      const arcHeight = Math.min(120, Math.hypot(endX - startX, endY - startY) * 0.35);
      const arcOffset = -Math.sin(progress * Math.PI) * arcHeight;
      const currY = startY + (endY - startY) * ease + arcOffset;

      setBallPos({ x: currX, y: currY });

      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      }
    };

    animFrame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [isPassingAnimation, passFromId, passToId, animationEnabled]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl bg-[#0F1936] border border-[#22335E] p-4 sm:p-6 overflow-hidden shadow-2xl min-h-[440px] flex flex-col justify-between"
    >
      {/* Background Volleyball Court Markings */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden" aria-hidden="true">
        {/* Court Boundary Lines */}
        <div className="absolute inset-4 sm:inset-8 border-2 border-[#AAB6CC] rounded-lg" />
        {/* Center Net Line */}
        <div className="absolute top-1/2 left-4 right-4 sm:left-8 sm:right-8 h-[2px] bg-[#FF8A36] -translate-y-1/2" />
        <div className="absolute top-1/2 left-0 right-0 h-4 bg-gradient-to-r from-transparent via-[#FF8A36]/30 to-transparent -translate-y-1/2" />
        {/* Net mesh pattern */}
        <div
          className="absolute top-1/2 left-4 right-4 sm:left-8 sm:right-8 h-8 -translate-y-1/2 border-y border-[#F5F7FA]/40"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(245,247,250,0.15) 0, rgba(245,247,250,0.15) 1px, transparent 0, transparent 16px)'
          }}
        />
        {/* 3m Attack Lines (Vạch 3 mét) */}
        <div className="absolute top-[32%] left-4 right-4 sm:left-8 sm:right-8 h-[1px] border-t border-dashed border-[#AAB6CC]/60" />
        <div className="absolute top-[68%] left-4 right-4 sm:left-8 sm:right-8 h-[1px] border-t border-dashed border-[#AAB6CC]/60" />
        {/* Court Center Circle Mark */}
        <div className="absolute top-1/2 left-1/2 w-28 h-28 border border-[#39FF88]/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Header Info / Banner on Court */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#AAB6CC]">SƠ ĐỒ SÂN ĐẤU & ĐỘI HÌNH</span>
          <span className="text-xs text-[#AAB6CC]">·</span>
          <span className="text-xs text-[#AAB6CC] font-medium">{members.length} thành viên</span>
        </div>

        {isSelectingReceiver && (
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF8A36] bg-[#FF8A36]/10 border border-[#FF8A36]/30 px-3 py-1 rounded-md animate-pulse">
            <ArrowRight className="w-3.5 h-3.5" />
            <span>NHẤP VÀO THÀNH VIÊN ĐỂ CHUYỀN BÓNG</span>
          </div>
        )}
      </div>

      {/* Grid of Member Cards across the court */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 sm:gap-3 flex-1 items-center">
        {members.map((member) => {
          const isHolding = member.id === currentHolderId;
          const isSelected = member.id === selectedReceiverId;
          const isCompleted = member.status === 'completed';
          const isSkipped = member.status === 'skipped';
          const isEligibleReceiver = isSelectingReceiver && member.id !== currentHolderId && member.status !== 'completed';

          // Determine card styling based on status
          let borderStyle = 'border-[#22335E] hover:border-[#384E82]';
          let bgStyle = 'bg-[#151F3D]/90';
          let glowStyle = '';

          if (isHolding) {
            borderStyle = 'border-[#FF8A36] ring-2 ring-[#FF8A36]/50';
            bgStyle = 'bg-[#1F2442]';
            glowStyle = 'shadow-[0_0_20px_rgba(255,138,54,0.35)] scale-[1.02] z-20';
          } else if (isSelected) {
            borderStyle = 'border-[#39FF88] ring-2 ring-[#39FF88]/70';
            bgStyle = 'bg-[#142B38]';
            glowStyle = 'shadow-[0_0_15px_rgba(57,255,136,0.35)] scale-[1.02] z-20';
          } else if (isCompleted) {
            borderStyle = 'border-[#39FF88]/60';
            bgStyle = 'bg-[#112630]/80 opacity-90';
          } else if (isSkipped) {
            borderStyle = 'border-[#FF5C65]/50';
            bgStyle = 'bg-[#2B1724]/70 opacity-80';
          } else if (isEligibleReceiver) {
            borderStyle = 'border-[#FF8A36]/70 hover:border-[#FF8A36] ring-1 ring-[#FF8A36]/30 hover:ring-2 hover:ring-[#FF8A36]';
            bgStyle = 'bg-[#1A264D] hover:bg-[#203061]';
            glowStyle = 'cursor-pointer hover:scale-[1.02] transition-transform';
          }

          return (
            <div
              key={member.id}
              ref={(el) => {
                if (el) cardRefs.current.set(member.id, el);
                else cardRefs.current.delete(member.id);
              }}
              onClick={() => {
                if (isEligibleReceiver) {
                  onSelectReceiver(member.id);
                }
              }}
              role={isEligibleReceiver ? 'button' : undefined}
              tabIndex={isEligibleReceiver ? 0 : undefined}
              onKeyDown={(e) => {
                if (isEligibleReceiver && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onSelectReceiver(member.id);
                }
              }}
              className={`relative rounded-xl border p-2.5 sm:p-3 transition-all duration-200 select-none ${bgStyle} ${borderStyle} ${glowStyle}`}
            >
              {/* Order Badge & Status Icon */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono tabular-nums font-bold text-[#AAB6CC]">
                  #{String(member.order).padStart(2, '0')}
                </span>

                <div className="flex items-center gap-1">
                  {isHolding && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#FF8A36] bg-[#FF8A36]/15 px-1.5 py-0.5 rounded">
                      <VolleyballIcon size={14} animate={true} />
                      <span className="hidden sm:inline">Giữ bóng</span>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="flex items-center gap-0.5 text-[11px] font-bold text-[#39FF88] bg-[#39FF88]/15 px-1.5 py-0.5 rounded">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span className="hidden sm:inline">Đã nói</span>
                    </div>
                  )}

                  {isSkipped && (
                    <span className="text-[10px] font-semibold text-[#FF5C65] bg-[#FF5C65]/15 px-1.5 py-0.5 rounded">
                      Bỏ lượt
                    </span>
                  )}

                  {!isHolding && !isCompleted && !isSkipped && (
                    <span className="text-[10px] font-medium text-[#AAB6CC]/80">
                      Chờ bóng
                    </span>
                  )}
                </div>
              </div>

              {/* Member Name */}
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#AAB6CC] shrink-0" />
                <h4 className="font-bold text-sm sm:text-base text-[#F5F7FA] truncate tracking-tight">
                  {member.name}
                </h4>
              </div>

              {/* Member Class */}
              <div className="mt-1 flex items-center justify-between text-xs text-[#AAB6CC]">
                <span className="truncate">{member.className || 'CLB FPT'}</span>
                {isSelected && (
                  <span className="text-[10px] font-bold text-[#39FF88] uppercase tracking-wider">
                    Đã chọn
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Animated Volleyball Projectile */}
      {ballPos && (
        <div
          className="absolute z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{
            left: `${ballPos.x}px`,
            top: `${ballPos.y}px`,
          }}
        >
          <VolleyballIcon size={42} className="animate-spin" />
        </div>
      )}
    </div>
  );
};
