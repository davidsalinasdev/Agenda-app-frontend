import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Modulo APP_ROUTING
import { AppRoutingModule } from './app-routing.module';

// Modulo AUTH y PAGES
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';

// Componente de APP
import { AppComponent } from './app.component';
import { NopagesfoundComponentComponent } from './nopagesfound-component/nopagesfound-component.component';

// Formularios reactivos
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Idioma español
import localeEs from "@angular/common/locales/es";
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from "@angular/common";
registerLocaleData(localeEs, 'es');

// Toaster
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Manejo de interceptores
import { InterceptorInterceptor } from './interceptor/interceptor.interceptor';

// Para peticiones HTTP
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    NopagesfoundComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    PagesModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    // Para el lenguaje español
    { provide: LOCALE_ID, useValue: 'es' },
    // Manejo de interceptores, multi:true hace que este pendiente a todas las peticiones que se haga
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
