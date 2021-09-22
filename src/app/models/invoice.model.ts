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
    customerID: number;
    employeeID: number;
    description: string;
}

export interface IInvoiceVenta {
    cost: number;
    customerID: number;
    employeeID: number;
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
    customerID: number;
    employeeID: number;
    description: string;

    constructor() {
        this.cost = 0;
        this.customerID = 0;
        this.employeeID = 0;
        this.description = '';
    }
}

export class InvoiceVenta implements IInvoiceVenta {
    cost: number;
    customerID: number;
    employeeID: number;
    description: string;
    articles: Array<Object[]>;

    constructor() {
        this.cost = 0;
        this.customerID = 0;
        this.employeeID = 0;
        this.description = '';
        this.articles = [];
    }
}
