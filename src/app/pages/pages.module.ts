import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing central de PAGES
import { PagesRoutingModule } from './pages-routing.module';

// Componentes de PAGES
import { PagesComponent } from './pages.component';
import { InicioComponent } from './inicio/inicio.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

// Modulo shared
import { SharedModule } from '../shared/shared.module';

// Formularios reactivos
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// Paginación
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    PagesComponent,
    InicioComponent,
    UsuariosComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  exports: [
    PagesComponent,
    InicioComponent,
    UsuariosComponent
  ]
})
export class PagesModule { }