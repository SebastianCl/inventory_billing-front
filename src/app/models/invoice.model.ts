export interface IInvoice {
    id?: string;
    reserve: number;
    cost: number;
    deposit: number;
    payment: number;
    description: string;
    depositState: boolean;
}

export interface IInvoiceDano {
    cost: number;
    customerName: string;
    customerIdentification: string;
    employeeName: string;
    description: string;
}

export interface IInvoiceVenta {
    cost: number;
    customerName: string;
    customerIdentification: string;
    employeeName: string;
    description: string;
    articles: Array<Object[]>;
}

export class Invoice implements IInvoice {
    id?: string;
    reserve: number;
    subTotal: number;
    cost: number;
    deposit: number;
    payment: number;
    description: string;
    depositState: boolean;

    constructor() {
        this.reserve = 0;
        this.subTotal = 0;
        this.cost = 0;
        this.deposit = 0;
        this.payment = 0;
        this.description = '';
        this.depositState = false;
    }
}

export class InvoiceDano implements IInvoiceDano {
    cost: number;
    customerName: string;
    customerIdentification: string;
    employeeName: string;
    description: string;

    constructor() {
        this.cost = 0;
        this.customerName = '';
        this.customerIdentification = '';
        this.employeeName = '';
        this.description = '';
    }
}

export class InvoiceVenta implements IInvoiceVenta {
    cost: number;
    customerName: string;
    customerIdentification: string;
    employeeName: string;
    description: string;
    articles: Array<Object[]>;

    constructor() {
        this.cost = 0;
        this.customerName = '';
        this.customerIdentification = '';
        this.employeeName = '';
        this.description = '';
        this.articles = [];
    }
}
