import { Candle } from './candle';
import { DebutCore } from './debut';
import { ExecutedOrder, PendingOrder } from './order';
import { TimeFrame } from './common';
import { Depth } from './orderbook';

export interface PluginDriverInterface {
    register(plugins: PluginInterface[]): void;
    getPublicAPI(): unknown;
    skipReduce<T extends SkippingHooks>(hookName: T, ...args: Parameters<SkipHookArgumentsMap[T]>): boolean | void;
    asyncReduce<T extends AsyncHooks>(hookName: T, ...args: Parameters<AsyncHookArgumentsMap[T]>): Promise<void>;
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
    // Enterprise only
    onMajorCandle = 'onMajorCandle',
}

/**
 * Hooks with skip operation support
 */
export type SkippingHooks = PluginHook.onBeforeTick | PluginHook.onBeforeOpen | PluginHook.onBeforeClose;

/**
 * Synchronious hooks
 */
export type SyncHooks = PluginHook.onInit;

/**
 * Asynchronious hooks
 */
export type AsyncHooks =
    | PluginHook.onTick
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
};

export type SkipHookArgumentsMap = {
    [PluginHook.onBeforeClose]: (this: PluginCtx, order: PendingOrder, closing: ExecutedOrder) => boolean | void;
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
};

/**
 * Interface for plugin, should be implemented
 */
export interface PluginInterface {
    name: string;
    api?: unknown;
    [PluginHook.onInit]?: SyncHookArgumentsMap[PluginHook.onInit];
    [PluginHook.onStart]?: AsyncHookArgumentsMap[PluginHook.onStart];
    [PluginHook.onDispose]?: AsyncHookArgumentsMap[PluginHook.onDispose];
    [PluginHook.onBeforeClose]?: SkipHookArgumentsMap[PluginHook.onBeforeClose];
    [PluginHook.onBeforeOpen]?: SkipHookArgumentsMap[PluginHook.onBeforeOpen];
    [PluginHook.onOpen]?: AsyncHookArgumentsMap[PluginHook.onOpen];
    [PluginHook.onClose]?: AsyncHookArgumentsMap[PluginHook.onClose];
    [PluginHook.onCandle]?: AsyncHookArgumentsMap[PluginHook.onCandle];
    [PluginHook.onAfterCandle]?: AsyncHookArgumentsMap[PluginHook.onAfterCandle];
    [PluginHook.onBeforeTick]?: SkipHookArgumentsMap[PluginHook.onBeforeTick];
    [PluginHook.onTick]?: AsyncHookArgumentsMap[PluginHook.onTick];
    // Enterprise only
    [PluginHook.onMajorCandle]?: AsyncHookArgumentsMap[PluginHook.onMajorCandle];
}

/**
 * Runtime context for working plugin
 */
export interface PluginCtx {
    findPlugin<T extends PluginInterface>(name: string): T;
    debut: DebutCore;
}
