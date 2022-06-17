import { Candle } from './candle';
import { DebutCore } from './debut';
import { BaseOrder, ExecutedOrder, PendingOrder } from './order';
import { TimeFrame } from './common';
import { Depth } from './orderbook';

export interface PluginDriverInterface {
    register(plugins: PluginInterface[]): void;
    getPublicAPI(): Record<string, unknown>;
    skipReduce<T extends SkippingHooks>(hookName: T, ...args: Parameters<SkipHookArgumentsMap[T]>): boolean | void;
    asyncReduce<T extends AsyncHooks>(hookName: T, ...args: Parameters<AsyncHookArgumentsMap[T]>): Promise<void>;
    reduce<T extends SyncHooks>(hookName: T, ...args: Parameters<SyncHookArgumentsMap[T]>): void;
    getPluginsSnapshot(): Record<string, Record<string, unknown>>;
    restorePluginsSnapshot(pluginsData: Record<string, Record<string, unknown>>): void;
}

/**
 * Base plugin type
 */
export type Plugin = (api: PluginDriverInterface) => void;

/**
 * Plugin hook names
 */
export const enum PluginHook {
    onBeforeOpen = 'onBeforeOpen',
    onOpen = 'onOpen',
    onBeforeClose = 'onBeforeClose',
    onClose = 'onClose',
    onBeforeTick = 'onBeforeTick',
    onTick = 'onTick',
    onCandle = 'onCandle',
    onAfterCandle = 'onAfterCandle',
    onInit = 'onInit',
    onStart = 'onStart',
    onDispose = 'onDispose',
    onDepth = 'onDepth',
    onSnapshot = 'onSnapshot',
    onHydrate = 'onHydrate',
    onOrderUpdated = 'onOrderUpdated',
    // Enterprise only
    onMajorCandle = 'onMajorCandle',
    onMajorTick = 'onMajorTick',
}

/**
 * Hooks with skip operation support
 */
export type SkippingHooks = PluginHook.onBeforeTick | PluginHook.onBeforeOpen | PluginHook.onBeforeClose;

/**
 * Synchronious hooks
 */
export type SyncHooks = PluginHook.onInit | PluginHook.onOrderUpdated;

/**
 * Asynchronious hooks
 */
export type AsyncHooks =
    | PluginHook.onTick
    | PluginHook.onMajorTick
    | PluginHook.onCandle
    | PluginHook.onMajorCandle
    | PluginHook.onAfterCandle
    | PluginHook.onClose
    | PluginHook.onDispose
    | PluginHook.onOpen
    | PluginHook.onStart
    | PluginHook.onDepth;

/**
 * Map hook to typed function
 */
export type SyncHookArgumentsMap = {
    [PluginHook.onInit]: (this: PluginCtx) => void;
    [PluginHook.onSnapshot]: (this: PluginCtx) => Record<string, unknown>;
    [PluginHook.onHydrate]: (this: PluginCtx, data: Record<string, unknown>) => void;
    [PluginHook.onOrderUpdated]: (
        this: PluginCtx,
        order: PendingOrder | ExecutedOrder,
        changes: Partial<BaseOrder>,
    ) => void;
};

export type SkipHookArgumentsMap = {
    [PluginHook.onBeforeClose]: (
        this: PluginCtx,
        order: PendingOrder,
        closing: ExecutedOrder | PendingOrder,
    ) => boolean | void;
    [PluginHook.onBeforeOpen]: (this: PluginCtx, order: PendingOrder) => boolean | void;
    [PluginHook.onBeforeTick]: (this: PluginCtx, tick: Candle) => boolean | void;
};

export type AsyncHookArgumentsMap = {
    [PluginHook.onStart]: (this: PluginCtx) => Promise<void>;
    [PluginHook.onDispose]: (this: PluginCtx) => Promise<void>;
    [PluginHook.onOpen]: (this: PluginCtx, order: ExecutedOrder) => Promise<void>;
    [PluginHook.onClose]: (this: PluginCtx, order: ExecutedOrder, closing: ExecutedOrder) => Promise<void>;
    [PluginHook.onCandle]: (this: PluginCtx, candle: Candle) => Promise<void>;
    [PluginHook.onAfterCandle]: (this: PluginCtx, candle: Candle) => Promise<void>;
    [PluginHook.onTick]: (this: PluginCtx, tick: Candle) => Promise<void>;
    [PluginHook.onDepth]: (this: PluginCtx, candle: Depth) => Promise<void>;
    // Enterprise only
    [PluginHook.onMajorCandle]: (this: PluginCtx, candle: Candle, timeframe: TimeFrame) => Promise<void>;
    [PluginHook.onMajorTick]: (this: PluginCtx, tick: Candle, timeframe: TimeFrame) => Promise<void>;
};

/**
 * Interface for plugin, should be implemented
 */
export interface PluginInterface {
    name: string;
    api?: unknown;
    [PluginHook.onInit]?: SyncHookArgumentsMap[PluginHook.onInit];
    [PluginHook.onSnapshot]?: SyncHookArgumentsMap[PluginHook.onSnapshot];
    [PluginHook.onHydrate]?: SyncHookArgumentsMap[PluginHook.onHydrate];
    [PluginHook.onOrderUpdated]?: SyncHookArgumentsMap[PluginHook.onOrderUpdated];

    [PluginHook.onStart]?: AsyncHookArgumentsMap[PluginHook.onStart];
    [PluginHook.onDispose]?: AsyncHookArgumentsMap[PluginHook.onDispose];
    [PluginHook.onBeforeClose]?: SkipHookArgumentsMap[PluginHook.onBeforeClose];
    [PluginHook.onBeforeOpen]?: SkipHookArgumentsMap[PluginHook.onBeforeOpen];
    [PluginHook.onBeforeTick]?: SkipHookArgumentsMap[PluginHook.onBeforeTick];

    [PluginHook.onOpen]?: AsyncHookArgumentsMap[PluginHook.onOpen];
    [PluginHook.onClose]?: AsyncHookArgumentsMap[PluginHook.onClose];
    [PluginHook.onCandle]?: AsyncHookArgumentsMap[PluginHook.onCandle];
    [PluginHook.onAfterCandle]?: AsyncHookArgumentsMap[PluginHook.onAfterCandle];
    [PluginHook.onTick]?: AsyncHookArgumentsMap[PluginHook.onTick];

    // Enterprise only
    [PluginHook.onMajorCandle]?: AsyncHookArgumentsMap[PluginHook.onMajorCandle];
    [PluginHook.onMajorTick]?: AsyncHookArgumentsMap[PluginHook.onMajorTick];
}

/**
 * Runtime context for working plugin
 */
export interface PluginCtx {
    findPlugin<T extends PluginInterface>(name: string): T;
    debut: DebutCore;
}
