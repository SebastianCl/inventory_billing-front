export interface IInvoice {
    id?: string;
    reserve: number;
    cost: number;
    deposit: number;
    payment: number;
    description: string;
    depositState: boolean;
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
