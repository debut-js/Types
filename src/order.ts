/**
 * Type of order for placing
 */
export const enum OrderType {
    'BUY' = 'BUY',
    'SELL' = 'SELL',
}

/** Common order interface for any order type definition */
export interface BaseOrder {
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
    openId?: string | number;
    // Sandbox marker
    sandbox?: boolean;
    // Learning marker, mean order created in learning phase
    learning?: boolean;
    // Retries count of network requests
    retries?: number;
    // Number from 0 to 1 to reduce existing order
    reduce?: number;
    // Transaction for orders opening or close (does not implemented, is staging now)
    transaction?: Array<string | number>;
}

/**
 * Pending order data
 */
export interface PendingOrder extends BaseOrder {
    // Error code
    error?: number; // TODO: implement error codes
}

/**
 * Executed order data
 */
export interface ExecutedOrder extends PendingOrder {
    // Placed order identifier from server
    orderId: string;
    // How many lots are filled. May be not equal with lots field if order have partial fill
    executedLots: number;
    // Fees size
    commission: { currency: string; value: number };
}
