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
    currentProduct = this.productSource.asObservable();
  
    selectProduct(product: Product) {
      this.productSource.next(product); 
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

    deleteProduct(id: number): Observable<any> {
        return this.apiService.delete<any[]>(`products/${id}`)
    }

    createNewProduct(name: string): Observable<any> {
        return this.apiService.post<any[]>('products', { name: name });
    }

    getList(id: number): Observable<any> {
        return this.apiService.get<any[]>(`lists/${id}`)
    }

    addNewList(newList: INewListRequest): Observable<any> {
        return this.apiService.post<any[]>(`lists/new`, newList)
    }

    removeProductFromList(listId: string, productId: string) {
        return this.apiService.post<any[]>(`lists/remove`, { list_id: listId, product_id: productId })
    }

    updateStatus(listId: string, productId: string) {
        return this.apiService.post<any[]>('lists', { list_id: listId, product_id: productId })
    }

    deleteList(listId: string) {
        return this.apiService.delete<any[]>(`lists/${listId}`);
    }

    updateListName(listId: string, newName: string) {
        return this.apiService.post<any[]>(`lists/update/${listId}`, { new_name: newName })
    }

    updateNewProducts(listId: string, product_ids: number[]) {
        return this.apiService.post<any[]>(`lists/update_products/${listId}`, { product_ids: product_ids })
    }
}