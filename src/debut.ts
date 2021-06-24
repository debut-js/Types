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
}

export interface DebutBinanceOptions extends DebutOptions {
    broker: 'binance';
    margin?: boolean; // Spot or cross margin
    futures?: boolean; // Cross futures [beta]
}

export interface DebutAlpacaOptions extends DebutOptions {
    broker: 'alpaca';
}

export interface DebutTinkoffOptions extends DebutOptions {
    broker: 'tinkoff';
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
