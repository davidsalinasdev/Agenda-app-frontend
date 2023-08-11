import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedHijoPadreService {

  // Propiedades
  private accionRealizada = new Subject<void>();

  public accionRealizada$ = this.accionRealizada.asObservable();


  // Metodos
  public notificarAccionRealizadaInicioComponent() {
    this.accionRealizada.next();
  }

}

