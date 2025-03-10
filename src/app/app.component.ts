import { Component, inject, signal, computed } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { SplitterModule } from "primeng/splitter";
import { ToolbarModule } from "primeng/toolbar";
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { Product } from "./products/data-access/product.model";
import { CartService } from "./services/cart.service";
import { NgIf } from "@angular/common";
import { AuthService } from "./auth.service";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent, NgIf, ButtonModule, TooltipModule],
})
export class AppComponent {

  title = "ALTEN SHOP";
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
  }

  // Access signals from AuthService
  isLoggedInSignal = this.authService.isLoggedInSignal;
  loggedInUsernameSignal = this.authService.loggedInUsernameSignal;
  // Injecting CartService to access the cart
  private cartService = inject(CartService);

  // Create a computed signal to track the cart item count
  public readonly cartItemCount = computed(() => {
    console.log(this.cartService.cart());
    return this.cartService.cart().reduce((total, product) => total + 1, 0);
  });

  // Navigate to the cart page
  openCart() {
    this.router.navigateByUrl("/cart");
    console.log(this.cartItemCount());
  }

  openLogin() {
    this.router.navigateByUrl('/login'); // Navigate to the login page
  }  

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}