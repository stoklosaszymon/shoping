export interface Product {
    id: number
    name: string
    product_category_id: number
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
    product_ids: number[]
}

export interface INewListRequest {
    list: INewList
}