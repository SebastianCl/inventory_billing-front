export interface IEmployee {
    id?: string;
    name: string;
    identification: string;
    direction: string;
    email: string;
    telephone: string;
    active: boolean;
}

export class Employee implements IEmployee {
    id?: string;
    name: string;
    identification: string;
    direction: string;
    email: string;
    telephone: string;
    active: boolean;

    constructor() {
        this.name = '';
        this.identification = '';
        this.direction = '';
        this.email = '';
        this.telephone = '';
        this.active = false;
    }
}
