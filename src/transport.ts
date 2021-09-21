import { TickHandler, TimeFrame } from './common';
import { DebutOptions } from './debut';
import { ExecutedOrder, PendingOrder } from './order';
import { DepthOptions, DepthHandler } from './orderbook';

/**
 * Base transport interface for different brokers support
 */
export interface BaseTransport {
    // Add listener to every tick in real market or market emulation
    subscribeToTick(opts: DebutOptions, handler: TickHandler): Promise<() => void>;
    // Place order with customized parameters
    placeOrder(order: PendingOrder, opts: DebutOptions): Promise<ExecutedOrder>;
    // Place sandbox order. Order will be executed locally immediate, without sending to broker
    placeSandboxOrder(order: PendingOrder, opts: DebutOptions): Promise<ExecutedOrder>;
    // Get instrument meta information
    getInstrument(opts: DebutOptions): Promise<Instrument>;
    // Prepare lots for broker
    prepareLots(lots: number, instrumentId: string): number;
    // Subscribe to orderbook
    /** @Beta method for subscribe to orderbook */
    subscribeOrderBook(opts: DepthOptions, handler: DepthHandler): Promise<() => void>;
}

/**
 * Debut trading instrument information
 */
export interface Instrument {
    // Broker instrument ID (if exists)
    figi?: string;
    // Ticker
    ticker: string;
    // Minimal price change (pip size)
    pipSize?: number;
    // One lot size
    lot: number;
    // Number of digits of a lot number
    lotPrecision: number;
    // Instrument type (CFD, FUTURES, SPOT...)
    type: InstrumentType;
    // Debut generated instrument id
    id: string;
}

/**
 * Debut instrument type
 */
export type InstrumentType = 'SPOT' | 'FUTURES';
