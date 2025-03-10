import { NgIf } from "@angular/common";
import { Component, OnInit, ViewEncapsulation, WritableSignal, computed, effect, inject, signal } from "@angular/core";
import { AuthService } from "app/auth.service";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { CartService } from "app/services/cart.service";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from "primeng/inputtext";
import { PaginatorModule } from "primeng/paginator";
import { RatingModule } from 'primeng/rating';
const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [DataViewModule, CardModule, ButtonModule,  RatingModule, DialogModule, ProductFormComponent, NgIf, PaginatorModule, InputTextModule],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly authService = inject(AuthService);
  public readonly products = this.productsService.products;

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);
  public readonly cart = signal<Product[]>([]);
  public searchTerm: string = '';
  public currentPage: number = 0;
  public itemsPerPage: number = 2;
  public readonly productsSignal = computed( () => this.products());
  public isAdmin = this.authService.hasRoleAdmin;
  constructor(private cartService: CartService){
    effect(()=>{
      console.log(this.isAdmin);
      console.log(this.isAdmin());
    })
  }
  ngOnInit() {
    this.productsService.get().subscribe();
  }
  onPageChange(event: any): void {
    this.currentPage = event.page ?? 0; // Fallback to 0 if undefined
}

  get filteredProducts() {
    console.log("driss");
    return this.productsSignal().filter(item => item.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  get paginatedCart() {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProducts.slice(start, end);
  }

  public onAddToCart(product: Product){
    console.log(this.cart());
    this.cartService.addToCart(product);
  }
  public isProductInCart(productId: number): boolean {
    return false;//this.cartService.cart().some((item) => item.id === productId);
  }


  public onRemoveFromCart(product: Product){
    this.cartService.removeFromCart(product);
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe();
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe();
    } else {
      this.productsService.update(product).subscribe();
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }
}
