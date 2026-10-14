export type MemberStatus = 'pending' | 'holding' | 'completed' | 'skipped';

export interface Member {
  id: string;
  order: number;
  name: string;
  className: string;
  status: MemberStatus;
  introTime?: number; // timestamp or duration
  notes?: string;
}

export interface TeamChallenge {
  id: number;
  title: string;
  instruction: string;
  duration: number; // in seconds
  hint?: string;
}

export interface GameSettings {
  maxMembers: number;
  totalDuration: number; // in seconds, default 420 (7 mins)
  turnDuration: number; // in seconds, default 10
  teamChallengesEnabled: boolean;
  soundEnabled: boolean;
  animationEnabled: boolean;
}

export interface PassRecord {
  fromId: string;
  toId: string;
  timestamp: number;
}

export interface GameStats {
  introducedCount: number;
  passedCount: number;
  challengeCount: number;
  skippedCount: number;
  totalScore: number;
  elapsedTime: number; // in seconds
  passHistory: PassRecord[];
  completedChallengeIds: number[];
}

export type ScreenType = 'HOME' | 'MEMBERS' | 'GAME' | 'RESULTS';
