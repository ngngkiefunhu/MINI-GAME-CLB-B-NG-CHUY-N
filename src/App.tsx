/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Member, GameSettings, GameStats, ScreenType } from './types/game';
import { 
  loadSavedMembers, 
  saveMembersToStorage, 
  loadSavedSettings, 
  saveSettingsToStorage, 
  loadLastStats, 
  saveLastStats 
} from './utils/storage';
import { HomeScreen } from './components/HomeScreen';
import { MemberManagement } from './components/MemberManagement';
import { GameScreen } from './components/GameScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { SettingsModal } from './components/SettingsModal';
import { InstructionsModal } from './components/InstructionsModal';
import { soundManager } from './utils/audio';

export default function App() {
  // Screen state
  const [screen, setScreen] = useState<ScreenType>('HOME');

  // Members state
  const [members, setMembers] = useState<Member[]>(() => loadSavedMembers());

  // Settings state
  const [settings, setSettings] = useState<GameSettings>(() => loadSavedSettings());

  // Modals state
  const [showSettings, setShowSettings] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Invalid start notification
  const [invalidNotice, setInvalidNotice] = useState<string | null>(null);

  // Round 2 flag
  const [isRoundTwo, setIsRoundTwo] = useState(false);

  // Game results state
  const [lastStats, setLastStats] = useState<GameStats | null>(() => loadLastStats());

  // Sync sound manager enabled state with settings
  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Save members whenever updated
  const handleSaveMembers = (newMembers: Member[]) => {
    setMembers(newMembers);
    saveMembersToStorage(newMembers);
    setInvalidNotice(null);
  };

  // Save settings whenever updated
  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettingsToStorage(newSettings);
  };

  // Start Game handler
  const handleStartGame = (round2 = false) => {
    if (members.length < 2) {
      setInvalidNotice('Danh sách thành viên hiện có ít hơn 2 người. Vui lòng thêm thành viên trước khi bắt đầu.');
      setScreen('MEMBERS');
      return;
    }
    setInvalidNotice(null);
    setIsRoundTwo(round2);
    setScreen('GAME');
  };

  // Game finished handler
  const handleFinishGame = (finalStats: GameStats, updatedMembers: Member[]) => {
    setLastStats(finalStats);
    saveLastStats(finalStats);
    setMembers(updatedMembers);
    setScreen('RESULTS');
  };

  // Play Again: Keep members, reset stats, start new game
  const handlePlayAgain = () => {
    const resetMembers = members.map((m) => ({
      ...m,
      status: 'pending' as const,
    }));
    setMembers(resetMembers);
    setIsRoundTwo(false);
    setScreen('GAME');
  };

  // Play Round Two: Rapid volleyball skill & team challenge mode
  const handlePlayRoundTwo = () => {
    const resetMembers = members.map((m) => ({
      ...m,
      status: 'pending' as const,
    }));
    setMembers(resetMembers);
    setIsRoundTwo(true);
    setScreen('GAME');
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-[#F5F7FA] font-['Be_Vietnam_Pro',sans-serif] flex flex-col justify-between selection:bg-[#39FF88] selection:text-[#0B132B]">
      <main className="flex-1 w-full flex flex-col">
        {screen === 'HOME' && (
          <HomeScreen
            memberCount={members.length}
            settings={settings}
            onStartGame={() => handleStartGame(false)}
            onOpenMembers={() => {
              setInvalidNotice(null);
              setScreen('MEMBERS');
            }}
            onOpenInstructions={() => setShowInstructions(true)}
            onOpenSettings={() => setShowSettings(true)}
            invalidNotice={invalidNotice}
          />
        )}

        {screen === 'MEMBERS' && (
          <MemberManagement
            members={members}
            onSaveMembers={handleSaveMembers}
            onBack={() => setScreen('HOME')}
            settings={settings}
          />
        )}

        {screen === 'GAME' && (
          <GameScreen
            members={members}
            settings={settings}
            isRoundTwo={isRoundTwo}
            onFinishGame={handleFinishGame}
            onQuitToHome={() => setScreen('HOME')}
          />
        )}

        {screen === 'RESULTS' && lastStats && (
          <ResultsScreen
            members={members}
            stats={lastStats}
            totalDuration={settings.totalDuration}
            onPlayAgain={handlePlayAgain}
            onPlayRoundTwo={handlePlayRoundTwo}
            onGoHome={() => setScreen('HOME')}
          />
        )}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Instructions Modal */}
      {showInstructions && (
        <InstructionsModal onClose={() => setShowInstructions(false)} />
      )}
    </div>
  );
}
