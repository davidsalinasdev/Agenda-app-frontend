import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [

    {
      titulo: 'Usuarios',
      icono: 'nav-icon fas fa-user-plus',
      submenu: [
        { titulo: 'Usuarios', url: 'usuarios', icono: 'nav-icon fas fa-user', },
        { titulo: 'Perfil de usuario', url: 'usuario', icono: 'nav-icon fas fa-pen' }
      ]

    },
    // {
    //   titulo: 'Perfil de usuario',
    //   icono: 'nav-icon fas fa-user-plus',
    //   submenu: [
    //     { titulo: 'Usuarios', url: 'usuarios', icono: 'nav-icon fas fa-user', },
    //   ]
    // },

  ];

  constructor() { }
}

