export interface IItem {
    id?: string;
    quote?: string;
    ref: string
    description: string;
    retail: number;
    discount: number;
    price: number;
    quantity: number
    total: number;
    requested?: boolean;
}

export class Item implements IItem {
    id?: string;
    quote: string;
    ref: string
    description: string;
    retail: number;
    discount: number;
    price: number;
    quantity: number
    total: number;
    requested?: boolean;

    constructor() {
        this.quote = '';
        this.ref = '';
        this.description = '';
        this.retail = 0;
        this.discount = 0;
        this.price = 0;
        this.quantity = 0;
        this.total = 0;
        this.requested = false;
    }
}
