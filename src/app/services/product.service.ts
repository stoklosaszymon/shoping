import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, Subject } from 'rxjs';
import { ICategory, INewList, INewListRequest, Product } from '../models/product';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(private apiService: ApiService) { }

    private productSource = new Subject<Product>();  
    private categorySource = new Subject<string>();  
    currentProduct = this.productSource.asObservable();
    currentCategory = this.categorySource.asObservable();
  
    selectProduct(product: Product) {
      this.productSource.next(product); 
    }

    selectCategory(category: string) {
      this.categorySource.next(category); 
    }

    getProducts(category: string = ''): Observable<Product[]> {
        let url = 'products'
        url = category.length != 0 ? `${url}?category=${category}` : url;
        return this.apiService.get<any[]>(url);
    }

    getCategories(): Observable<any> {
        return this.apiService.get<any[]>('categories')
    }

    getLists(): Observable<any> {
        return this.apiService.get<any[]>('lists')
    }

    getList(id: number): Observable<any> {
        return this.apiService.get<any[]>(`lists/${id}`)
    }

    addNewList(newList: INewListRequest): Observable<any> {
        return this.apiService.post<any[]>(`lists/new`, newList)
    }
}