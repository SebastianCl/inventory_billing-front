export interface IReserve {
    id?: string;
    customerName: string;
    customerID: string;
    employeeName: string; 
    reserveDate: string;
    startDate: string;
    endDate: string;
    vendor: string;
    tax: number;
    shipping?: number;
    comments?: string;
    articles: Array<Object[]>;
    total: number;
    subtotal: number;
    totalTax: number;
    totalDiscount: number;
}

export class Reserve implements IReserve {
    id?: string;
    customerName: string;
    customerID: string;
    employeeName: string;
    reserveDate: string; 
    startDate: string;
    endDate: string;
    vendor: string;
    tax: number;
    shipping?: number;
    comments?: string;
    articles: Array<Object[]>;
    total: number;
    subtotal: number;
    totalTax: number;
    totalDiscount: number;

    constructor() {
        this.customerName = '';
        this.customerID = '';
        this.employeeName = '';
        this.reserveDate = '';
        this.startDate = '';
        this.endDate = '';
        this.vendor = '';
        this.tax = 0;
        this.articles = [];
        this.total = 0;
        this.subtotal = 0;
        this.totalTax = 0;
        this.totalDiscount = 0;
    }
}
