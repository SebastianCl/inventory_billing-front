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
    imageBase64: string;
}

export interface IEditArticle {
    type: string;
    reference: string;
    brand: string;
    color: string;
    size: string;
    comments?: string;
    price: number;
    quantity: number;
    available: boolean;
    imageBase64: String;
}

export interface IValidateArticle {
    articles: Array<Object[]>;
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
    imageBase64: string;

    constructor() {
        this.type = '';
        this.reference = '';
        this.brand = '';
        this.color = '';
        this.size = '';
        this.comments = '';
        this.price = 0;
        this.quantity = 0;
        this.available = false;
        this.imageBase64 = '';
    }
}

export class EditArticle implements IEditArticle {
    type: string;
    reference: string;
    brand: string;
    color: string;
    size: string;
    comments?: string;
    price: number;
    quantity: number;
    available: boolean;
    imageBase64: String;

    constructor() {
        this.type = '';
        this.reference = '';
        this.brand = '';
        this.color = '';
        this.size = '';
        this.comments = '';
        this.price = 0;
        this.quantity = 0;
        this.available = false;
        this.imageBase64 = '';
    }
}

export class ValidateArticle implements IValidateArticle {
    articles: Array<Object[]>;
    constructor() {
        this.articles = [];
    }
}