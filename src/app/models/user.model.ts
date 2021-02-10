export interface IUser {
    id?: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    active: boolean;
}

export class User implements IUser {
    id?: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    active: boolean;

    constructor() {
        this.firstname = '';
        this.lastname = '';
        this.email = '';
        this.password = '';
        this.active = true;
    }
}
