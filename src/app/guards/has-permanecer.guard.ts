import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

// Servicios
import { UsuariosService } from '../services/usuarios.service';

@Injectable({
    providedIn: 'root'
})
export class HasPermanecerGuard implements CanActivate {

    constructor(
        private usuarioServices: UsuariosService,
        private router: Router
    ) { }






    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {

        return this.usuarioServices.validarToken()
            .pipe(
                tap(estaAutenticado => {
                    if (estaAutenticado) {
                        this.router.navigateByUrl('/');
                    }
                }),
                map(isAutenticado => !isAutenticado)
            );
    }

}