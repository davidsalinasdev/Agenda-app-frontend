import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Componentes del modulo SHARED
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SiderComponent } from './sider/sider.component';

// Para manejar rutas
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    BreadcrumbsComponent,
    FooterComponent,
    HeaderComponent,
    SiderComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    BreadcrumbsComponent,
    FooterComponent,
    HeaderComponent,
    SiderComponent
  ]
})
export class SharedModule { }
