import { Candle } from './candle';
import { TimeFrame, WorkingEnv } from './common';
import { GeneticSchema } from './genetic';
import { ExecutedOrder, OrderType } from './order';
import { PluginInterface } from './plugin';
import { BaseTransport, Instrument } from './transport';

export interface DebutCore {
    orders: ExecutedOrder[];
    dispose: () => void;
    instrument: Instrument;
    transport: BaseTransport;
    opts: DebutOptions;
    readonly prevCandle: Candle;
    readonly currentCandle: Candle;
    registerPlugins(plugins: PluginInterface[]): void;
    start(): Promise<() => void>;
    getName(): string;
    closeAll(): Promise<ExecutedOrder[]>;
    createOrder(operation: OrderType): Promise<ExecutedOrder>;
    closeOrder(closing: ExecutedOrder): Promise<ExecutedOrder>;
    learn(days: number): Promise<void>;
}

export interface DebutOptions {
    broker: 'tinkoff' | 'binance'; // Тип брокера
    ticker: string; // Тикер
    currency: string; // Валюта
    interval: TimeFrame; // Временной интервал
    amount: number; // Сумма для работы стратегии
    fee?: number; // Налог за операцию в дробях
    id?: number; // Ид конфигурации
    sandbox?: boolean; // Активен ли режим песочницы или торговля на реальные деньги
    margin?: boolean; // Разрешена ли торговля в шорт
    lotsMultiplier?: number; // Множитель лотности, например если нужно сделать х2 или х3 закупку, по умолчанию 1
    equityLevel?: number; // Склько доступно от общего депозита для текущей стратегии
}

export interface DebutMeta {
    parameters: GeneticSchema;
    score: (bot: DebutCore) => number;
    validate: (cfg: DebutOptions) => false | DebutOptions;
    stats: (bot: DebutCore) => unknown;
    create: (transport: BaseTransport, cfg: DebutOptions, env: WorkingEnv) => Promise<DebutCore>;
    ticksFilter?: (solution: DebutOptions) => (tick: Candle) => boolean;
    testPlugins?: (cfg: DebutOptions) => PluginInterface[];
    geneticPlugins?: (cfg: DebutOptions) => PluginInterface[];
}
