import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Variables globales
import { environment } from './../../environments/environment';

// Variables globales
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MiagendaService {

  constructor(private http: HttpClient) { }

  /**
   * Lista de toda miagenda
   */
  public indexAgenda() {
    // Ahora con interceptores
    return this.http.get<any>(base_url + '/api/agendas');

  }


  /**
  * Index puntos
  */
  public destroyAgenda(agenda: any) { // Enviando el id Evento

    // Ahora con interceptores
    return this.http.post<any>(base_url + '/api/agendas/destroyagenda', agenda);

  }


}
