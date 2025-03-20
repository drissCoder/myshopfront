import {
  Component,
  computed,
  inject,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { CartService } from "./cart/services/cart.service";
import { NgIf } from "@angular/common";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent, NgIf],
})
export class AppComponent {
  title = "ALTEN SHOP";

  private router = inject(Router);
  private cartService = inject(CartService);
  public numberItemsOfCart = computed(() => this.cartService.countItemsInCart()); 

  public openCart(){
    this.router.navigateByUrl("/cart");
  }
}
