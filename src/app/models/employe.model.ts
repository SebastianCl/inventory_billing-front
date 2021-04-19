export interface IEmploye {
    id?: string;
    name: string;
    identification: number;
    direction: string;
    email: string;
    password: string;
    telephone: number;
    active: boolean;
}

export class Employe implements IEmploye {
    id?: string;
    name: string;
    identification: number;
    direction: string;
    email: string;
    password: string;
    telephone: number;
    active: boolean;

    constructor() {
        this.name = '';
        this.identification = 0;
        this.direction = '';
        this.email = '';
        this.password = '';
        this.telephone = 0;
        this.active = false;
    }
}
