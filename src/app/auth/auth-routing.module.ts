import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componente de AUTH
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  /****  Rutas PUBLICAS Principales como hijas de app-routing.module.ts****/
  { path: 'login', component: LoginComponent, data: { titulo: 'Login' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
