// ---------------------------------------------------------------------------
// M6. Экономика: деньги, транзакции, ремонт, покраска, патроны и апгрейды.
//
// Система не знает про HUD и про полицию: покраска и патроны работают через
// колбэки (onPaintReset/onRefill), которые ставит app/bootstrap. Это держит
// systems/economy независимой от systems/wanted и systems/combat.
// ---------------------------------------------------------------------------

import { repairVehicleFull } from '../entities/vehicle';
import type { VehicleState } from '../entities/vehicle';
import type { EconomyConfig, UpgradeDef, UpgradeId } from '../config/economy';

export type EconomyReason =
  | 'mission'
  | 'steal'
  | 'repair'
  | 'paint'
  | 'ammo'
  | 'upgrade'
  | 'debug'
  | 'reset';

export interface EconomyChange {
  readonly total: number;
  readonly delta: number;
  readonly reason: EconomyReason;
}

/** Результат покупки: причина важна для текста в магазине. */
export interface PurchaseResult {
  readonly ok: boolean;
  readonly cost: number;
  readonly reason: 'ok' | 'money' | 'max' | 'free' | 'none';
}

export interface EconomySaveState {
  readonly money: number;
  readonly upgrades: Readonly<Record<string, number>>;
  readonly earned?: number;
  readonly spent?: number;
}

export interface EconomySystemOptions {
  readonly config: EconomyConfig;
  readonly onChanged?: (change: EconomyChange) => void;
  /** Покраска выполнена: app сбрасывает розыск. */
  readonly onPaintReset?: () => void;
  /** Патроны выдаются: app пополняет боезапас (после списания денег). */
  readonly onRefill?: () => void;
  /** Есть ли что пополнять; false — покупка не нужна. */
  readonly onAmmoNeeded?: () => boolean;
}

const NO_UPGRADES: Readonly<Record<UpgradeId, number>> = { contacts: 0, garage: 0, insurance: 0 };

export class EconomySystem {
  private readonly config: EconomyConfig;
  private readonly onChanged: ((change: EconomyChange) => void) | null;
  private readonly onPaintReset: (() => void) | null;
  private readonly onRefill: (() => void) | null;
  private readonly onAmmoNeeded: (() => boolean) | null;
  private readonly levels: Record<UpgradeId, number> = { ...NO_UPGRADES };
  private moneyValue: number;
  private earnedValue = 0;
  private spentValue = 0;

  constructor(options: EconomySystemOptions) {
    this.config = options.config;
    this.onChanged = options.onChanged ?? null;
    this.onPaintReset = options.onPaintReset ?? null;
    this.onRefill = options.onRefill ?? null;
    this.onAmmoNeeded = options.onAmmoNeeded ?? null;
    this.moneyValue = options.config.startMoney;
  }

  get money(): number {
    return this.moneyValue;
  }

  get earned(): number {
    return this.earnedValue;
  }

  get spent(): number {
    return this.spentValue;
  }

  get upgrades(): Readonly<Record<UpgradeId, number>> {
    return this.levels;
  }

  /** +доля к награде за миссии от апгрейда «Связи». */
  get rewardMultiplier(): number {
    return 1 + this.bonusSum('rewardBonus');
  }

  /** Доля скидки на сервис от апгрейда «Свой гараж». */
  get serviceDiscount(): number {
    return Math.min(0.6, this.bonusSum('serviceDiscount'));
  }

  /** На сколько звёзд меньше при провале заказа. */
  get heatRelief(): number {
    return this.bonusSum('heatRelief');
  }

  add(amount: number, reason: EconomyReason): void {
    if (!(amount > 0)) return;
    const before = this.moneyValue;
    this.moneyValue = Math.min(this.config.maxMoney, this.moneyValue + Math.round(amount));
    const delta = this.moneyValue - before;
    if (delta !== 0) this.earnedValue += delta;
    this.emit(delta, reason);
  }

  /** Списать сумму. false — денег не хватило (баланс не меняется). */
  spend(amount: number, reason: EconomyReason): boolean {
    const cost = Math.round(amount);
    if (cost <= 0) return true;
    if (this.moneyValue < cost) return false;
    this.moneyValue -= cost;
    this.spentValue += cost;
    this.emit(-cost, reason);
    return true;
  }

  /** Цена ремонта конкретной машины с учётом скидки гаража. */
  repairCost(state: VehicleState | null): number {
    if (!state) return 0;
    const missing = state.maxHp - state.hp;
    if (missing <= 0 && !state.wrecked) return 0;
    const base = missing * this.config.repair.perHp + (state.wrecked ? this.config.repair.wreckSurcharge : 0);
    const discounted = base * (1 - this.serviceDiscount);
    return Math.max(this.config.repair.minCost, Math.round(discounted));
  }

  repair(state: VehicleState | null): PurchaseResult {
    if (!state) return { ok: false, cost: 0, reason: 'none' };
    const cost = this.repairCost(state);
    if (cost <= 0) return { ok: false, cost: 0, reason: 'free' };
    if (!this.spend(cost, 'repair')) return { ok: false, cost, reason: 'money' };
    repairVehicleFull(state);
    return { ok: true, cost, reason: 'ok' };
  }

  get paintCost(): number {
    return Math.max(0, Math.round(this.config.paintCost * (1 - this.serviceDiscount)));
  }

  paint(): PurchaseResult {
    const cost = this.paintCost;
    if (!this.spend(cost, 'paint')) return { ok: false, cost, reason: 'money' };
    if (this.onPaintReset) this.onPaintReset();
    return { ok: true, cost, reason: 'ok' };
  }

  get ammoCost(): number {
    return this.config.ammoCost;
  }

  /**
   * Патроны: сначала проверка «нужно ли», затем деньги, затем списание,
   * и только потом выдача (BUG-M6-007 — не бесплатные патроны).
   */
  buyAmmo(): PurchaseResult {
    if (!this.onRefill) return { ok: false, cost: 0, reason: 'none' };
    if (this.onAmmoNeeded && !this.onAmmoNeeded()) return { ok: false, cost: 0, reason: 'free' };
    const cost = this.ammoCost;
    if (this.moneyValue < cost) return { ok: false, cost, reason: 'money' };
    if (!this.spend(cost, 'ammo')) return { ok: false, cost, reason: 'money' };
    this.onRefill();
    return { ok: true, cost, reason: 'ok' };
  }

  level(id: UpgradeId): number {
    return this.levels[id];
  }

  upgradeDef(id: UpgradeId): UpgradeDef {
    for (let i = 0; i < this.config.upgrades.length; i += 1) {
      if (this.config.upgrades[i].id === id) return this.config.upgrades[i];
    }
    return this.config.upgrades[0];
  }

  /** Цена следующего уровня или null, если куплен максимум. */
  upgradeCost(id: UpgradeId): number | null {
    const def = this.upgradeDef(id);
    const level = this.levels[id];
    if (level >= def.maxLevel) return null;
    return def.baseCost + def.costStep * level;
  }

  buyUpgrade(id: UpgradeId): PurchaseResult {
    const def = this.upgradeDef(id);
    const level = this.levels[id];
    if (level >= def.maxLevel) return { ok: false, cost: 0, reason: 'max' };
    const cost = def.baseCost + def.costStep * level;
    if (!this.spend(cost, 'upgrade')) return { ok: false, cost, reason: 'money' };
    this.levels[id] = level + 1;
    return { ok: true, cost, reason: 'ok' };
  }

  toSave(): EconomySaveState {
    return {
      money: this.moneyValue,
      upgrades: { ...this.levels },
      earned: this.earnedValue,
      spent: this.spentValue,
    };
  }

  restore(state: EconomySaveState): void {
    this.moneyValue = Number.isFinite(state.money)
      ? Math.max(0, Math.min(this.config.maxMoney, state.money))
      : this.config.startMoney;
    for (const def of this.config.upgrades) {
      const raw = state.upgrades[def.id];
      const level = Number.isFinite(raw) ? Math.round(raw) : 0;
      this.levels[def.id] = Math.max(0, Math.min(def.maxLevel, level));
    }
    this.earnedValue = Number.isFinite(state.earned) ? Math.max(0, state.earned ?? 0) : 0;
    this.spentValue = Number.isFinite(state.spent) ? Math.max(0, state.spent ?? 0) : 0;
  }

  reset(): void {
    this.moneyValue = this.config.startMoney;
    this.levels.contacts = 0;
    this.levels.garage = 0;
    this.levels.insurance = 0;
    this.earnedValue = 0;
    this.spentValue = 0;
    this.emit(0, 'reset');
  }

  private bonusSum(field: 'rewardBonus' | 'serviceDiscount' | 'heatRelief'): number {
    let sum = 0;
    for (let i = 0; i < this.config.upgrades.length; i += 1) {
      const def = this.config.upgrades[i];
      const value = def[field];
      if (value === undefined) continue;
      sum += value * this.levels[def.id];
    }
    return sum;
  }

  private emit(delta: number, reason: EconomyReason): void {
    if (!this.onChanged) return;
    this.onChanged({ total: this.moneyValue, delta, reason });
  }
}
