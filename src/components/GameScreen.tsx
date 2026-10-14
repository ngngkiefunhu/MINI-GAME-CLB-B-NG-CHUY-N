import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Member, GameSettings, GameStats, TeamChallenge } from '../types/game';
import { VolleyballCourt } from './VolleyballCourt';
import { VolleyballIcon } from './VolleyballIcon';
import { getRandomChallenge } from '../utils/challenges';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Pause, 
  Play, 
  RotateCcw, 
  Check, 
  ArrowRight, 
  SkipForward, 
  Flag, 
  Trophy, 
  Clock, 
  AlertTriangle, 
  Maximize, 
  Minimize,
  Sparkles,
  Users
} from 'lucide-react';

interface GameScreenProps {
  members: Member[];
  settings: GameSettings;
  isRoundTwo?: boolean;
  onFinishGame: (finalStats: GameStats, updatedMembers: Member[]) => void;
  onQuitToHome: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  members: initialMembers,
  settings,
  isRoundTwo = false,
  onFinishGame,
  onQuitToHome,
}) => {
  // Members state
  const [memberList, setMemberList] = useState<Member[]>(() => {
    // If starting fresh or round 2
    return initialMembers.map((m) => ({
      ...m,
      status: 'pending',
    }));
  });

  // Current ball holder & receiver
  const [currentHolderId, setCurrentHolderId] = useState<string | null>(null);
  const [selectedReceiverId, setSelectedReceiverId] = useState<string | null>(null);
  const [isSelectingReceiver, setIsSelectingReceiver] = useState(false);
  const [passFromId, setPassFromId] = useState<string | null>(null);
  const [passToId, setPassToId] = useState<string | null>(null);
  const [isPassingAnimation, setIsPassingAnimation] = useState(false);

  // Status banner message
  const [notificationMsg, setNotificationMsg] = useState<string>('');

  // Timers
  const [masterTimeLeft, setMasterTimeLeft] = useState(settings.totalDuration);
  const [turnTimeLeft, setTurnTimeLeft] = useState(settings.turnDuration);
  const [isPaused, setIsPaused] = useState(false);

  // Statistics
  const [stats, setStats] = useState<GameStats>({
    introducedCount: 0,
    passedCount: 0,
    challengeCount: 0,
    skippedCount: 0,
    totalScore: 0,
    elapsedTime: 0,
    passHistory: [],
    completedChallengeIds: [],
  });

  // Team Challenge
  const [activeChallenge, setActiveChallenge] = useState<TeamChallenge | null>(null);
  const [challengeTimeLeft, setChallengeTimeLeft] = useState(0);

  // Modals & Confirmations
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [showRoundCompleteModal, setShowRoundCompleteModal] = useState(false);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Track if game has started initial pick
  const hasInitialized = useRef(false);

  // Pick first person randomly on mount
  useEffect(() => {
    if (hasInitialized.current || memberList.length === 0) return;
    hasInitialized.current = true;

    const randomIndex = Math.floor(Math.random() * memberList.length);
    const firstMember = memberList[randomIndex];

    setCurrentHolderId(firstMember.id);
    setMemberList((prev) =>
      prev.map((m) => (m.id === firstMember.id ? { ...m, status: 'holding' } : m))
    );

    setNotificationMsg(`Bóng đang ở chỗ ${firstMember.name}!`);
    soundManager.playWhistle();
  }, [memberList]);

  // Master countdown timer
  useEffect(() => {
    if (isPaused || masterTimeLeft <= 0 || showRoundCompleteModal) return;

    const timer = setInterval(() => {
      setMasterTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          soundManager.playBuzzer();
          return 0;
        }
        // Audible tick for last 10s
        if (prev <= 10) {
          soundManager.playTick(true);
        }
        return prev - 1;
      });

      setStats((prev) => ({
        ...prev,
        elapsedTime: prev.elapsedTime + 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, masterTimeLeft, showRoundCompleteModal]);

  // Turn countdown timer (per member intro)
  useEffect(() => {
    if (isPaused || turnTimeLeft <= 0 || isSelectingReceiver || activeChallenge || showRoundCompleteModal) {
      return;
    }

    const timer = setInterval(() => {
      setTurnTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, turnTimeLeft, isSelectingReceiver, activeChallenge, showRoundCompleteModal]);

  // Challenge countdown timer
  useEffect(() => {
    if (isPaused || !activeChallenge || challengeTimeLeft <= 0) return;

    const timer = setInterval(() => {
      setChallengeTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, activeChallenge, challengeTimeLeft]);

  // Check if master time ran out -> transition to results
  useEffect(() => {
    if (masterTimeLeft === 0) {
      onFinishGame(stats, memberList);
    }
  }, [masterTimeLeft, stats, memberList, onFinishGame]);

  // Current holding member
  const currentMember = memberList.find((m) => m.id === currentHolderId);

  // Trigger celebration confetti
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#39FF88', '#FF8A36', '#F5F7FA', '#0B132B'],
      });
      soundManager.playCheer();
    } catch {
      // fallback
    }
  }, []);

  // Handle member done introducing
  const handleDoneIntro = () => {
    if (!currentHolderId) return;

    soundManager.playSuccess();
    setIsSelectingReceiver(true);

    // Filter available receivers who haven't introduced yet
    const pendingList = memberList.filter(
      (m) => m.id !== currentHolderId && m.status !== 'completed'
    );

    if (pendingList.length === 1) {
      // Auto-select if only 1 receiver left
      setSelectedReceiverId(pendingList[0].id);
      setNotificationMsg(`Đã chọn ${pendingList[0].name}. Nhấn "CHUYỀN BÓNG" để hoàn tất!`);
    } else if (pendingList.length === 0) {
      // Everyone has gone! Allow passing to anyone
      setNotificationMsg('Tất cả mọi người đã giới thiệu! Chọn bất kỳ ai để tiếp tục.');
    } else {
      setNotificationMsg('Hãy chọn một đồng đội chưa giới thiệu trên sân để chuyền bóng!');
    }
  };

  // Handle pass ball to selected receiver
  const handlePassBall = () => {
    if (!currentHolderId || !selectedReceiverId) return;

    const fromId = currentHolderId;
    const toId = selectedReceiverId;
    const toMember = memberList.find((m) => m.id === toId);

    // Play ball pass sound & trigger ball animation
    soundManager.playBallPass();
    setPassFromId(fromId);
    setPassToId(toId);
    setIsPassingAnimation(true);

    // Update members
    const nextList = memberList.map((m) => {
      if (m.id === fromId) {
        return { ...m, status: 'completed' as const };
      }
      if (m.id === toId) {
        return { ...m, status: 'holding' as const };
      }
      return m;
    });

    const newIntroCount = stats.introducedCount + 1;
    const newPassedCount = stats.passedCount + 1;
    const newTotalScore = stats.totalScore + 1; // 1 point per completed introduction

    setMemberList(nextList);
    setCurrentHolderId(toId);
    setSelectedReceiverId(null);
    setIsSelectingReceiver(false);
    setTurnTimeLeft(settings.turnDuration);

    setStats((prev) => ({
      ...prev,
      introducedCount: newIntroCount,
      passedCount: newPassedCount,
      totalScore: newTotalScore,
      passHistory: [
        ...prev.passHistory,
        { fromId, toId, timestamp: Date.now() },
      ],
    }));

    setNotificationMsg(`Bóng đã đến với ${toMember?.name || 'đồng đội'}!`);

    // Reset ball animation state after delay
    setTimeout(() => {
      setIsPassingAnimation(false);
    }, 800);

    // Check if team completed full round (everyone introduced)
    const remainingPending = nextList.filter((m) => m.status === 'pending');
    if (remainingPending.length === 0) {
      triggerConfetti();
      setShowRoundCompleteModal(true);
      return;
    }

    // Check Team Challenge condition: Every 5 successful introductions
    if (settings.teamChallengesEnabled && newIntroCount % 5 === 0) {
      const challenge = getRandomChallenge(stats.completedChallengeIds);
      setActiveChallenge(challenge);
      setChallengeTimeLeft(challenge.duration);
      soundManager.playWhistle();
    }
  };

  // Handle Skip turn for current holder
  const handleConfirmSkip = () => {
    if (!currentHolderId) return;

    // Mark current member as skipped
    const fromId = currentHolderId;
    const nextList = memberList.map((m) => {
      if (m.id === fromId) {
        return { ...m, status: 'skipped' as const };
      }
      return m;
    });

    // Pick next unintroduced member
    const candidates = nextList.filter((m) => m.status === 'pending');
    let nextId: string | null = null;

    if (candidates.length > 0) {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      nextId = candidates[randomIndex].id;
    } else {
      // If no pending, pick anyone not the skipped one
      const others = nextList.filter((m) => m.id !== fromId);
      if (others.length > 0) {
        nextId = others[0].id;
      }
    }

    if (nextId) {
      const updatedList = nextList.map((m) =>
        m.id === nextId ? { ...m, status: 'holding' as const } : m
      );
      setMemberList(updatedList);
      setCurrentHolderId(nextId);
      const nextMember = updatedList.find((m) => m.id === nextId);
      setNotificationMsg(`Đã bỏ lượt. Bóng được chuyển sang ${nextMember?.name}!`);
    } else {
      setMemberList(nextList);
    }

    setStats((prev) => ({
      ...prev,
      skippedCount: prev.skippedCount + 1,
    }));

    setIsSelectingReceiver(false);
    setSelectedReceiverId(null);
    setShowSkipConfirm(false);
    setTurnTimeLeft(settings.turnDuration);
  };

  // Team Challenge Completed (+2 points)
  const handleCompleteChallenge = () => {
    if (!activeChallenge) return;

    soundManager.playSuccess();
    setStats((prev) => ({
      ...prev,
      challengeCount: prev.challengeCount + 1,
      totalScore: prev.totalScore + 2, // 2 points per challenge
      completedChallengeIds: [...prev.completedChallengeIds, activeChallenge.id],
    }));

    setActiveChallenge(null);
  };

  // Team Challenge Skipped (0 points)
  const handleSkipChallenge = () => {
    setActiveChallenge(null);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Time warning color classes
  const getTimerColorClass = () => {
    if (masterTimeLeft <= 10) return 'text-[#FF5C65] animate-pulse';
    if (masterTimeLeft <= 60) return 'text-[#FF8A36]';
    return 'text-[#F5F7FA]';
  };

  // Progress percentage
  const totalCount = memberList.length;
  const introducedCount = memberList.filter((m) => m.status === 'completed').length;
  const progressPercent = totalCount > 0 ? (introducedCount / totalCount) * 100 : 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 flex flex-col justify-between min-h-[calc(100vh-3rem)]">
      {/* 1. TOP BAR */}
      <header className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-[#22335E]">
        {/* Left: Branding */}
        <div className="flex items-center gap-2.5">
          <VolleyballIcon size={28} />
          <div>
            <span className="text-xs font-black tracking-widest text-[#39FF88] uppercase block">
              VOLLEYBALL CLUB
            </span>
            <span className="text-xs text-[#AAB6CC] font-medium hidden sm:inline">
              FPT HẬU GIANG {isRoundTwo && '· VÒNG 2'}
            </span>
          </div>
        </div>

        {/* Center: Game Name */}
        <div className="text-center">
          <h1 className="text-base sm:text-xl font-black text-[#F5F7FA] tracking-tight uppercase">
            CHUYỀN BÓNG GỌI TÊN
          </h1>
        </div>

        {/* Right: Master Timer, Turn Timer, Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Master Countdown Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#151F3D] border border-[#22335E]">
            <Clock className="w-4 h-4 text-[#AAB6CC]" />
            <span className={`text-lg sm:text-2xl font-mono font-black tabular-nums ${getTimerColorClass()}`}>
              {formatTime(masterTimeLeft)}
            </span>
          </div>

          {/* Pause Button */}
          <button
            onClick={() => {
              setIsPaused(true);
              setShowPauseModal(true);
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#151F3D] hover:bg-[#1C2A52] text-[#F5F7FA] text-xs font-bold border border-[#22335E] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Tạm dừng trận đấu"
          >
            <Pause className="w-4 h-4 text-[#FF8A36]" />
            <span className="hidden sm:inline">TẠM DỪNG</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-[#151F3D] hover:bg-[#1C2A52] text-[#AAB6CC] hover:text-[#F5F7FA] border border-[#22335E] transition-colors cursor-pointer hidden md:flex"
            title="Toàn màn hình máy chiếu"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. STATS & PROGRESS STRIP */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-3">
        {/* Stat 1: Introduced */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-[#151F3D] border border-[#22335E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#39FF88]" />
            <span className="text-[11px] sm:text-xs text-[#AAB6CC] font-bold uppercase hidden sm:inline">
              Đã giới thiệu
            </span>
            <span className="text-[11px] text-[#AAB6CC] font-bold uppercase sm:hidden">
              Đã nói
            </span>
          </div>
          <span className="text-sm sm:text-lg font-mono font-bold text-[#F5F7FA] tabular-nums">
            {String(introducedCount).padStart(2, '0')}/{String(totalCount).padStart(2, '0')}
          </span>
        </div>

        {/* Stat 2: Passes */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-[#151F3D] border border-[#22335E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <VolleyballIcon size={16} />
            <span className="text-[11px] sm:text-xs text-[#AAB6CC] font-bold uppercase hidden sm:inline">
              Chuyền thành công
            </span>
            <span className="text-[11px] text-[#AAB6CC] font-bold uppercase sm:hidden">
              Chuyền
            </span>
          </div>
          <span className="text-sm sm:text-lg font-mono font-bold text-[#FF8A36] tabular-nums">
            {stats.passedCount}
          </span>
        </div>

        {/* Stat 3: Team Challenges */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-[#151F3D] border border-[#22335E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#39FF88]" />
            <span className="text-[11px] sm:text-xs text-[#AAB6CC] font-bold uppercase hidden sm:inline">
              Thử thách đồng đội
            </span>
            <span className="text-[11px] text-[#AAB6CC] font-bold uppercase sm:hidden">
              Thử thách
            </span>
          </div>
          <span className="text-sm sm:text-lg font-mono font-bold text-[#39FF88] tabular-nums">
            {stats.challengeCount}
          </span>
        </div>
      </div>

      {/* Real-time Progress Bar */}
      <div className="w-full bg-[#151F3D] rounded-full h-2 mb-3 overflow-hidden border border-[#22335E]/60">
        <div
          className="bg-gradient-to-r from-[#39FF88] to-[#FF8A36] h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 3. CENTER: VOLLEYBALL COURT WITH CARDS */}
      <div className="flex-1 my-1">
        <VolleyballCourt
          members={memberList}
          currentHolderId={currentHolderId}
          selectedReceiverId={selectedReceiverId}
          onSelectReceiver={(id) => {
            setSelectedReceiverId(id);
            const target = memberList.find((m) => m.id === id);
            setNotificationMsg(`Đã chọn ${target?.name}. Hãy bấm "CHUYỀN BÓNG"!`);
          }}
          isSelectingReceiver={isSelectingReceiver}
          isPassingAnimation={isPassingAnimation}
          passFromId={passFromId}
          passToId={passToId}
          animationEnabled={settings.animationEnabled}
        />
      </div>

      {/* 4. ACTION & INSTRUCTION AREA */}
      <div className="mt-3 p-4 rounded-2xl bg-[#151F3D] border border-[#22335E] shadow-xl">
        {/* Banner with big instruction */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-[#22335E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF8A36]/20 border border-[#FF8A36]/40 flex items-center justify-center shrink-0">
              <VolleyballIcon size={24} animate={true} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#FF8A36] uppercase tracking-wider">
                  ĐẾN LƯỢT CỦA BẠN!
                </span>
                <span className="text-xs text-[#AAB6CC]">·</span>
                <span className="text-sm sm:text-base font-black text-[#F5F7FA]">
                  {currentMember?.name} ({currentMember?.className})
                </span>
              </div>
              <p className="text-xs text-[#AAB6CC] mt-0.5">
                {notificationMsg || 'Giới thiệu tên, lớp và một điều thú vị về bản thân (hoặc vị trí bóng chuyền yêu thích).'}
              </p>
            </div>
          </div>

          {/* Turn timer badge (10s) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B132B] border border-[#22335E]">
            <Clock className="w-3.5 h-3.5 text-[#FF8A36]" />
            <span className="text-xs text-[#AAB6CC]">Thời gian nói:</span>
            <span className="text-sm font-mono font-bold text-[#FF8A36] tabular-nums">
              {turnTimeLeft}s
            </span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Main game flow buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {!isSelectingReceiver ? (
              <button
                onClick={handleDoneIntro}
                className="py-3 px-5 rounded-xl bg-[#39FF88] hover:bg-[#2EE677] text-[#0B132B] font-black text-sm uppercase tracking-wide shadow-lg shadow-[#39FF88]/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>ĐÃ GIỚI THIỆU XONG</span>
              </button>
            ) : (
              <button
                onClick={handlePassBall}
                disabled={!selectedReceiverId}
                className="py-3 px-6 rounded-xl bg-[#FF8A36] hover:bg-[#E87825] disabled:opacity-40 disabled:cursor-not-allowed text-[#0B132B] font-black text-sm uppercase tracking-wide shadow-lg shadow-[#FF8A36]/30 flex items-center gap-2 transition-all cursor-pointer animate-pulse"
              >
                <ArrowRight className="w-4 h-4 stroke-[3]" />
                <span>
                  {selectedReceiverId ? 'CHUYỀN BÓNG NGAY!' : 'CHỌN NGƯỜI ĐỂ CHUYỀN'}
                </span>
              </button>
            )}

            <button
              onClick={() => setShowSkipConfirm(true)}
              className="py-3 px-4 rounded-xl bg-[#0B132B] hover:bg-[#1C2A52] text-[#AAB6CC] hover:text-[#FF5C65] font-semibold text-xs border border-[#22335E] hover:border-[#FF5C65]/40 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Bỏ qua lượt này"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>BỎ LƯỢT</span>
            </button>
          </div>

          {/* End Game Button */}
          <button
            onClick={() => setShowQuitConfirm(true)}
            className="py-2.5 px-3.5 rounded-xl bg-transparent hover:bg-[#FF5C65]/15 text-[#AAB6CC] hover:text-[#FF5C65] font-semibold text-xs border border-[#22335E] hover:border-[#FF5C65]/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>KẾT THÚC GAME</span>
          </button>
        </div>
      </div>

      {/* MODAL 1: TEAM CHALLENGE POPUP */}
      {activeChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#151F3D] border-2 border-[#FF8A36] p-6 shadow-[0_0_40px_rgba(255,138,54,0.4)]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#22335E]">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-[#FF8A36]" />
                <h3 className="text-base sm:text-lg font-black text-[#F5F7FA] uppercase tracking-tight">
                  THỬ THÁNG ĐỒNG ĐỘI (+2 ĐIỂM)
                </h3>
              </div>

              {/* Challenge countdown */}
              <div className="px-3 py-1 rounded-xl bg-[#FF8A36]/20 border border-[#FF8A36] text-[#FF8A36] font-mono font-bold text-sm tabular-nums">
                {challengeTimeLeft}s
              </div>
            </div>

            {/* Title & Instruction */}
            <div className="my-4">
              <h4 className="text-xl font-black text-[#39FF88] mb-2 leading-snug">
                {activeChallenge.title}
              </h4>
              <p className="text-sm text-[#F5F7FA] mb-3 leading-relaxed">
                {activeChallenge.instruction}
              </p>
              {activeChallenge.hint && (
                <div className="p-3 rounded-xl bg-[#0B132B] border border-[#22335E] text-xs text-[#AAB6CC]">
                  {activeChallenge.hint}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-3 border-t border-[#22335E]">
              <button
                onClick={handleSkipChallenge}
                className="px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-[#1E2E59] text-[#AAB6CC] hover:text-[#F5F7FA] text-xs font-semibold border border-[#22335E] cursor-pointer"
              >
                BỎ QUA THỬ THÁCH
              </button>
              <button
                onClick={handleCompleteChallenge}
                className="px-5 py-2.5 rounded-xl bg-[#39FF88] hover:bg-[#2EE677] text-[#0B132B] font-black text-xs uppercase tracking-wide shadow-lg shadow-[#39FF88]/20 cursor-pointer"
              >
                XÁC NHẬN HOÀN THÀNH (+2Đ)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PAUSE OVERLAY */}
      {showPauseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#151F3D] border border-[#22335E] p-6 shadow-2xl text-center">
            <Pause className="w-12 h-12 text-[#FF8A36] mx-auto mb-3" />
            <h3 className="text-2xl font-black text-[#F5F7FA] uppercase tracking-tight mb-2">
              GAME ĐANG TẠM DỪNG
            </h3>
            <p className="text-xs text-[#AAB6CC] mb-6">
              Thời gian và tiến độ đã được giữ nguyên. Nhấn tiếp tục để quay lại trận đấu.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsPaused(false);
                  setShowPauseModal(false);
                }}
                className="w-full py-3.5 rounded-xl bg-[#39FF88] hover:bg-[#2EE677] text-[#0B132B] font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-[#0B132B]" />
                <span>TIẾP TỤC TRẬN ĐẤU</span>
              </button>

              <button
                onClick={() => {
                  setShowPauseModal(false);
                  onFinishGame(stats, memberList);
                }}
                className="w-full py-2.5 rounded-xl bg-[#0B132B] hover:bg-[#FF5C65]/20 text-[#FF5C65] font-bold text-xs border border-[#22335E] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Flag className="w-4 h-4" />
                <span>KẾT THÚC GAME VÀ XEM KẾT QUẢ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SKIP CONFIRMATION */}
      {showSkipConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#151F3D] border border-[#FF5C65]/40 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-3 text-[#FF5C65]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold">Xác nhận bỏ lượt</h3>
            </div>
            <p className="text-xs text-[#AAB6CC] mb-5">
              Bạn có muốn bỏ qua lượt của <strong>{currentMember?.name}</strong>? Thành viên này sẽ được ghi nhận là "Bỏ lượt" và bóng sẽ được chuyển cho người tiếp theo.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSkipConfirm(false)}
                className="px-4 py-2 rounded-xl bg-[#0B132B] text-[#F5F7FA] text-xs font-semibold border border-[#22335E] cursor-pointer"
              >
                Không, tiếp tục nói
              </button>
              <button
                onClick={handleConfirmSkip}
                className="px-4 py-2 rounded-xl bg-[#FF5C65] text-white text-xs font-bold cursor-pointer"
              >
                Bỏ qua lượt này
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: QUIT CONFIRMATION */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#151F3D] border border-[#22335E] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[#F5F7FA] mb-2">
              Kết thúc trận đấu?
            </h3>
            <p className="text-xs text-[#AAB6CC] mb-5">
              Bạn có muốn dừng trò chơi ngay bây giờ và chuyển sang bảng tổng kết kết quả?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="px-4 py-2 rounded-xl bg-[#0B132B] text-[#F5F7FA] text-xs font-semibold border border-[#22335E] cursor-pointer"
              >
                Tiếp tục chơi
              </button>
              <button
                onClick={() => {
                  setShowQuitConfirm(false);
                  onFinishGame(stats, memberList);
                }}
                className="px-4 py-2 rounded-xl bg-[#FF8A36] text-[#0B132B] text-xs font-black cursor-pointer"
              >
                Xem kết quả
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ALL MEMBERS COMPLETED ROUND 1 */}
      {showRoundCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#151F3D] border-2 border-[#39FF88] p-6 shadow-[0_0_50px_rgba(57,255,136,0.3)] text-center">
            <div className="inline-flex p-3 rounded-2xl bg-[#39FF88]/20 border border-[#39FF88]/40 mb-3">
              <Sparkles className="w-10 h-10 text-[#39FF88]" />
            </div>

            <h3 className="text-2xl font-black text-[#39FF88] uppercase tracking-tight mb-2">
              XUẤT SẮC! ĐỘI ĐÃ HOÀN THÀNH VÒNG LÀM QUEN!
            </h3>

            <p className="text-sm text-[#F5F7FA] mb-6">
              Tất cả các thành viên đã lên tiếng và kết nối với nhau. Thời gian thi đấu còn lại:{' '}
              <span className="font-mono font-bold text-[#FF8A36]">{formatTime(masterTimeLeft)}</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setShowRoundCompleteModal(false);
                  onFinishGame(stats, memberList);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#39FF88] hover:bg-[#2EE677] text-[#0B132B] font-black text-xs uppercase tracking-wide cursor-pointer"
              >
                XEM BẢNG TỔNG KẾT
              </button>

              <button
                onClick={() => {
                  setShowRoundCompleteModal(false);
                  // Reset statuses for a second rapid pass round!
                  setMemberList((prev) =>
                    prev.map((m) => ({ ...m, status: 'pending' }))
                  );
                  setNotificationMsg('Bắt đầu vòng giao lưu nâng cao!');
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#151F3D] hover:bg-[#1C2A52] text-[#F5F7FA] font-bold text-xs border border-[#22335E] cursor-pointer"
              >
                CHƠI TIẾP VÒNG NÂNG CAO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
