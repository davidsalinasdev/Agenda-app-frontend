
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Componentes de PAGES
import { InicioComponent } from './inicio/inicio.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { PerfilComponent } from './usuarios/perfil/perfil.component';

// Guardianes
import { HasRoleService } from '../guards/has-role.guard';
import { HasInicioService } from '../guards/has-inicio.guard';

const childRoute: Routes = [

    // RUTAS HIJAS DE
    {
        path: '',
        component: InicioComponent,
        data: { titulo: 'Agenda institucional GADC' },
        canActivate: [HasInicioService]
    }, // Path inicial

    {
        path: 'usuarios',
        component: UsuariosComponent,
        data: { titulo: 'Gestión de usuarios' },
        canActivate: [HasRoleService]
    },
    // Path inicial
    { path: 'perfil', component: PerfilComponent, data: { titulo: 'Datos de usuario' } }, // Path inicial
    // { path: '', redirectTo: '/dashboard', pathMatch: 'full' }

]

@NgModule({
    imports: [RouterModule.forChild(childRoute)],
    exports: [RouterModule]
})
export class ChildRoutesModule { }