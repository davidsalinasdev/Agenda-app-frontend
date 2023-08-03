import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  // Datos de usuario
  public usuario: any;
  public token: any;
  public rol: any;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    const user = localStorage.getItem('access');
    if (user) {
      const { token, identity } = JSON.parse(user);
      this.usuario = identity;
      this.token = token;
      this.rol = identity.rol;
    }
  }

  /**
  * logout
  */
  public logout() {

    localStorage.removeItem('token');
    this.usuario = null;
    this.token = null;
    // Redireccionar al la pagina principal
    this.router.navigate(['/login']);
    // localStorage.removeItem('access');
    // localStorage.removeItem('ultimoClic');
    // localStorage.removeItem('items');
    // localStorage.removeItem('position');
    localStorage.clear();
  }

}
