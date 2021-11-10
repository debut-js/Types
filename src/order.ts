import { TimeFrame } from './common';
import { InstrumentType } from './transport';

/**
 * Type of order for placing
 */
export const enum OrderType {
    'BUY' = 'BUY',
    'SELL' = 'SELL',
}

/** Common order interface for any order type definition */
interface BaseOrder {
    // Client identifier
    cid: number;
    // Order type
    type: OrderType;
    // Order owner name
    author: string;
    // Current candle time
    time: number;
    // Requested price
    price: number;
    // Requested lots
    lots: number;
    // Close marker, true when current order is close of previous order
    close?: boolean;
    // Open price (only for close order)
    openPrice?: number;
    // Open order id (only for close order)
    openId?: string;
    // Sandbox marker
    sandbox?: boolean;
    // Learning marker, mean order created in learning phase
    learning?: boolean;
    // Retries count of network requests
    retries?: number;
}

/**
 * Debut order parameters
 */
export interface OrderOptions {
    // Current broker, supported "Binance", "Tinkoff"
    broker: string;
    // Ticker name
    ticker: string;
    // Broker asset id (if exists)
    figi?: string;
    // Currency name
    currency: string;
    // Candle time frame
    interval: TimeFrame;
    // Lots will be multiplied to this value (preferred for martingale systems)
    lotsMultiplier?: number;
    // How many equity you want use from balance. In percent values between 0 and 1, e.g. 0.97 = 97%
    equityLevel?: number;
    // Order Instrument type
    instrumentType: InstrumentType;
    // Retry counts
    retries?: number;
}

/**
 * Pending order data
 */
export interface PendingOrder extends BaseOrder {
    // Error code
    error?: number; // TODO: implement error codes
    // Processing indicator
    processing?: boolean;
}

/**
 * Executed order data
 */
export interface ExecutedOrder extends PendingOrder, OrderOptions {
    // Placed order identifier from server
    orderId: string;
    // How many lots are filled. May be not equal with lots field if order have partial fill
    executedLots: number;
    // Fees size
    commission: { currency: string; value: number };
}
