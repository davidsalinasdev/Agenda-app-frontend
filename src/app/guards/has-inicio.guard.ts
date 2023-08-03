import { Injectable } from '@angular/core';
import { Router, CanLoad, Route, UrlSegment, UrlTree, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

// Servicios
import { AdminService } from '../services/admin.service';
import { tap } from 'rxjs/operators';


// Notificaciones
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class HasInicioService implements CanActivate {

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
        return this.adminService.checkFuncionario()
            .pipe(

                // Si no esta autenticado quiero redireccionar a esta persona al login
                tap(isFun => {
                    // preguntamos si no esta autenticado->navegamos a otra pantalla
                    if (isFun) {

                        // console.log('Es funcionario, restringiendo a otra página');

                    } else {
                        // console.log('Fun no tiene permisos');
                        // this.toasteService.error('No tienes permisos', 'Agenda institucional');
                        this.router.navigate(['/inicio/usuarios']);

                    }
                }),

            )
    }

}
