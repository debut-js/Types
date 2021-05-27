import { Candle } from './candle';
import { WorkingEnv } from './common';
import { DebutCore, DebutOptions } from './debut';
import { BaseTransport } from './transport';

export type GeneticStats = {
    population: number;
    maximum: number;
    minimum: number;
    mean: number;
    stdev: number;
};

export type ConfigValidator = (cfg: DebutOptions) => DebutOptions | false;

export interface GenticWrapperOptions {
    score: (bot: DebutCore) => number;
    stats: (bot: DebutCore) => unknown;
    create: (transport: BaseTransport, solution: DebutOptions, environment: WorkingEnv) => Promise<DebutCore>;
    generations: number;
    log?: boolean;
    populationSize?: number;
    days: number;
    ohlc?: boolean;
    useTicks?: boolean; // Enterprise only
    gapDays?: number;
    validateSchema: ConfigValidator;
    ticksFilter?: (solution: DebutOptions) => (tick: Candle) => boolean;
    best?: number;
}

export interface SchemaDescriptor {
    min: number; // начальное значение
    max: number; // конечное значеие
    int?: boolean; // целочисленное
    bool?: boolean; // булево
    odd?: boolean; // Нечетное
}

export type GeneticSchema<T = any> = {
    [K in keyof Partial<T>]: SchemaDescriptor;
};
