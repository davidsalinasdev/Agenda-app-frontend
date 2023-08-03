import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componente de AUTH
import { LoginComponent } from './login/login.component';

// Guardian
import { HasPermanecerGuard } from '../guards/has-permanecer.guard';



const routes: Routes = [
  /****  Rutas PUBLICAS Principales como hijas de app-routing.module.ts****/
  {
    path: 'login',
    component: LoginComponent,
    data: { titulo: 'Login' },
    canActivate: [HasPermanecerGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
