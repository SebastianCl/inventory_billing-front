export interface IQuote {
    id?: string;
    customer: string;
    vendor: string;
    tax: number;
    shipping?: number;
    comments?: string;
    items: Array<Object[]>;
    isCO: boolean;
    total: number;
    subtotal: number;
    totalTax: number;
    totalDiscount: number;
}

export class Quote implements IQuote {
    id?: string;
    customer: string;
    vendor: string;
    tax: number;
    shipping?: number;
    comments?: string;
    items: Array<Object[]>;
    isCO: boolean;
    total: number;
    subtotal: number;
    totalTax: number;
    totalDiscount: number;

    constructor() {
        this.customer = '';
        this.vendor = '';
        this.tax = 0;
        this.items = [];
        this.isCO = false;
        this.total = 0;
        this.subtotal = 0;
        this.totalTax = 0;
        this.totalDiscount = 0;
    }
}
