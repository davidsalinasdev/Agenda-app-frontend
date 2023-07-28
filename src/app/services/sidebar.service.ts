import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu: any[] = [

    {
      titulo: 'Agenda',
      icono: 'nav-icon fas fa-calendar',
      submenu: [
        { titulo: 'calendario', url: '', icono: 'nav-icon fas fa-list' }
      ]

    },

    {
      titulo: 'Usuarios',
      icono: 'nav-icon fas fa-user-plus',
      submenu: [
        { titulo: 'Usuarios', url: 'usuarios', icono: 'nav-icon fas fa-user', },
      ]

    }
  ];

  constructor() { }

  // Recibimos el rol de usuario de administrador
  public obtenerMenuSegunRol(rolUsuario: string): any[] {
    // Si el rol del usuario es "agenda", devolver solo el menú de "Agenda".
    if (rolUsuario === 'Funcionario') {
      return this.menu.filter(item => item.titulo === 'Agenda');
    }
    // Si el rol del usuario es "usuarios", devolver solo el menú de "Usuarios".
    else if (rolUsuario === 'Administrador') {
      return this.menu;
    }
    // Si el rol del usuario no coincide con ninguno de los menús, devolver un array vacío.
    else {
      return [];
    }
  }
}

