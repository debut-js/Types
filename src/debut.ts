import { Candle } from './candle';
import { TimeFrame, WorkingEnv } from './common';
import { GeneticSchema, ConfigValidator, StatsValidator } from './genetic';
import { ExecutedOrder, OrderType, PendingOrder } from './order';
import { PluginInterface } from './plugin';
import { BaseTransport, Instrument, InstrumentType } from './transport';

export interface DebutCore {
    readonly prevCandle: Candle;
    readonly currentCandle: Candle;
    readonly ordersCount: number;
    id: string;
    orders: Array<PendingOrder | ExecutedOrder>;
    dispose: () => Promise<void>;
    instrument: Instrument;
    transport: BaseTransport;
    opts: DebutOptions;
    registerPlugins(plugins: PluginInterface[]): void;
    start(): Promise<() => void>;
    getName(): string;
    closeAll(collapse?: boolean, filter?: (order: ExecutedOrder | PendingOrder) => boolean): Promise<ExecutedOrder[]>;
    createOrder(operation: OrderType): Promise<ExecutedOrder>;
    closeOrder(closing: ExecutedOrder | PendingOrder): Promise<ExecutedOrder>;
    reduceOrder(closing: ExecutedOrder | PendingOrder, reduce: number): Promise<ExecutedOrder>;
    learn(days: number): Promise<void>;
}

export interface DebutOptions {
    broker: 'tinkoff' | 'binance' | 'alpaca';
    ticker: string;
    currency: string;
    interval: TimeFrame;
    amount: number;
    fee?: number;
    id?: number;
    sandbox?: boolean;
    lotsMultiplier?: number;
    equityLevel?: number;
    // Use Different instruments e.g. futures, cfd, spot, if possible
    instrumentType?: InstrumentType;
}

export interface DebutMeta {
    parameters: GeneticSchema;
    score: (bot: DebutCore) => number;
    stats: (bot: DebutCore) => unknown;
    create: (transport: BaseTransport, cfg: DebutOptions, env: WorkingEnv) => Promise<DebutCore>;
    validate?: ConfigValidator;
    validateStats?: StatsValidator;
    ticksFilter?: (solution: DebutOptions) => (tick: Candle) => boolean;
    testPlugins?: (cfg: DebutOptions) => PluginInterface[];
    geneticPlugins?: (cfg: DebutOptions) => PluginInterface[];
}

export interface DebutSnapshotData {
    orders: Array<ExecutedOrder>;
    opts: DebutOptions;
    pluginsData: Record<string, Record<string, unknown>>;
}
