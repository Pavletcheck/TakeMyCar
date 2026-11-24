// ---------------------------------------------------------------------------
// M8. Достижения: 20 целей и статистика прогресса.
//
// Каждое достижение — пара «стат + порог». Система (systems/achievements)
// только сверяет числа, которые app ей передаёт раз в HUD-тик. Награда —
// кредиты, чтобы ачивки были частью экономики, а не витриной.
// ---------------------------------------------------------------------------

/** Ключи статистики, которую ведёт app. */
export type AchievementStat =
  | 'packages'
  | 'ramps'
  | 'uniqueCars'
  | 'jobs'
  | 'jobKinds'
  | 'events'
  | 'maxStars'
  | 'missions'
  | 'earned'
  | 'wrecks'
  | 'raceWins';

export type AchievementStats = Record<AchievementStat, number>;

export interface AchievementDef {
  readonly id: string;
  readonly titleKey: string;
  readonly descKey: string;
  readonly stat: AchievementStat;
  readonly target: number;
  /** Награда в кредитах. */
  readonly reward: number;
  /** Короткий символ вместо иконки (без внешних ассетов). */
  readonly glyph: string;
}

export const ACHIEVEMENTS: readonly AchievementDef[] = [
  { id: 'first_package', titleKey: 'achievement.first_package.title', descKey: 'achievement.first_package.desc', stat: 'packages', target: 1, reward: 100, glyph: '◆' },
  { id: 'packages_10', titleKey: 'achievement.packages_10.title', descKey: 'achievement.packages_10.desc', stat: 'packages', target: 10, reward: 400, glyph: '◆' },
  { id: 'packages_20', titleKey: 'achievement.packages_20.title', descKey: 'achievement.packages_20.desc', stat: 'packages', target: 20, reward: 700, glyph: '◆' },
  { id: 'packages_40', titleKey: 'achievement.packages_40.title', descKey: 'achievement.packages_40.desc', stat: 'packages', target: 40, reward: 1500, glyph: '✦' },
  { id: 'ramp_first', titleKey: 'achievement.ramp_first.title', descKey: 'achievement.ramp_first.desc', stat: 'ramps', target: 1, reward: 150, glyph: '▲' },
  { id: 'ramps_10', titleKey: 'achievement.ramps_10.title', descKey: 'achievement.ramps_10.desc', stat: 'ramps', target: 10, reward: 800, glyph: '▲' },
  { id: 'ramps_all', titleKey: 'achievement.ramps_all.title', descKey: 'achievement.ramps_all.desc', stat: 'ramps', target: 12, reward: 1200, glyph: '✦' },
  { id: 'car_first', titleKey: 'achievement.car_first.title', descKey: 'achievement.car_first.desc', stat: 'uniqueCars', target: 1, reward: 300, glyph: '⬢' },
  { id: 'cars_all', titleKey: 'achievement.cars_all.title', descKey: 'achievement.cars_all.desc', stat: 'uniqueCars', target: 8, reward: 2500, glyph: '✦' },
  { id: 'job_first', titleKey: 'achievement.job_first.title', descKey: 'achievement.job_first.desc', stat: 'jobs', target: 1, reward: 200, glyph: '■' },
  { id: 'jobs_5', titleKey: 'achievement.jobs_5.title', descKey: 'achievement.jobs_5.desc', stat: 'jobs', target: 5, reward: 800, glyph: '■' },
  { id: 'job_types', titleKey: 'achievement.job_types.title', descKey: 'achievement.job_types.desc', stat: 'jobKinds', target: 5, reward: 1200, glyph: '✦' },
  { id: 'event_first', titleKey: 'achievement.event_first.title', descKey: 'achievement.event_first.desc', stat: 'events', target: 1, reward: 200, glyph: '◈' },
  { id: 'events_5', titleKey: 'achievement.events_5.title', descKey: 'achievement.events_5.desc', stat: 'events', target: 5, reward: 700, glyph: '◈' },
  { id: 'stars_3', titleKey: 'achievement.stars_3.title', descKey: 'achievement.stars_3.desc', stat: 'maxStars', target: 3, reward: 500, glyph: '★' },
  { id: 'stars_5', titleKey: 'achievement.stars_5.title', descKey: 'achievement.stars_5.desc', stat: 'maxStars', target: 5, reward: 1500, glyph: '★' },
  { id: 'missions_5', titleKey: 'achievement.missions_5.title', descKey: 'achievement.missions_5.desc', stat: 'missions', target: 5, reward: 700, glyph: '▶' },
  { id: 'earned_10k', titleKey: 'achievement.earned_10k.title', descKey: 'achievement.earned_10k.desc', stat: 'earned', target: 10000, reward: 1000, glyph: '$' },
  { id: 'wrecks_25', titleKey: 'achievement.wrecks_25.title', descKey: 'achievement.wrecks_25.desc', stat: 'wrecks', target: 25, reward: 600, glyph: '✖' },
  { id: 'race_wins_3', titleKey: 'achievement.race_wins_3.title', descKey: 'achievement.race_wins_3.desc', stat: 'raceWins', target: 3, reward: 900, glyph: '⚑' },
];

export function emptyAchievementStats(): AchievementStats {
  return {
    packages: 0,
    ramps: 0,
    uniqueCars: 0,
    jobs: 0,
    jobKinds: 0,
    events: 0,
    maxStars: 0,
    missions: 0,
    earned: 0,
    wrecks: 0,
    raceWins: 0,
  };
}

export function findAchievement(id: string): AchievementDef | undefined {
  for (let i = 0; i < ACHIEVEMENTS.length; i += 1) {
    if (ACHIEVEMENTS[i].id === id) return ACHIEVEMENTS[i];
  }
  return undefined;
}
