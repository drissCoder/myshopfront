import { enableProdMode, importProvidersFrom } from "@angular/core";

import { registerLocaleData } from "@angular/common";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import localeFr from "@angular/common/locales/fr";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { APP_ROUTES } from "app/app.routes";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { AppComponent } from "./app/app.component";
import { environment } from "./environments/environment";
import { AuthInterceptor } from "app/auth.interceptor";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideHttpClient(
      withInterceptorsFromDi(),
    ),
    provideAnimations(),
    provideRouter(APP_ROUTES),
    ConfirmationService,
    MessageService,
    DialogService,
    // Provide AuthInterceptor here
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,  // Use your AuthInterceptor class
      multi: true,  // This ensures the interceptor is added without overwriting others
    },
  ],
}).catch((err) => console.log(err));

registerLocaleData(localeFr, "fr-FR");
