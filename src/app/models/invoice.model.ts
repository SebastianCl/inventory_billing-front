export interface IInvoice {
    id?: string;
    active: boolean;
    reserve: number;
	customer: number;
    employee: number;
    cost: number;
    deposit: number;
    description: string;
}

export class Invoice implements IInvoice {
    id?: string;
    active: boolean;
    reserve: number;
	customer: number;
    employee: number;
    cost: number;
    deposit: number;
    description: string;

    constructor() {
        this.active = false;
        this.reserve = 0;
        this.customer = 0;
        this.employee = 0;
        this.cost = 0;
        this.deposit = 0;
        this.description = '';
    }
}
