export interface IArticle {
    id?: string;
    type: string;
    reference: string;
    brand: string;
    color: string;
    size: string;
    comments?: string;
    price: number;
    quantity: number;
    available: boolean;
    image?: string;
}

export class Article implements IArticle {
    id?: string;
    type: string;
    reference: string;
    brand: string;
    color: string;
    size: string;
    comments?: string;
    price: number;
    quantity: number;
    available: boolean;
    image?: string;

    constructor() {
        this.type = '';
        this.reference = '';
        this.brand = '';
        this.color = '';
        this.type = '';
        this.size = '';
        this.comments = '';
        this.price = 0;
        this.quantity = 0;
        this.available = false;
        this.image = '';
    }
}
