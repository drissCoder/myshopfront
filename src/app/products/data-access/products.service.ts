import { Injectable, inject, signal } from "@angular/core";
import { Product } from "./product.model";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private readonly http = inject(HttpClient);

  // Set the base URL for the Spring Boot backend
  private readonly apiUrl = "http://localhost:8009/api/products"; // Updated base URL
  private readonly _products = signal<Product[]>([]);

  public readonly products = this._products.asReadonly();

  // GET: Fetch products from the Spring Boot backend
  public get(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError((error) => {
        // Fallback to static products when an error occurs
        return this.http.get<Product[]>("assets/products.json");
      }),
      tap((products) => this._products.set(products))
    );
  }

  // POST: Create a new product
  public create(product: Product): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, product).pipe(
      catchError(() => {
        return of(false); // Return false in case of an error
      }),
      tap(() => this._products.update((products) => [product, ...products]))
    );
  }

  // PATCH: Update a specific product
  public update(product: Product): Observable<boolean> {
    return this.http.patch<boolean>(`${this.apiUrl}/${product.id}`, product).pipe(
      catchError(() => {
        return of(false); // Return false in case of an error
      }),
      tap(() => this._products.update((products) => products.map(p => p.id === product.id ? product : p)))
    );
  }

  // DELETE: Remove a product
  public delete(productId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${productId}`).pipe(
      catchError(() => {
        return of(false); // Return false in case of an error
      }),
      tap(() => this._products.update((products) => products.filter(product => product.id !== productId)))
    );
  }
}