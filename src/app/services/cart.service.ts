import { Injectable, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";

@Injectable({
  providedIn: "root",
})
export class CartService {
  // Cart signal to hold the list of products
  public readonly cart = signal<Product[]>([]);

  // Add a product to the cart
  public addToCart(product: Product): void {
    this.cart.update((currentCart) => {
          // Check if product already exists in the cart
          const existingProduct = currentCart.find(item => item.id === product.id);
          if (existingProduct) {
            // Update quantity if the product exists
            existingProduct.quantity += 1;
          } else {
            // Add new product to the cart
            product.quantity = 1;
            currentCart.push(product);
          }
          return [...currentCart];  
    });

    console.log(this.cart());
  }

  // Remove a product from the cart
  public removeFromCart(product: Product): void {
    this.cart.update((cart) => cart.filter((item) => item.id !== product.id));
  }

  // Calculate total price
  public calculateTotal(): number {
    return this.cart().reduce((total, product) => total + product.price * product.quantity, 0);
  }
}
