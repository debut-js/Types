import { InstrumentType } from './transport';
export interface Depth {
    bids: DepthOrder[];
    asks: DepthOrder[];
}

export interface DepthOrder {
    price: number;
    qty: number;
}

export interface DepthOptions {
    ticker: string;
    instrumentType?: InstrumentType;
}

export type DepthHandler = (depth: Depth) => void;
