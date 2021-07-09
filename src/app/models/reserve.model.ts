export interface IReserve {
    id?: string;
    customerID: number;
    employeeID: number; 
    startDate: string;
    endDate: string;
    description?: string;
    articles: Array<Object[]>;
}

export interface IEditReserve {
    endDate: string;
    description?: string;
    articles: Array<Object[]>;
}

export class Reserve implements IReserve {
    id?: string;
    customerID: number;
    employeeID: number; 
    startDate: string;
    endDate: string;
    description?: string;
    articles: Array<Object[]>;

    constructor() {
        this.customerID = 0;
        this.employeeID = 0;
        this.startDate = '';
        this.endDate = '';
        this.description = '';
        this.articles = [];
    }
}

export class EditReserve implements IEditReserve {
    endDate: string;
    description?: string;
    articles: Array<Object[]>;

    constructor() {
        this.endDate = '';
        this.description = '';
        this.articles = [];
    }

}

