export interface IUser {
    id?: string;
    name: string;
    description?: string;
    email: string;
    password: string;
    roleId: string,
    active: boolean;
}

export class User implements IUser {
    id?: string;
    name: string;
    description?: string;
    direction: string;
    telephone: string;
    email: string;
    password: string;
    roleId: string;
    active: boolean;

    constructor() {
        this.name = '';
        this.description = '';
        this.direction = '';
        this.telephone = '';
        this.email = '';
        this.password = '';
        this.roleId = '';
        this.active = true;
    }
}
