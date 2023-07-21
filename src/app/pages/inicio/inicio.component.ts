import { Component, OnInit, Renderer2 } from '@angular/core';

// Full calendar
import { CalendarOptions, Calendar, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg, EventDragStopArg } from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';

// Formularios
import { FormArray, FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';

// Servicios
import { EventoService } from 'src/app/services/evento.service';
import { PuntosService } from 'src/app/services/puntos.service';

// Alertas
import Swal from 'sweetalert2';

// Notificaciones
import { ToastrService } from 'ngx-toastr';

// Modelos
import { Evento } from 'src/app/models/eventos.model';
import { Punto } from 'src/app/models/puntos.model';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

// Interfaces
interface EstadoEvento {
  label: string;
  value: string;
}


// Utilizando jquery
declare var JQuery: any;
declare var $: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  public enlaceCompartir: string = 'https://www.google.com';
  public enlaceCompartirSeguro!: SafeUrl;


  public events!: any[]

  // btn para crear evento
  public btnNewEvent: boolean = true;

  // Mostrar tabla
  public mostrarTabla: boolean = true;

  // Formularios reactivos
  public formulario!: FormGroup;
  public formularioModificarEvento!: FormGroup;
  public formularioModificarPuntos!: FormGroup;
  public formularioPuntos!: FormGroup;

  public estadoEvento: EstadoEvento[] = [
    { label: 'Abierto', value: 'Abierto' },
    { label: 'Cerrado', value: 'Cerrado' },
    { label: 'Concluido', value: 'Concluido' }
  ];



  public calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
  };

  // Para deshabilitar el boton de guardar
  public btnSave: boolean = true;

  // Usuario global
  public usuario!: number;

  // Nuevo evento creado
  public newEventCreate!: any;

  // Id del nuevo evento creado
  public idEventoGlobal!: number;

  // Lista de puntos creados
  public puntosCreados: any[] = [];

  // Mostrar btn_punto_o_lista_puntos
  public mostrarTablaPuntos: boolean = true;

  // Hora de evento formateado
  public horaEventoGlobal: string = '';
  public fechaEventoGlobal: string = '';

  // Id del evento para modificar
  public idEventoModificar!: number;

  // Id del punto para modificar
  public idPuntoModificar!: number;

  public dataShowEvento!: Evento;
  public dataShowPunto!: Punto;

  // Estado de agenda
  public opciones!: any[];

  // Nombre para puntos
  public nombreUserPunto!: string;

  constructor(
    private fb: FormBuilder,
    private eventosServices: EventoService,
    private puntosServices: PuntosService,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer
  ) {
    this.enlaceCompartirSeguro = this.sanitizer.bypassSecurityTrustUrl(this.enlaceCompartir);

  }

  ngOnInit(): void {
    this.scrollToTop();
    this.crearFormulario();
    this.crearFormularioModificarEvento();
    const user = localStorage.getItem('access');
    if (user) {
      const { token, identity } = JSON.parse(user);
      this.usuario = identity.sub;
      this.nombreUserPunto = `${identity.nombres} ${identity.paterno}`;
    }

  }

  /**
 * crearFormulario
 */
  public crearFormulario() {

    // Formulario par crear un evento
    this.formulario = this.fb.group({
      evento: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      lugar_evento: ['', Validators.compose([Validators.required, Validators.maxLength(70)])],
      fecha_hora_evento: ['', Validators.compose([Validators.required])],
      etiqueta: ['', Validators.compose([Validators.required])]
    });

    // Formulario para crear puntos
    this.formularioPuntos = this.fb.group({
      puntos: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
    });

  }

  // Para crear eventos
  get evento() {
    return this.formulario.get('evento');
  }

  get lugar_evento() {
    return this.formulario.get('lugar_evento');
  }

  get fecha_hora_evento() {
    return this.formulario.get('fecha_hora_evento');
  }

  get etiqueta() {
    return this.formulario.get('etiqueta');
  }

  // Para crear Puntos del evento
  get puntos() {
    return this.formularioPuntos.get('puntos') as FormArray;
  }



  /**
* crearFormularioModificarEvento
*/
  public crearFormularioModificarEvento() {

    // Formulario par crear un evento
    this.formularioModificarEvento = this.fb.group({
      eventoM: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      lugar_eventoM: ['', Validators.compose([Validators.required, Validators.maxLength(70)])],
      fecha_hora_eventoM: ['', Validators.compose([Validators.required])],
      etiquetaM: ['', Validators.compose([Validators.required])],
      estadoM: ['', Validators.compose([Validators.required])],
    });

    // Formulario par crear un evento
    this.formularioModificarPuntos = this.fb.group({

      puntosM: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],

    });

  }

  // Para crear eventos MODIFICAR
  get eventoM() {
    return this.formulario.get('eventoM');
  }

  get lugar_eventoM() {
    return this.formulario.get('lugar_eventoM');
  }

  get fecha_hora_eventoM() {
    return this.formulario.get('fecha_hora_eventoM');
  }

  get etiquetaM() {
    return this.formulario.get('etiquetaM');
  }

  // Para crear Puntos del evento
  get puntosM() {
    return this.formularioPuntos.get('puntosM') as FormArray;
  }

  // Para crear Puntos del evento
  get estadoM() {
    return this.formularioPuntos.get('estadoM') as FormArray;
  }


  /**
   * Registrar nuevo evento
   */
  public submit() {


    const formData = {
      evento: this.formulario.value.evento,
      lugar_evento: this.formulario.value.lugar_evento,
      fecha_hora_evento: this.formulario.value.fecha_hora_evento,
      etiqueta: this.formulario.value.etiqueta,
      users_id: this.usuario,
    }

    this.btnSave = false;

    this.eventosServices.storeEventos(formData)
      .subscribe({
        next: ({ status, message, evento }) => {
          if (status === 'success') {

            // Fecha
            const dateString = evento.fecha_hora_evento;
            this.fechaEventoGlobal = dateString.substring(0, 10);

            // Hora
            const timeString = evento.fecha_hora_evento;
            this.horaEventoGlobal = timeString.split('T')[1];

            this.newEventCreate = evento;
            console.log(this.newEventCreate);

            this.idEventoGlobal = evento.id;

            this.indexEventos();
            this.mostrarTabla = false;

            this.toastr.success(`${message}`, 'Agenda institucional-GADC');
          } else {
            this.toastr.error(message, 'Agenda institucional-GADC');
          }
        },
        error: (err: any) => {

          this.btnSave = true;

          if (err.error.errors.evento) {
            Swal.fire('Error', err.error.errors.evento[0], 'error')
          } else {
            Swal.fire('Error', err.error.message, 'error')
          }

        },
        complete: () => {
          this.btnSave = true;
        }
      });

  }


  /**
  * Registrar nuevos puntos para un evento
  */
  public submitPuntos(formDirectivePuntos: FormGroupDirective) {

    const formData = {
      puntos: this.formularioPuntos.value.puntos,
      eventos_id: this.idEventoGlobal,
      usuario: this.nombreUserPunto
    }

    this.btnSave = false;

    this.puntosServices.storePuntos(formData)
      .subscribe({
        next: ({ status, message }) => {
          if (status === 'success') {

            this.indexPuntos(this.idEventoGlobal);

            this.borrarCampoPuntos(formDirectivePuntos);

            this.toastr.success(message, 'Agenda institucional-GADC');
          } else {
            this.toastr.error(message, 'Agenda institucional-GADC');
          }
        },
        error: (err: any) => {

          this.btnSave = true;

          if (err.error.errors.puntos) {
            Swal.fire('Error', err.error.errors.puntos[0], 'error')
          } else {
            Swal.fire('Error', err.error.message, 'error')
          }

        },
        complete: () => {
          this.btnSave = true;
        }
      });

  }

  /**
  * indexEventos
  */
  public indexEventos() {

    this.eventosServices.indexEventos()
      .subscribe({
        next: ({ evento }) => {
          this.calendarOptions = {
            initialView: 'dayGridMonth',
            plugins: [dayGridPlugin],
            events: evento.map((evento: any) => (
              {
                title: evento.evento,
                date: evento.fecha_hora_evento.slice(0, 10),
                color: evento.etiqueta,
                publicId: evento.id
              }
            )),
            editable: true,

            customButtons: {
              myCustomButton: {
                text: 'custom!',
                click: function () {
                  alert('clicked the custom button!');
                }
              }
            },

            // headerToolbar: {
            //   left: 'prev,next today myCustomButton',
            //   center: 'title',
            //   right: 'dayGridMonth'
            // },
            // dateClick: this.handleDateClick.bind(this),
            eventClick: this.handleEventClick.bind(this),
            // eventDragStop: this.handleEventDragStop.bind(this),
            locale: esLocale, // Configura el idioma español
          };
        }
      })
  }

  /**
  * indexEventos
  */
  public indexPuntos(idEvento: number) {

    this.puntosCreados = [];

    this.puntosServices.indexPuntos(idEvento)
      .subscribe({
        next: ({ puntos }) => {
          this.puntosCreados = puntos;
        }
      })
  }


  // Boton para crear evento
  public crearEvento() {
    this.btnNewEvent = false;
    this.mostrarTabla = true;

    // this.btnNewEvent = true;
    this.mostrarTablaPuntos = true;

    this.puntosCreados = [];
    this.indexEventos();
    this.formulario.reset();
  }

  // handleDateClick(arg: DateClickArg) {
  //   console.log(arg);
  // }

  handleEventClick(arg: EventClickArg) {
    // Id del evento con su alias
    const { publicId: idEvento } = arg.event._def.extendedProps;


    this.eventosServices.showEvento(idEvento)
      .subscribe({
        next: ({ evento }) => {

          this.scrollToTop();

          // Fecha
          const dateString = evento.fecha_hora_evento;
          this.fechaEventoGlobal = dateString.substring(0, 10);

          // Hora
          const timeString = evento.fecha_hora_evento;
          this.horaEventoGlobal = timeString.split('T')[1];

          this.newEventCreate = evento;
          // console.log(this.newEventCreate);

          this.idEventoGlobal = evento.id;

          this.indexEventos();


          // Para mostrar la tabla y calendario
          this.btnNewEvent = false;
          this.mostrarTabla = false;
          this.mostrarTablaPuntos = false;

          this.indexPuntos(idEvento);
        }
      })
  }

  // handleEventDragStop(arg: EventDragStopArg) {
  //   console.log(arg);
  // }

  updateHeader() {
    this.calendarOptions!.headerToolbar = {
      left: 'prev,next myCustomButton',
      center: 'title',
      right: ''
    };
  }

  updateEvents() {
    const nowDate = new Date();
    const yearMonth = nowDate.getUTCFullYear() + '-' + (nowDate.getUTCMonth() + 1);

    this.calendarOptions!.events = [{
      title: 'Updated Event',
      start: yearMonth + '-08',
      end: yearMonth + '-10'
    }];
  }


  /**
* borrarFormulario
*/
  public cancelar(formDirective: FormGroupDirective) {
    this.scrollToTop();
    this.btnNewEvent = true;
    this.formulario.reset();
    if (this.formulario.valid || !this.formulario.valid) {
      formDirective.resetForm();
      this.formulario.reset();
    }
  }

  /**
* borrarFormulario Modal Modificar evento
*/
  public cancelarModificarEvento(formDirectiveModificarEvento: FormGroupDirective) {
    this.scrollToTop();
    this.formularioModificarEvento.reset();
    if (this.formularioModificarEvento.valid || !this.formularioModificarEvento.valid) {
      formDirectiveModificarEvento.resetForm();
      this.formularioModificarEvento.reset();
    }
    $('#myModal_editar_evento').modal('hide');
  }

  /**
* borrarFormulario Modal Modificar evento
*/
  public cancelarModificarPunto(formDirectiveModificarPunto: FormGroupDirective) {
    this.scrollToTop();
    this.formularioModificarEvento.reset();
    if (this.formularioModificarPuntos.valid || !this.formularioModificarPuntos.valid) {
      formDirectiveModificarPunto.resetForm();
      this.formularioModificarPuntos.reset();
    }
    $('#myModal_editar_punto').modal('hide');
  }

  /**
* borrarFormulario
*/
  public borrarCampoPuntos(formDirective: FormGroupDirective) {

    this.formularioPuntos.reset();
    if (this.formularioPuntos.valid || !this.formularioPuntos.valid) {
      formDirective.resetForm();
      this.formularioPuntos.reset();
    }

  }

  /**
   * crear_punto_evento
   */
  public crear_punto_evento() {
    this.mostrarTablaPuntos = false;
  }

  /**
   * salirCrearEventosPuntos
  */
  public salirCrearEventosPuntos() {
    this.btnNewEvent = true;
    this.mostrarTablaPuntos = true;
    this.puntosCreados = [];
    this.scrollToTop();
  }


  // Para que inicie siempre arriba de la pagina
  public scrollToTop() {
    const scrollOptions: ScrollToOptions = { top: 0, behavior: 'smooth' };
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
    this.renderer.setProperty(document.body, 'scrollTop', 0);
    window.scrollTo(scrollOptions);
  }


  ngAfterViewInit() {
    this.indexEventos();
  }


  /**
   * modificarEvento
   */
  public submitModificarEvento(formDirectiveModificarEvento: FormGroupDirective) {

    const formData: Evento = {
      evento: this.formularioModificarEvento.value.eventoM,
      lugar_evento: this.formularioModificarEvento.value.lugar_eventoM,
      fecha_hora_evento: this.formularioModificarEvento.value.fecha_hora_eventoM,
      etiqueta: this.formularioModificarEvento.value.etiquetaM,
      estado: this.formularioModificarEvento.value.estadoM,
    }

    this.btnSave = false;

    this.eventosServices.updateEvento(formData, this.idEventoModificar)
      .subscribe({

        next: ({ message, evento }) => {
          $('#myModal_editar_evento').modal('hide');

          // Actualiza el calendario
          this.indexEventos();

          console.log(evento);


          // Actualiza la tabla
          this.newEventCreate = evento;

          // Actualiza la tabla de puntos
          this.indexPuntos(evento.id);

          this.toastr.success(`${message}`, '¡Modificación Correcta!');
          this.cancelarModificarEvento(formDirectiveModificarEvento);
        },
        error: (err: any) => {
          console.log(err);
          this.btnSave = true;
          this.btnSave = true;

          Swal.fire('Error', err.error.message, 'error')
        },
        complete: () => {
          this.btnSave = true;
        }

      });


  }

  /**
  * Cargar datos para modificar un EVENTO
  */
  public cargarModificarEvento(id: number) {

    this.idEventoModificar = id;

    this.eventosServices.showEvento(id)
      .subscribe({
        next: ({ evento }) => {

          this.dataShowEvento = evento;

          this.formularioModificarEvento.setValue({
            eventoM: this.dataShowEvento.evento,
            fecha_hora_eventoM: this.dataShowEvento.fecha_hora_evento,
            lugar_eventoM: this.dataShowEvento.lugar_evento,
            etiquetaM: this.dataShowEvento.etiqueta,
            estadoM: this.dataShowEvento.estado
          });

        },
        error: (err: any) => {
          Swal.fire('Error', err.error.message, 'error')
        },
        complete: () => {

        }
      });
    $('#myModal_editar_evento').modal('show');
  }

  /**
  * destroyEvento
  */
  public destroyEvento(id: number, evento: string) {


    Swal.fire({
      title: 'Se eliminara esta agenda:',
      text: `${evento}`,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar!',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventosServices.destroyEvento(id)
          .subscribe({
            next: ({ status }) => {
              if (status === 'success') {
                this.indexEventos();
                Swal.fire(
                  `${evento}`,
                  `A sido eliminado correctamente`,
                  'success'
                );

                // Cerrar
                this.mostrarTablaPuntos = false;
                this.mostrarTabla = false;
                this.btnNewEvent = true;

              }
            },
            error: (err) => {

              Swal.fire('Error', err.error.message, 'error')
            }
          });
      }
    })

  }

  /**
  * modificarPunto
  */
  public submitModificarPunto(formDirectiveModificarPunto: FormGroupDirective) {

    const formData: Punto = {
      puntos: this.formularioModificarPuntos.value.puntosM,
    }


    this.btnSave = false;

    this.puntosServices.updatePunto(formData, this.idPuntoModificar)
      .subscribe({

        next: ({ message, punto }) => {
          $('#myModal_editar_punto').modal('hide');
          this.indexPuntos(punto.eventos_id);

          this.toastr.success(`${message}`, '¡Modificación Correcta!');
        },
        error: (err: any) => {
          console.log(err);

          this.btnSave = true;
          Swal.fire('Error', err.error.message, 'error')
        },
        complete: () => {

          this.btnSave = true;
        }

      });
  }

  /**
   * modificarPunto
   */
  public cargarModificarPunto(idPunto: number) {

    this.idPuntoModificar = idPunto;

    this.puntosServices.showPunto(idPunto)
      .subscribe({
        next: ({ punto }) => {

          this.dataShowPunto = punto;

          this.formularioModificarPuntos.setValue({
            puntosM: this.dataShowPunto.puntos
          });

        },
        error: (err: any) => {
          Swal.fire('Error', err.error.message, 'error')
        },
        complete: () => {

        }
      });
    $('#myModal_editar_punto').modal('show');

  }


  /**
   * destroyPunto
   */
  public destroyPunto(id: number, eventos_id: number) {


    this.puntosServices.destroyPunto(id)
      .subscribe({
        next: ({ status, message }) => {
          if (status === 'success') {
            this.indexPuntos(eventos_id);
            this.toastr.error(message, 'Agenda institucional-GADC');
          }
        },
        error: (err) => {
          Swal.fire('Error', err.error.message, 'error')
        }
      });
  }

  // Compatir por whatsap
  public compartirEnWhatsApp() {
    const mensaje = '¡Echa un vistazo a este enlace!';
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}%20${this.enlaceCompartir}`;
    window.open(url);
  }


}



