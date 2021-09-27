export interface Depth {
    bids: DepthOrder[];
    asks: DepthOrder[];
}

export interface DepthOrder {
    price: number;
    qty: number;
}

export type DepthHandler = (depth: Depth) => void;
