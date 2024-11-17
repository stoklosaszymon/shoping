export interface Product {
    id: number
    name: string
    status: string
    product_category_id: number
    unit: string 
    quantity: number
}

export interface ICategory extends Product {
}


export interface IList extends Product {
}

export interface ProductList {
    name: string
    products: Product[]
}

export interface INewList {
    name: string
    products: IProductRequest[]
}

export interface INewListRequest {
    list: INewList
}

export interface IProductRequest {
    id: number
    quantity: number
    status: string
}