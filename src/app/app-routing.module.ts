// Este modulo va a estar enfocado en las rutas
import { NgModule } from '@angular/core';

// Importar los indispensable
import { RouterModule, Routes } from '@angular/router';

// Rutas hijas
// import { PagesRoutingModule } from './pages/pages-routing.module';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { PagesRoutingModule } from './pages/pages-routing.module';

// Componentes
import { NopagesfoundComponentComponent } from './nopagesfound-component/nopagesfound-component.component';



// Configurar las rutas de la APP
const routes: Routes = [

  // Si es un path vacio va a redirecionar a -> dashboard y esto a un -> path: '', component: DashboardComponent
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  // Cualquiera otra ruta que no este definida en este routing va a mostrar NoPagesFound
  { path: '**', component: NopagesfoundComponentComponent }
  /**Fin rutas hijas principales */

]


@NgModule({
  declarations: [],
  imports: [
    // Es para implementar rutas PRINCIPALES
    RouterModule.forRoot(routes),
    AuthRoutingModule,
    PagesRoutingModule
  ],
  exports: [
    RouterModule // Se exporta para que otro modulo pueda disponer de este routing
  ]
})
export class AppRoutingModule { }
