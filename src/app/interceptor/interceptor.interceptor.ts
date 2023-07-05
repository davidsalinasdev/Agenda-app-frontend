// Escucha cualquier peticion http que se haga en la aplicación
import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpHeaders,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {

    constructor() { }

    // Token de usuario
    get token() {
        let tokenActual: any;
        const infoToken = localStorage.getItem('access');
        if (infoToken) {
            const { token } = JSON.parse(infoToken);
            tokenActual = token;
        }
        return tokenActual;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let headers = new HttpHeaders();

        if (this.token != undefined) {
            headers = headers.set('token-usuario', this.token);

        } else {
            headers = headers.set('token-usuario', '');
        }

        // la request se clona antes de ser manipulada-- se envia los headers y como tambien los params
        const reqClone = request.clone({
            headers: headers
        });

        // Manda el header e intercepta los errores
        return next.handle(reqClone)
            .pipe(
                catchError(this.manejarError)
            )
    }

    // Metodo para manejar errores
    /**
     * manejarError
     */
    public manejarError(error: HttpErrorResponse) {

        console.log('Sucedio un error');
        console.log('Registrado en el log file');
        console.warn(error);

        // Esto retorna un error personalizado
        return new Observable<any>(observer => observer.error(error));

    }
}