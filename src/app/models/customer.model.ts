export interface ICustomer {
    id?: string;
    firstname: string;
    lastname: string;
    email: string;

    company: string;
    telephone: string;
    taxFree: boolean;
    taxExempt: string;
}

export class Customer implements ICustomer {
    id?: string;
    firstname: string;
    lastname: string;
    email: string;

    company: string;
    telephone: string;
    taxFree: boolean;
    taxExempt: string;


    constructor() {
        this.firstname = '';
        this.lastname = '';
        this.email = '';

        this.company = '';
        this.telephone = '';
        this.taxFree = false;
        this.taxExempt = '';
    }
}
