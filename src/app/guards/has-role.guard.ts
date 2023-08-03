import { Injectable } from '@angular/core';
import { Router, CanLoad, Route, UrlSegment, UrlTree, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

// Notificaciones
import { ToastrService } from 'ngx-toastr';

// Servicios
import { AdminService } from '../services/admin.service';
import { tap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class HasRoleService implements CanActivate {

  public usuario: any;

  constructor(
    private adminService: AdminService,
    private toasteService: ToastrService,
    private router: Router

  ) {

    const user = localStorage.getItem('access');
    if (user) {
      const { identity } = JSON.parse(user);
      this.usuario = identity.sub;
    }

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.adminService.checkAdministrador()
      .pipe(

        // Si no esta autenticado quiero redireccionar a esta persona al login
        tap(isAdmin => {
          // preguntamos si no esta autenticado->navegamos a otra pantalla
          if (isAdmin) {
            // console.log('Es admin, Esta restringiendo a otra página');
            // this.router.navigate(['/ininio/usuarios']);
          } else {
            // this.toasteService.error('No tienes permisos', 'Agenda institucional');
            this.router.navigate(['/inicio']);
          }
        }),

      )
  }

}
