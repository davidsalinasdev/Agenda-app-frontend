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
  ) { }

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

    // Menu segun el rol de usuario
    this.menuItems = this.sidebarServices.obtenerMenuSegunRol(this.rol);

    // console.log(this.usuario);
    // console.log(this.token);
    // console.log(this.rol);



  }

}
