export interface ISession {
  id?: string;
  email: string;
  password: string;
}

export class Session implements ISession {
  email: string;
  password: string;

  constructor() {
    this.email = '';
    this.password = '';
  }
}
