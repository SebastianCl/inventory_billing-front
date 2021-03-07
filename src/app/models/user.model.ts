export interface IUser {
    id?: string;
    name: string;
    identification: string;
    direction: string;
    telephone: string;
    email: string;
    password: string;
    isAdmin: boolean;
    active: boolean;
}

export class User implements IUser {
    id?: string;
    name: string;
    identification: string;
    direction: string;
    telephone: string;
    email: string;
    password: string;
    isAdmin: boolean;
    active: boolean;

    constructor() {
        this.name = '';
        this.identification = '';
        this.direction = '';
        this.telephone = '';
        this.email = '';
        this.password = '';
        this.isAdmin = false;
        this.active = true;
    }
}
