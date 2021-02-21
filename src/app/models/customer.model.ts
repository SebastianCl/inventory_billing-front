export interface ICustomer {
    id?: string;
    name: string;
    identification: string;
    email: string;

    telephone1: string;
    telephone2: string;
    telephone3: string;
    direction: string;
}

export class Customer implements ICustomer {
    id?: string;
    name: string;
    identification: string;
    email: string;

    telephone1: string;
    telephone2: string;
    telephone3: string;
    direction: string;

    constructor() {
        this.name = '';
        this.identification = '';
        this.email = '';
        this.telephone1 = '';
        this.telephone2 = '';
        this.telephone3 = '';
        this.direction = '';
    }
}
