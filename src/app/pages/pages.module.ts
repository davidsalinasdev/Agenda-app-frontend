import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing central de PAGES
import { PagesRoutingModule } from './pages-routing.module';

// Componentes de PAGES
import { PagesComponent } from './pages.component';
import { InicioComponent } from './inicio/inicio.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PerfilComponent } from './usuarios/perfil/perfil.component';


// Modulo shared
import { SharedModule } from '../shared/shared.module';

// Formularios reactivos
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// Paginación
import { NgxPaginationModule } from 'ngx-pagination';

// Full calendar
import { FullCalendarModule } from '@fullcalendar/angular';

// Componentes primeNG
import { PrimengModule } from '../primeng/primeng.module';

// Componentes reutilizables
import { ComponentsModule } from '../components/components.module';

// Angular Material
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    PagesComponent,
    InicioComponent,
    UsuariosComponent,
    PerfilComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FullCalendarModule,
    PrimengModule,
    ComponentsModule,
    MaterialModule
  ],
  exports: [
    PagesComponent,
    InicioComponent,
    UsuariosComponent,
    PerfilComponent
  ]
})
export class PagesModule { }
