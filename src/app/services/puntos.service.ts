import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Variables globales
import { environment } from './../../environments/environment';

import { Punto } from 'src/app/models/puntos.model';

// Variables globales
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PuntosService {

  constructor(private http: HttpClient) { }

  /**
    * Index puntos
    */
  public indexPuntos(idEvento: number) { // Enviando el id Evento

    // Ahora con interceptores
    return this.http.get<any>(base_url + `/api/puntos/indexpuntoseventos/${idEvento}`);

  }

  /**
  * Store nuevos Puntos
  */
  public storePuntos(puntos: any) {

    // Ahora con interceptores
    return this.http.post<any>(base_url + '/api/puntos', puntos);

  }

  /**
  * ShowPunto
  */
  public showPunto(id: number) {

    // Ahora con interceptores
    return this.http.get<any>(base_url + `/api/puntos/${id}`);

  }


  /**
  * updatePunto
  */
  public updatePunto(puntoData: Punto, id: number) {
    return this.http.put<any>(base_url + `/api/puntos/${id}`, puntoData);
  }


  /**
 * eliminar Punto
 */
  public destroyPunto(id: number) {

    return this.http.delete<any>(base_url + `/api/puntos/${id}`);

  }
}

