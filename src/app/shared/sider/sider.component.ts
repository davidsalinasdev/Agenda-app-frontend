import { Component, OnInit } from '@angular/core';

// Servicios
import { SidebarService } from 'src/app/services/sidebar.service';

// Jquery
// declare var $: any;

@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.css']
})
export class SiderComponent implements OnInit {

  // Datos de usuario
  public usuario: any;
  public token: any;
  public rol: any;

  // public usuario: Usuario;
  public menuItems!: any[];

  constructor(
    private sidebarServices: SidebarService,
  ) {
    this.menuItems = this.sidebarServices.menu;
  }

  ngOnInit(): void {


    // Solucion problema sidebar
    // $('[data-widget="treeview"]').Treeview('init');
    // Fin Solucion problema sidebar

    const user = localStorage.getItem('access');
    if (user) {
      const { token, identity } = JSON.parse(user);
      this.usuario = identity;
      this.token = token;
      this.rol = identity.rol;
    }
  }

}
