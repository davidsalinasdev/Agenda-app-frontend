import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedHijoPadreService {

  // Propiedades para destruir un evento
  private accionRealizada = new Subject<void>();

  // Para modificar un evento desde Mi agenda
  private updateMiagenda = new Subject<number>();

  // Para compartir agenda
  private sharedMiAgenda = new Subject<number>();

  public accionRealizada$ = this.accionRealizada.asObservable();
  public updateMiAgenda$ = this.updateMiagenda.asObservable();
  public sharedMiAgenda$ = this.sharedMiAgenda.asObservable();


  // Metodos
  public notificarAccionRealizadaInicioComponent() {
    this.accionRealizada.next();
  }

  /**
   * accionUpdateMiAgenda
   */
  public notificarAccionUpdateMiAgenda(id: number) {
    this.updateMiagenda.next(id);
  }


  /**
   * notificarAccionConpartirAgenda
  */
  public notificarAccionSharedAgenda(id: number) {
    this.sharedMiAgenda.next(id);
  }


}

