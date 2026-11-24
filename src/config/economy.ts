// ---------------------------------------------------------------------------
// M6. Экономика: стартовый капитал, награды, ремонт, покраска, апгрейды.
//
// Все числа баланса — здесь, системы только читают (AGENTS §5).
// Апгрейды намеренно не трогают физику машин (зона vehicle): они меняют
// экономику и правила миссий — награду, цену сервиса и силу розыска при провале.
// ---------------------------------------------------------------------------

export type UpgradeId = 'contacts' | 'garage' | 'insurance';

export interface UpgradeDef {
  readonly id: UpgradeId;
  readonly labelKey: string;
  readonly descKey: string;
  /** Уровней всего (0 — не куплен). */
  readonly maxLevel: number;
  /** Цена первого уровня, кредиты. */
  readonly baseCost: number;
  /** Прибавка к цене за каждый следующий уровень. */
  readonly costStep: number;
  /** contacts: +доля к награде за миссию за уровень. */
  readonly rewardBonus?: number;
  /** garage: −доля цены ремонта/покраски за уровень. */
  readonly serviceDiscount?: number;
  /** insurance: на сколько звёзд меньше даёт провал миссии. */
  readonly heatRelief?: number;
}

export interface RepairPricing {
  /** Цена за единицу прочности. */
  readonly perHp: number;
  /** Минимальная цена ремонта, если машина повреждена. */
  readonly minCost: number;
  /** Доплата за восстановление уничтоженной машины. */
  readonly wreckSurcharge: number;
}

export interface EconomyConfig {
  /** Стартовый капитал новой игры. */
  readonly startMoney: number;
  /** Награда за угон городской машины (не миссионной). */
  readonly stealReward: number;
  /** Кулдаун награды за угон, чтобы не фармили, с. */
  readonly stealCooldown: number;
  readonly repair: RepairPricing;
  /** Цена покраски (сброс розыска). */
  readonly paintCost: number;
  /** Цена патронов: боезапас всех стволов. */
  readonly ammoCost: number;
  /** Апгрейды, порядок — порядок в магазине. */
  readonly upgrades: readonly UpgradeDef[];
  /** Автосохранение раз в N секунд (0 — выключено). */
  readonly autosaveInterval: number;
  /** Радиус услуг гаража вокруг сервисной точки, м. */
  readonly garageRadius: number;
  /** Сервисная точка у гаража на проезжей части (street_zp100), [x, z]. */
  readonly garage: readonly [number, number];
  /** Ограничение суммы на руках (защита от переполнения). */
  readonly maxMoney: number;
}

export const ECONOMY: EconomyConfig = {
  startMoney: 500,
  stealReward: 40,
  stealCooldown: 20,
  repair: {
    perHp: 1.1,
    minCost: 25,
    wreckSurcharge: 80,
  },
  paintCost: 120,
  ammoCost: 60,
  upgrades: [
    {
      id: 'contacts',
      labelKey: 'upgrade.contacts.name',
      descKey: 'upgrade.contacts.desc',
      maxLevel: 3,
      baseCost: 300,
      costStep: 250,
      rewardBonus: 0.1,
    },
    {
      id: 'garage',
      labelKey: 'upgrade.garage.name',
      descKey: 'upgrade.garage.desc',
      maxLevel: 2,
      baseCost: 350,
      costStep: 300,
      serviceDiscount: 0.15,
    },
    {
      id: 'insurance',
      labelKey: 'upgrade.insurance.name',
      descKey: 'upgrade.insurance.desc',
      maxLevel: 1,
      baseCost: 500,
      costStep: 0,
      heatRelief: 1,
    },
  ],
  autosaveInterval: 60,
  garageRadius: 40,
  garage: [-50, 100],
  maxMoney: 9_999_999,
};
