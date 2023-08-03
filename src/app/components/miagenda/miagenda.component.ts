import { map } from 'rxjs/operators';
import { SharedDataService } from './../../services/shared-data.service';
import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-miagenda',
  templateUrl: './miagenda.component.html',
  styleUrls: ['./miagenda.component.css']
})
export class MiagendaComponent implements OnInit, OnDestroy {

  public dataAgenda!: any;
  public usuario!: number;

  private subscription!: Subscription;

  constructor(
    private sharedDataServices: SharedDataService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.dataAgenda = [];

    const user = localStorage.getItem('access');
    if (user) {
      const { token, identity } = JSON.parse(user);
      this.usuario = identity.sub;
    }

    this.subscription = this.sharedDataServices.indexDataAgenda$
      .subscribe({
        next: (resp) => {
          this.dataAgenda = resp;

          // POR CADA ITERACION DEL ARRAY
          // 1.-value:any=>Muestra un elemento del array 
          // 2.-index:any=>Muetsra los indeces del array
          // 3.-array:any=>Muetsra todo el array

          this.dataAgenda.map((value: any, index: any, array: any) => {

            // Fecha
            const dateString = value.evento.fecha_hora_evento;
            let fechaEventoGlobal = dateString.substring(0, 10);
            // console.log(fechaEventoGlobal);

            // Hora
            const timeString = value.evento.fecha_hora_evento;
            let horaEventoGlobal = timeString.split('T')[1];
            // console.log(horaEventoGlobal);

            value.evento.fecha_hora_evento = `${fechaEventoGlobal} | ${horaEventoGlobal}`;

            // No olvides devolver el valor modificado en este caso es value
            return value;

          })

        }
      });
  }


  // Es importante esto
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
