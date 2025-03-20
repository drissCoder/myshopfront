import { Injectable, signal } from '@angular/core';
import { Product } from 'app/products/data-access/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public cart = signal<Product[]>([]);
  public cartItems: Product[] = [];

  constructor() { }

  public addToCart(newCartItem: Product): void{
    let oldCartItem = undefined;
    
      oldCartItem = this.cart().find((cartItem: Product) => {
        return cartItem.name === newCartItem.name
      });
      if(oldCartItem === undefined){
        newCartItem.quantity = 1;
        this.cart.update((value) => [...value, newCartItem]);
      }else{
        oldCartItem.quantity += 1;
        this.cart.update((value) => [...value]);
      }
  }

  public countItemsInCart(): number{
      return this.cart().length;
  }

  public increaseCartItemQantity(product: Product): void {

    let oldCartItem = undefined;
    
      oldCartItem = this.cart().find((cartItem: Product) => {
        return cartItem.name === product.name
      });
      if(oldCartItem !== undefined){
        product.quantity += 1;
        this.cart.update((value) => [...value]);
      }
  }

  public decreaseCartItemQauntity(product: Product): void {

    let oldCartItem = undefined;
    
      oldCartItem = this.cart().find((cartItem: Product) => {
        return cartItem.name === product.name
      });
      console.log(oldCartItem);
      if(oldCartItem !== undefined){
        product.quantity -= 1;
        if(product.quantity === 0){
          this.cart.update(() => [...this.cart().filter((produ: Product) => produ.id !== product.id)]);
        }else{
          this.cart.update((value) => [...value]);
        }
      }
  }

  public total(): number {

    return this.cart().reduce((total, product) => total += product.quantity * product.price, 0);
  }

  public deleteProduct(cartItem: Product){
    
    this.cart.update(() => [...this.cart().filter((product: Product) => product.id !== cartItem.id)]);
    console.log(this.cart());
  }
}
