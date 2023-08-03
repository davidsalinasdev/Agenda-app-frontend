import { Injectable } from '@angular/core';
import { Observable, of, catchError } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public usuarioAdmin: any;
  public usuarioFun: any;

  constructor() {

  }

  public checkAdministrador(): Observable<boolean> {



    const user = localStorage.getItem('access');
    if (user) {
      const { identity } = JSON.parse(user);
      this.usuarioAdmin = identity;

    }

    // Como saber si un usuario no esta autenticado si no hay un token
    if (this.usuarioAdmin.rol === 'Administrador') {
      return of(true);
    } else {
      return of(false);
    }

  }

  public checkFuncionario(): Observable<boolean> {



    const user = localStorage.getItem('access');
    if (user) {
      const { identity } = JSON.parse(user);
      this.usuarioFun = identity;
    }

    // Como saber si un usuario no esta autenticado si no hay un token
    if (this.usuarioFun.rol === 'Funcionario') {
      return of(true);
    } else {
      return of(false);
    }

  }
}