
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Componentes de PAGES
import { InicioComponent } from './inicio/inicio.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

const childRoute: Routes = [

    // RUTAS HIJAS DE
    { path: '', component: InicioComponent, data: { titulo: 'Agenda institucional GADC' } }, // Path inicial
    { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Gestión de usuarios' } }, // Path inicial
    // { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
]

@NgModule({
    imports: [RouterModule.forChild(childRoute)],
    exports: [RouterModule]
})
export class ChildRoutesModule { }