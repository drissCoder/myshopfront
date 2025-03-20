import { Component, computed, inject } from '@angular/core';
import { CartService } from 'app/cart/services/cart.service';
import { Product } from 'app/products/data-access/product.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CardModule, ButtonModule, RatingModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  public cartService = inject(CartService);
  public _cart = computed(() => this.cartService.cart());
  public quantity!: number;
  ngOnInit(){
  }


  public decreaseCartItemQantity(product: Product): void {

    this.cartService.decreaseCartItemQauntity(product);
  }

  public increaseCartItemQantity(product: Product): void {
 
    this.cartService.increaseCartItemQantity(product);
  }

  public total(): number {
    return this.cartService.total();
  }

  public onDeleteProduct(cartItem: Product){

    this.cartService.deleteProduct(cartItem);
  }
}
