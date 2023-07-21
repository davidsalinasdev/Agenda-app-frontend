import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [

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
}

