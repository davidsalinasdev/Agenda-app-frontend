import { Attribute } from './../../../../node_modules/@angular/cdk/node_modules/parse5/dist/cjs/common/token.d';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';

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
import { MiagendaService } from 'src/app/services/miagenda.service';


import { SharedDataService } from '../../services/shared-data.service';


// Alertas
import Swal from 'sweetalert2';

// Notificaciones
import { ToastrService } from 'ngx-toastr';

// Modelos
import { Evento } from 'src/app/models/eventos.model';
import { Punto } from 'src/app/models/puntos.model';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FechaService } from '../../services/fecha.service';
import { Subscription } from 'rxjs';
import { SharedHijoPadreService } from '../../services/shared-hijo-padre.service';


// Interfaces
interface EstadoEvento {
  label: string;
  value: string;
}

interface EstadoAgenda {
  name: string;
  key: string;
}

interface EstadoAlcance {
  name: string;
  key: string;
}

// Utilizando jquery
declare var JQuery: any;
declare var $: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, OnDestroy {

  public enlaceCompartir: string = 'https://gobernaciondecochabamba.bo';
  public enlaceCompartirSeguro!: SafeUrl;


  // public events!: any[]

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

  public alcanceEvento: EstadoEvento[] = [
    { label: 'Privado', value: 'Privado' },
    { label: 'Publico', value: 'Publico' },
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

  // Para controlar botones  de roles
  public isButtonDisabled: boolean = false;

  // Bandera para mostrar el agregar puntos
  public bandAgregarPunto: boolean = true;

  // Estado color evento
  public colorEstadoEvento!: string;

  // Boton concluido
  public estadoConcluido: boolean = true;

  public dataAgenda: any = [];

  public fechaInvalida: boolean = true;

  public fechaModificar!: string;

  // public estadoAgenda: EstadoAgenda[] = [
  //   { name: 'Abierto', key: 'Abierto' },
  //   { name: 'Cerrado', key: 'Cerrado' }
  // ];

  // public estadoAlcance: EstadoAlcance[] = [
  //   { name: 'Privado', key: 'Privado' },
  //   { name: 'Publico', key: 'Publico' }
  // ];

  public estadoAlcance: string[] = ['Privado', 'Publico'];
  public estadoAgenda: string[] = ['Abierto', 'Cerrado'];

  // Estado del evento publico y privado
  public privadoPublico: boolean = false;

  public fechaActual!: any;

  private subscription!: Subscription;

  private subscriptionHijo!: Subscription;
  private subscriptionHijoUpdate!: Subscription;
  private subscriptionHijoShared!: Subscription;

  public controlarMiAgenda: any[] = [];

  constructor(
    private fb: FormBuilder,
    private eventosServices: EventoService,
    private puntosServices: PuntosService,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private sharedDataServices: SharedDataService,
    private miAgendaServices: MiagendaService,
    private fechaServices: FechaService,
    private sharedHijoPadreServices: SharedHijoPadreService
  ) {

    // Aqui respondemos a la accion del hijo
    this.subscriptionHijo = this.sharedHijoPadreServices.accionRealizada$.subscribe(() => {
      // Lógica para responder a la acción del hijo
      this.indexAgenda('normal');
      this.indexEventos();

    });

    // Aqui respondemos a la accion del hijo Update
    this.subscriptionHijoUpdate = this.sharedHijoPadreServices.updateMiAgenda$.subscribe((id: number) => {

      this.mostrarDatosAgenda(id);

    })


    // Aqui respondemos a la accion del hijo - accion compartir
    this.subscriptionHijoShared = this.sharedHijoPadreServices.sharedMiAgenda$.subscribe((id: number) => {

      console.log(id);

      this.eventosServices.showEvento(id)
        .subscribe({
          next: (resp => {
            const { evento } = resp;
            this.newEventCreate = evento;
            this.compartirEnWhatsApp();

          })
        })

    })

    this.enlaceCompartirSeguro = this.sanitizer.bypassSecurityTrustUrl(this.enlaceCompartir);

  }

  ngOnInit(): void {

    // Actualizacion de estado a concluido
    this.subscription = this.fechaServices.obtenerFecha().subscribe((fecha) => {
      this.fechaActual = fecha;
      // console.log(this.fechaActual);

      if (this.fechaActual?.hora === '00:00:01') {

        this.eventosServices.cambiarEstado()
          .subscribe(resp => {
            // console.log(resp);
          })
      }
    });

    this.scrollToTop();
    this.crearFormulario();
    this.crearFormularioModificarEvento();
    this.indexAgenda('normal');

    const user = localStorage.getItem('access');
    if (user) {
      const { identity } = JSON.parse(user);
      this.usuario = identity.sub;
    }

  }

  /**
 * crearFormulario
 */
  public crearFormulario() {

    // Formulario par crear un evento
    this.formulario = this.fb.group({
      evento: ['', Validators.compose([Validators.required, Validators.maxLength(150)])],
      lugar_evento: ['', Validators.compose([Validators.required, Validators.maxLength(150)])],
      fecha_hora_evento: ['', Validators.compose([Validators.required])],
      estado: ['', Validators.compose([Validators.required])],
      alcance: ['', Validators.compose([Validators.required])],
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

  get estado() {
    return this.formulario.get('estado');
  }


  get etiqueta() {
    return this.formulario.get('etiqueta');
  }

  get alcance() {
    return this.formulario.get('alcance');
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
      eventoM: ['', Validators.compose([Validators.required, Validators.maxLength(150)])],
      lugar_eventoM: ['', Validators.compose([Validators.required, Validators.maxLength(150)])],
      fecha_hora_eventoM: ['', Validators.compose([Validators.required])],
      etiquetaM: ['', Validators.compose([Validators.required])],
      estadoM: ['', Validators.compose([Validators.required])],
      alcanceM: ['', Validators.compose([Validators.required])],
    });

    // Formulario par crear un evento
    this.formularioModificarPuntos = this.fb.group({

      puntosM: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],

    });

  }

  // Para crear eventos MODIFICAR
  get eventoM() {
    return this.formularioModificarEvento.get('eventoM');
  }

  get lugar_eventoM() {
    return this.formularioModificarEvento.get('lugar_eventoM');
  }

  get fecha_hora_eventoM() {
    return this.formularioModificarEvento.get('fecha_hora_eventoM');
  }

  get etiquetaM() {
    return this.formularioModificarEvento.get('etiquetaM');
  }

  // Para crear Puntos del evento
  get estadoM() {
    return this.formularioModificarEvento.get('estadoM') as FormArray;
  }

  // Para crear Puntos del evento
  get alcanceM() {
    return this.formularioModificarEvento.get('alcanceM') as FormArray;
  }


  // Para crear Puntos del evento
  get puntosM() {
    return this.formularioPuntos.get('puntosM') as FormArray;
  }

  /**
   * Registrar nuevo evento
   */
  public submit() {


    const fechaEvento = new Date(this.formulario.value.fecha_hora_evento);
    const fechaActual = new Date();
    this.fechaInvalida = fechaEvento >= fechaActual;
    if (this.fechaInvalida) {

      const formData = {
        evento: this.formulario.value.evento,
        lugar_evento: this.formulario.value.lugar_evento,
        fecha_hora_evento: this.formulario.value.fecha_hora_evento,
        estado: this.formulario.value.estado,
        alcance: this.formulario.value.alcance,
        etiqueta: this.formulario.value.etiqueta,
        users_id: this.usuario,
      }

      // console.log(formData);

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

              switch (this.newEventCreate.estado) {
                case 'Abierto':
                  this.colorEstadoEvento = 'text-success';
                  this.estadoConcluido = true;
                  break;
                case 'Cerrado':
                  this.colorEstadoEvento = 'text-indigo';
                  this.estadoConcluido = true;
                  break;

                case 'Concluido':
                  this.colorEstadoEvento = 'text-danger';
                  this.estadoConcluido = false;
                  break;

                default:
                  this.colorEstadoEvento = 'text-purple';
                  break;
              }


              const { nombres, paterno } = this.newEventCreate.user;

              this.nombreUserPunto = `${nombres}`;

              this.idEventoGlobal = evento.id;

              this.indexEventos();

              this.mostrarTabla = false;

              this.mostrarTablaPuntos = false;

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

    } else {
      Swal.fire({
        icon: 'error',
        text: 'La fecha y hora es anterior a la actual.!',
      })
    }


  }

  /**
  * Registrar nuevos puntos para un evento
  */
  public submitPuntos(formDirectivePuntos: FormGroupDirective) {

    let formData: any;

    if (this.usuario === this.newEventCreate.users_id) {
      formData = {
        puntos: this.formularioPuntos.value.puntos,
        eventos_id: this.idEventoGlobal,
        users_id: this.usuario,
        original: 'si'
      }
    } else {
      formData = {
        puntos: this.formularioPuntos.value.puntos,
        eventos_id: this.idEventoGlobal,
        users_id: this.usuario,
        original: 'no'
      }
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

          this.controlarMiAgenda = evento;

          // Angular-calendar
          this.calendarOptions = {
            initialView: 'dayGridMonth',
            plugins: [dayGridPlugin],
            events: evento.map((evento: any) => {

              if (evento.alcance === 'Privado' && evento.users_id === this.usuario) {
                return {
                  title: evento.evento,
                  date: evento.fecha_hora_evento.slice(0, 10),
                  color: evento.etiqueta,
                  publicId: evento.id
                };
              } else if (evento.alcance === 'Publico') {
                return {
                  title: evento.evento,
                  date: evento.fecha_hora_evento.slice(0, 10),
                  color: evento.etiqueta,
                  publicId: evento.id
                };
              } else {
                return null;
              }

            })
              .filter((evento: any) => evento !== null), // Eliminamos los elementos null generados por eventos no importantes

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



    this.privadoPublico = false;

    this.mostrarTablaPuntos = true;

    this.puntosCreados = [];
    this.indexEventos();
    this.formulario.reset();
  }

  // handleDateClick(arg: DateClickArg) {
  //   console.log(arg);
  // }

  public handleEventClick(arg: EventClickArg) {

    // Id del evento con su alias
    const { publicId: idEvento } = arg.event._def.extendedProps;


    this.mostrarDatosAgenda(idEvento);


  }

  /**
   * mostrarDatosAgenda
   */
  public mostrarDatosAgenda(idEvento: number) {
    this.eventosServices.showEvento(idEvento)
      .subscribe({
        next: ({ evento }) => {

          this.scrollToTop();

          this.indexAgenda('fromCalendar');

          // Fecha
          const dateString = evento.fecha_hora_evento;
          this.fechaEventoGlobal = dateString.substring(0, 10);

          // Hora
          const timeString = evento.fecha_hora_evento;
          this.horaEventoGlobal = timeString.split('T')[1];

          this.newEventCreate = evento;

          switch (this.newEventCreate.estado) {
            case 'Abierto':
              this.colorEstadoEvento = 'text-success';
              this.estadoConcluido = true;
              break;
            case 'Cerrado':
              this.colorEstadoEvento = 'text-indigo';
              this.estadoConcluido = true;
              break;

            case 'Concluido':
              this.colorEstadoEvento = 'text-danger';
              this.estadoConcluido = false;
              break;

            default:
              this.colorEstadoEvento = 'text-purple';
              break;
          }


          // console.log('Usuario', this.usuario);

          const { nombres, paterno, id } = evento.user;
          // console.log('eventoID', id);


          if (this.newEventCreate.estado === 'Cerrado' && this.usuario === id) {

            // console.log('1');

          } else if (this.newEventCreate.estado === 'Cerrado' && this.usuario != id) {

            this.bandAgregarPunto = false;
            // console.log('2');


          } else if (this.newEventCreate.estado === 'Abierto' && this.usuario === id) {

            this.bandAgregarPunto = true;
            // console.log('3');

          } else if (this.newEventCreate.estado === 'Abierto' && this.usuario != id) {
            this.bandAgregarPunto = true;
            // console.log('4');
          }



          this.nombreUserPunto = `${nombres}`;

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

  // Se dirige hacia mi agenda
  public miAgenda() {
    this.scrollToTop();
    this.indexAgenda('normal');
    this.btnNewEvent = true;
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

    const fechaEvento = new Date(this.formularioModificarEvento.value.fecha_hora_eventoM);
    const fechaActual = new Date();
    this.fechaInvalida = fechaEvento >= fechaActual;


    const formData: Evento = {
      evento: this.formularioModificarEvento.value.eventoM,
      lugar_evento: this.formularioModificarEvento.value.lugar_eventoM,
      fecha_hora_evento: this.formularioModificarEvento.value.fecha_hora_eventoM,
      etiqueta: this.formularioModificarEvento.value.etiquetaM,
      alcance: this.formularioModificarEvento.value.alcanceM,
      estado: this.formularioModificarEvento.value.estadoM
    }

    this.btnSave = false;

    this.eventosServices.updateEvento(formData, this.idEventoModificar)
      .subscribe({

        next: ({ status, message, evento }) => {
          if (status === 'success') {
            $('#myModal_editar_evento').modal('hide');

            // Actualiza el calendario
            this.indexEventos();

            // Fecha
            const dateString = evento.fecha_hora_evento;
            this.fechaEventoGlobal = dateString.substring(0, 10);

            // Hora
            const timeString = evento.fecha_hora_evento;
            this.horaEventoGlobal = timeString.split('T')[1];


            // Actualiza la tabla
            this.newEventCreate = evento;

            switch (this.newEventCreate.estado) {
              case 'Abierto':
                this.colorEstadoEvento = 'text-success';
                this.estadoConcluido = true;
                break;
              case 'Cerrado':
                this.colorEstadoEvento = 'text-indigo';
                this.estadoConcluido = true;
                break;

              case 'Concluido':
                this.colorEstadoEvento = 'text-danger';
                this.estadoConcluido = false;
                break;

              default:
                this.colorEstadoEvento = 'text-purple';
                break;
            }

            // Actualiza la tabla de puntos
            this.indexPuntos(evento.id);

            this.toastr.success(`${message}`, '¡Modificación Correcta!');
            this.cancelarModificarEvento(formDirectiveModificarEvento);
          } else {
            Swal.fire({
              icon: 'error',
              text: `${message}`,
            })
          }

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
            estadoM: this.dataShowEvento.estado,
            alcanceM: this.dataShowEvento.alcance
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
                this.indexAgenda('normal');

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
  public destroyPunto(id: number, eventos_id: number, users_id: number) {


    this.puntosServices.destroyPunto(id)
      .subscribe({
        next: ({ status, message }) => {

          // console.log(this.newEventCreate);

          if (status === 'success') {
            // console.log(status);

            this.puntosServices.indexPuntos(eventos_id)
              .subscribe({
                next: ({ puntos }) => {

                  // Filtrar por id y estado
                  const filteredData = puntos.filter((item: any) => item.users_id === users_id && item.evento.id === eventos_id);


                  if (filteredData.length === 0 && this.newEventCreate.users_id != this.usuario) {

                    const formData = {
                      eventos_id: eventos_id,
                      users_id: users_id
                    }



                    this.miAgendaServices.destroyAgenda(formData)
                      .subscribe({
                        next: ({ message }) => {
                          console.log(message);
                        }
                      })

                  }

                  this.indexPuntos(eventos_id);
                  this.toastr.error(message, 'Agenda institucional-GADC');

                }
              })
          }
        },
        error: (err) => {
          Swal.fire('Error', err.error.message, 'error')
        }
      });
  }

  /**
   * indexAgenda
   */
  public indexAgenda(opcion: string) {


    let users_id: number = 0;

    const user = localStorage.getItem('access');

    if (user) {
      const { identity } = JSON.parse(user);
      users_id = identity.sub;
    }

    this.miAgendaServices.showAgenda(users_id)
      .subscribe({
        next: ({ agenda }) => {

          // Carga de datos en shared-data agenda
          this.sharedDataServices.setAgenda$(agenda);


          // Filtrar por id y estado
          const filteredData = agenda.filter((item: any) => item.users_id === this.usuario && item.evento.estado != 'Concluido');

          this.dataAgenda = filteredData;

          if (this.dataAgenda.length === 0 && opcion != 'fromCalendar') {
            this.btnNewEvent = true;
          }


        },
        error: (err) => {
          Swal.fire('Error', err.error.message, 'error')
        }
      })
  }

  public validarFecha() {

    const fechaEvento = new Date(this.formulario.value.fecha_hora_evento);
    const fechaActual = new Date();
    this.fechaInvalida = fechaEvento >= fechaActual;
    // console.log(this.fechaInvalida);

  }

  /**
   * onEstadoRadioButtonChange
   */
  public onEstadoRadioButtonChange(event: any) {

    const { value: name } = event;

    switch (name) {
      case 'Privado':
        this.privadoPublico = false;
        this.formulario.get('estado')?.reset();
        this.formulario.patchValue({ estado: 'Cerrado' });

        break;
      case 'Publico':
        this.privadoPublico = true;
        this.formulario.patchValue({ estado: 'Abierto' });
        break;
      default:
        this.privadoPublico = false;
        break;
    }

  }

  // Compatir por whatsap
  public compartirEnWhatsApp() {

    console.log(this.newEventCreate);


    // Fecha
    const dateString = this.newEventCreate?.fecha_hora_evento;
    const fechaEvento = dateString.substring(0, 10);

    // Hora
    const timeString = this.newEventCreate?.fecha_hora_evento;
    const horaEvento = timeString.split('T')[1];

    let puntos: string = '';

    this.puntosCreados.forEach((element, index) => {

      puntos = puntos + `*${index + 2}.-* ${element.puntos}\n`;

    });

    const mensaje = '*Reunión programada - GADC*';
    const tema = `*Tema:* ${this.newEventCreate?.evento}`;
    const lugar = `*Lugar:* ${this.newEventCreate?.lugar_evento}`;
    const fecha = `*Fecha y hora:* 📅 ${fechaEvento} | ⏰ ${horaEvento}`;
    const tituloPuntos = `*Puntos a tratar*`;
    const primerPunto = `*1.-* ${this.newEventCreate?.evento}`;
    const mensajeCompleto = mensaje + '\n' + tema + '\n' + lugar + '\n' + fecha + '\n' +
      tituloPuntos + '\n' + primerPunto + '\n' + puntos + '\n';
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensajeCompleto)}`;
    window.open(url);




  }

  // Es importante esto para destruir suscripciones
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionHijo.unsubscribe();
    this.subscriptionHijoUpdate.unsubscribe();
    this.subscriptionHijoShared.unsubscribe();
  }

}



