export interface IInvoice {
    id?: string;
    invoiceNumber: string;
    active: boolean;
}

export class Invoice implements IInvoice {
    id?: string;
    invoiceNumber: string;
    active: boolean;

    constructor() {
        this.invoiceNumber = '';
        this.active = false;
    }
}
