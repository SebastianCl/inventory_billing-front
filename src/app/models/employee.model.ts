export interface IEmployee {
    id?: string;
    name: string;
    identification: number;
    direction: string;
    email: string;
    telephone: number;
    active: boolean;
}

export class Employee implements IEmployee {
    id?: string;
    name: string;
    identification: number;
    direction: string;
    email: string;
    telephone: number;
    active: boolean;

    constructor() {
        this.name = '';
        this.identification = 0;
        this.direction = '';
        this.email = '';
        this.telephone = 0;
        this.active = false;
    }
}
