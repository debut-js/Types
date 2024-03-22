import { TickHandler } from './common';
import { DebutOptions } from './debut';
import { ExecutedOrder, PendingOrder } from './order';
import { DepthHandler } from './orderbook';

/**
 * Base transport interface for different brokers support
 */
export interface BaseTransport {
    // Add listener to every tick in real market or market emulation
    subscribeToTick(opts: DebutOptions, handler: TickHandler): Promise<() => void>;
    // Place order with customized parameters
    placeOrder(order: PendingOrder, opts: DebutOptions): Promise<ExecutedOrder>;
    // Get instrument meta information
    getInstrument(opts: DebutOptions): Promise<Instrument>;
    // Prepare lots for broker
    prepareLots(lots: number, instrumentId: string): number;
    // Subscribe to orderbook
    /** @Beta method for subscribe to orderbook */
    subscribeOrderBook(opts: DebutOptions, handler: DepthHandler): Promise<() => void>;
}

/**
 * Debut trading instrument information
 */
export interface Instrument {
    // Broker instrument ID (if exists)
    figi?: string;
    // Ticker
    ticker: string;
    // One lot size
    lot: number;
    // Number of digits of a lot number
    lotPrecision: number;
    // Minimal lots quantity per trade
    minQuantity: number;
    // Minimal amount in currency for opening order
    minNotional: number;
    // Instrument type (CFD, FUTURES, SPOT...)
    type: InstrumentType;
    // Debut generated instrument id
    id: string;
}

/**
 * Debut instrument type
 */
export type InstrumentType = 'SPOT' | 'FUTURES' | 'MARGIN' | 'CRYPTO';

export interface TransactionInterface {
    /**
     * @param order - pending order prepared for close closing
     */
    add(order: PendingOrder): Promise<ExecutedOrder>;
    /**
     * @param executeMethod - execute transaction, returns collapsed order for all closed orders
     */
    execute(executeMethod: (order: PendingOrder) => Promise<ExecutedOrder>): Promise<ExecutedOrder[]>;
}
