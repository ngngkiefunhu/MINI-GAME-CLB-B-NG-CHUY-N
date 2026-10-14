import { Member, GameSettings, GameStats } from '../types/game';

const MEMBERS_KEY = 'volleyball_club_members_v1';
const SETTINGS_KEY = 'volleyball_club_settings_v1';
const STATS_KEY = 'volleyball_club_last_stats_v1';

export const DEFAULT_SETTINGS: GameSettings = {
  maxMembers: 20,
  totalDuration: 420, // 7 minutes in seconds
  turnDuration: 10,   // 10 seconds per turn
  teamChallengesEnabled: true,
  soundEnabled: false, // Default off as requested: "Tắt âm thanh tự động để không làm gián đoạn buổi sinh hoạt"
  animationEnabled: true,
};

export function loadSavedMembers(): Member[] {
  try {
    const raw = localStorage.getItem(MEMBERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((m, idx) => ({
        ...m,
        order: m.order || idx + 1,
        status: 'pending' as const,
      }));
    }
  } catch (e) {
    console.warn('Could not load members from localStorage', e);
  }
  return [];
}

export function saveMembersToStorage(members: Member[]): void {
  try {
    const dataToSave = members.map(m => ({
      id: m.id,
      order: m.order,
      name: m.name,
      className: m.className,
    }));
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(dataToSave));
  } catch (e) {
    console.warn('Could not save members to localStorage', e);
  }
}

export function loadSavedSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Could not load settings from localStorage', e);
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettingsToStorage(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Could not save settings to localStorage', e);
  }
}

export function loadLastStats(): GameStats | null {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not load last stats', e);
  }
  return null;
}

export function saveLastStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.warn('Could not save stats', e);
  }
}
