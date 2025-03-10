import { Component, Output, EventEmitter, signal, computed } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { CartService } from "app/services/cart.service";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { NgFor, NgIf } from "@angular/common";

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [NgFor, CardModule, ButtonModule, NgIf],
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent {
  // Initialize cart signal from CartService
  public readonly cart = this.cartService.cart;

  @Output() productToRemove = new EventEmitter<Product>();

  constructor(private cartService: CartService) {}

  trackById(index: number, item: Product): number {
    return item.id;
  }

  public onRemoveFromCart(item: Product): void {
    this.cartService.removeFromCart(item);
    this.productToRemove.emit(item);  // Emit event for parent component
  }

  public onCheckout(): void {
    // Implement checkout functionality here
    console.log("Proceeding to checkout");
  }

  public calculateTotal(): number {
    return parseFloat(
      this.cart().reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
    );
  }
  

  public updateQuantity(item: Product, change: number): void {
    const updatedCart = this.cart();
    const product = updatedCart.find(p => p.id === item.id);
    if (product) {
      const newQuantity = product.quantity + change;
      if (newQuantity > 0) {
        product.quantity = newQuantity;
        this.cart.set([...updatedCart]); // Update the cart signal
      }
    }
  }
}