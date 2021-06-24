import { Candle } from './candle';
import { DebutCore } from './debut';
import { ExecutedOrder, OrderOptions } from './order';
import { TimeFrame } from './common';
export interface PluginDriverInterface {
    register(plugins: PluginInterface[]): void;
    getPublicAPI(): unknown;
    syncReduce<T extends SyncHooks>(hookName: T, ...args: Parameters<HookToArgumentsMap[T]>);
    asyncSkipReduce<T extends SkippingHooks>(hookName: T, ...args: Parameters<HookToArgumentsMap[T]>);
    asyncReduce<T extends AsyncHooks>(hookName: T, ...args: Parameters<HookToArgumentsMap[T]>): Promise<void>;
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
    onTick = 'onTick',
    onCandle = 'onCandle',
    onAfterCandle = 'onAfterCandle',
    onInit = 'onInit',
    onStart = 'onStart',
    onDispose = 'onDispose',
    // Enterprise only
    onMajorCandle = 'onMajorCandle',
}

/**
 * Hooks with skip operation support
 */
export type SkippingHooks = PluginHook.onTick | PluginHook.onBeforeOpen | PluginHook.onBeforeClose;

/**
 * Synchronious hooks
 */
export type SyncHooks = PluginHook.onInit;

/**
 * Asynchronious hooks
 */
export type AsyncHooks =
    | PluginHook.onCandle
    | PluginHook.onAfterCandle
    | PluginHook.onClose
    | PluginHook.onDispose
    | PluginHook.onOpen
    | PluginHook.onStart;

/**
 * Map hook to typed function
 */
export type HookToArgumentsMap = {
    [PluginHook.onInit]: (this: PluginCtx) => void;
    [PluginHook.onStart]: (this: PluginCtx) => Promise<void>;
    [PluginHook.onDispose]: (this: PluginCtx) => Promise<void>;
    [PluginHook.onBeforeClose]: (
        this: PluginCtx,
        order: OrderOptions,
        closing: ExecutedOrder,
    ) => Promise<boolean | void>;
    [PluginHook.onBeforeOpen]: (this: PluginCtx, order: OrderOptions) => Promise<boolean | void>;
    [PluginHook.onOpen]: (this: PluginCtx, order: ExecutedOrder) => Promise<void>;
    [PluginHook.onClose]: (this: PluginCtx, order: ExecutedOrder, closing: ExecutedOrder) => Promise<void>;
    [PluginHook.onCandle]: (this: PluginCtx, candle: Candle) => Promise<void>;
    [PluginHook.onAfterCandle]: (this: PluginCtx, candle: Candle) => Promise<void>;
    [PluginHook.onTick]: (this: PluginCtx, tick: Candle) => Promise<boolean | void>;
    // Enterprise only
    [PluginHook.onMajorCandle]: (this: PluginCtx, candle: Candle, timeframe: TimeFrame) => Promise<void>;
};

/**
 * Interface for plugin, should be implemented
 */
export interface PluginInterface {
    name: string;
    api?: unknown;
    [PluginHook.onInit]?: HookToArgumentsMap[PluginHook.onInit];
    [PluginHook.onStart]?: HookToArgumentsMap[PluginHook.onStart];
    [PluginHook.onDispose]?: HookToArgumentsMap[PluginHook.onDispose];
    [PluginHook.onBeforeClose]?: HookToArgumentsMap[PluginHook.onBeforeClose];
    [PluginHook.onBeforeOpen]?: HookToArgumentsMap[PluginHook.onBeforeOpen];
    [PluginHook.onOpen]?: HookToArgumentsMap[PluginHook.onOpen];
    [PluginHook.onClose]?: HookToArgumentsMap[PluginHook.onClose];
    [PluginHook.onCandle]?: HookToArgumentsMap[PluginHook.onCandle];
    [PluginHook.onAfterCandle]?: HookToArgumentsMap[PluginHook.onAfterCandle];
    [PluginHook.onTick]?: HookToArgumentsMap[PluginHook.onTick];
    // Enterprise only
    [PluginHook.onMajorCandle]?: HookToArgumentsMap[PluginHook.onMajorCandle];
}

/**
 * Runtime context for working plugin
 */
export interface PluginCtx {
    findPlugin<T extends PluginInterface>(name: string): T;
    debut: DebutCore;
}
