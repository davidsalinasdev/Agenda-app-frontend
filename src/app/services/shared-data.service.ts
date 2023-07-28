import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  public agendas!: any;

  // Devuelve el siguiente y el anterior dato
  private dataAgenda$ = new BehaviorSubject<any>(this.agendas);

  // Solo devuelve el siguiente DATO
  // private dataAgenda$ = new Subject<any>();

  constructor() { }

  // Get de datos
  get indexDataAgenda$(): Observable<any> {
    return this.dataAgenda$.asObservable();
  }

  // Set de datos
  setAgenda$(agenda: any) {
    this.dataAgenda$.next(agenda);
  }



}
