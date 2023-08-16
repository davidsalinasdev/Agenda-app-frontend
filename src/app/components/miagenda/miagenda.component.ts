
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

// Servicios
import { PuntosService } from 'src/app/services/puntos.service';
import { EventoService } from 'src/app/services/evento.service';
import { SharedDataService } from './../../services/shared-data.service';

// Alertas
import Swal from 'sweetalert2';
import { MiagendaService } from 'src/app/services/miagenda.service';
import { SharedHijoPadreService } from '../../services/shared-hijo-padre.service';

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
    private puntoServices: PuntosService,
    private eventoServices: EventoService,
    private miAgendaServices: MiagendaService,
    private sharedHijoPadreServices: SharedHijoPadreService
  ) { }

  ngOnInit(): void {

    this.dataAgenda = [];

    const user = localStorage.getItem('access');
    if (user) {
      const { token, identity } = JSON.parse(user);
      this.usuario = identity.sub;
    }
    this.showAgenda();

  }

  public showAgenda() {
    this.subscription = this.sharedDataServices.indexDataAgenda$
      .subscribe({
        next: (resp) => {
          this.dataAgenda = resp;

          // console.log(this.usuario);

          // console.log(this.dataAgenda);

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

  // Metodos de acciones de mi agenda

  /**
   * destroyMiAgenda
   */
  public destroyMiAgenda(id: number, evento: string, users_id: number) {

    if (this.usuario === users_id) {
      Swal.fire({
        title: 'Esta seguro de eliminar esta agenda:',
        text: `${evento}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si eliminar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {

        if (result.isConfirmed) {
          //  Logica para eliminar una agenda
          this.dataAgenda = [];

          this.eventoServices.destroyEvento(id)
            .subscribe(resp => {


              this.miAgendaServices.showAgenda(users_id)
                .subscribe({
                  next: ({ agenda }) => {

                    // Carga de datos en shared-data agenda
                    // this.sharedDataServices.setAgenda$(agenda);


                    // Filtrar por id y estado
                    const filteredData = agenda.filter((item: any) => item.users_id === this.usuario && item.evento.estado != 'Concluido');

                    // Actualiza los datos del componente mi agenda
                    this.dataAgenda = filteredData;
                    // Actualiza los datos del componente mi agenda
                    this.sharedHijoPadreServices.notificarAccionRealizadaInicioComponent(); // Notificar al servicio



                    Swal.fire(
                      'Eliminado!',
                      'Se elimino por completo esta agenda',
                      'success'
                    )



                  },
                  error: (err) => {
                    Swal.fire('Error', err.error.message, 'error')
                  }
                })

            })

        }
      })



    } else {
      Swal.fire({
        title: 'Esta seguro de salirte de esta agenda:',
        text: `${evento}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si salir!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {

          // Logica para salirce de una de una evento
          const formData = {
            eventos_id: id,
            users_id: this.usuario,
            eventos: evento
          }

          this.miAgendaServices.destroyAllPoinst(formData)
            .subscribe(resp => {

              console.log(users_id);


              this.miAgendaServices.showAgenda(this.usuario)
                .subscribe({
                  next: ({ agenda }) => {

                    // Carga de datos en shared-data agenda
                    // this.sharedDataServices.setAgenda$(agenda);


                    // Filtrar por id y estado
                    const filteredData = agenda.filter((item: any) => item.users_id === this.usuario && item.evento.estado != 'Concluido');

                    // Actualiza los datos del componente mi agenda
                    this.dataAgenda = filteredData;

                    // Actualiza los datos del componente mi agenda
                    this.sharedHijoPadreServices.notificarAccionRealizadaInicioComponent(); // Notificar al servicio


                    Swal.fire(
                      'Eliminado!',
                      `${resp.message}`,
                      'success'
                    )

                  },
                  error: (err) => {
                    Swal.fire('Error', err.error.message, 'error')
                  }
                })



            })

        }
      })
    }
  }


  /**
   * updateMiAgenda
   */
  public updateMiAgenda(id: number) {

    this.sharedHijoPadreServices.notificarAccionUpdateMiAgenda(id); // Notificar al padre

  }


  /**
   * compartir
   */
  public compartir(id: number) {

    this.sharedHijoPadreServices.notificarAccionSharedAgenda(id); // Notificar al padre

  }


  // Es importante esto
  ngOnDestroy() {

    this.subscription.unsubscribe();

  }



}
