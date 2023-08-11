import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Variables globales
import { environment } from './../../environments/environment';

// Modelos
import { Evento } from '../models/eventos.model';


// Variables globales
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  constructor(private http: HttpClient) { }

  /**
    * Store nuevos eventos
    */
  public indexEventos() {

    // Ahora con interceptores
    return this.http.get<any>(base_url + '/api/eventos');

  }

  /**
  * Store nuevos eventos
  */
  public storeEventos(eventos: any) {

    // Ahora con interceptores

    return this.http.post<any>(base_url + '/api/eventos', eventos);

  }

  /**
  * ShowEvento
  */
  public showEvento(id: number) {

    // Ahora con interceptores
    return this.http.get<any>(base_url + `/api/eventos/${id}`);
  }

  /**
  * updateEvento
  */
  public updateEvento(eventoData: Evento, id: number) {
    return this.http.put<any>(base_url + `/api/eventos/${id}`, eventoData);
  }

  /**
  * eliminar Agenda
  */
  public destroyEvento(id: number) {

    return this.http.delete<any>(base_url + `/api/eventos/${id}`);

  }

  /**
   * cambiarEstado
   */
  public cambiarEstado() {
    // Ahora con interceptores
    return this.http.post<any>(base_url + '/api/eventos/cambiarestado', {});
  }

}
