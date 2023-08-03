import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Servicios
import { AuthGuard } from './../guards/auth.guard';

// Componentes de PAGES
import { PagesComponent } from './pages.component';


const routes: Routes = [

  // Rutas PROTEGIDAS como hijas de app-routing.module.ts
  {
    // Cuando el path sea vacio va redireciones aun sub moduloComonenete
    path: 'inicio', // ruta padre
    component: PagesComponent,
    canActivate: [AuthGuard],

    // Definiendo rutas hijas de este modulo
    // children: [ // ruta hija depende del padre

    // ]
    // Lazyload
    loadChildren: () => import('./child-routes.module').then(m => m.ChildRoutesModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
