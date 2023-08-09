import { Injectable } from '@angular/core';
import { Observable, Subject, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FechaService {


  // Solo devuelve el siguiente DATO
  private dataFecha$ = new Subject<any>();

  constructor() { }

  /**
   * name
   */
  public obtenerFecha(): Observable<{}> {
    return interval(1000).pipe(
      map(() => {
        const fechaActual = new Date();
        const fecha = fechaActual.toLocaleDateString();
        const hora = fechaActual.toLocaleTimeString();
        return { fecha: fecha, hora: hora };
      })
    );
  }

  /**
   * name
   */
  public obtenerHora(): Observable<string> {
    return interval(1000).pipe(
      map(() => {
        const fechaActual = new Date();
        const hora = fechaActual.toLocaleTimeString();
        return hora;
      })
    );
  }


}
