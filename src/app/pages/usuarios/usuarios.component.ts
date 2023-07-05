import { Component, OnInit } from '@angular/core';


import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Servicios
import { UsuariosService } from 'src/app/services/usuarios.service';

// Alertas
import Swal from 'sweetalert2';

// Notificaciones
import { ToastrService } from 'ngx-toastr';

// Modelos
import { ServidorInterface } from 'src/app/models/servidor.model';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';


// Utilizando jquery
declare var JQuery: any;
declare var $: any;

// Interface tipo de usuario
interface TipoUsuario {
  value: string;
  viewValue: string;
}

interface EstadoServidor {
  value: string;
  estado: string;
}

// Prueba
export interface RolUsuario {
  value: string;
  roles: string;
}
// FIN PRUEBA


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  // Información de usuario de sistema
  public usuario: any;
  public token: any;
  public rol: any;

  public tipoUsuario: TipoUsuario[] = [
    { value: 'funcionario', viewValue: 'Funcionario publico' },
    { value: 'minero', viewValue: 'Minero' },
    { value: 'agente', viewValue: 'Agente de retención' },
  ];

  // Formularios reactivos
  public formulario!: FormGroup;
  public formularioModificar!: FormGroup;
  public formularioSearch!: FormGroup;

  // Para deshabilitar el boton de guardar
  public btnSave: boolean = true;

  public estados: EstadoServidor[] = [
    { value: 'habilitado', estado: 'Habilitado' },
    { value: 'no habilitado', estado: 'No habilitado' }
  ];

  public roles: RolUsuario[] = [
    { value: 'Administrador', roles: 'Administrador' },
    { value: 'Funcionario', roles: 'Funcionario' }
  ]

  public idServidor!: number;

  // loading para atributo [hidden]
  // [hidden]= true  -> oculta el contenido
  public cargando: boolean = true;

  // Mejorar el performance de la busqueda
  private OnDestroy$ = new Subject();
  public searchTerm$ = new Subject<string>();



  public dataServidores!: ServidorInterface[];

  // Paginación
  public current_page: any;
  public first_page_url: any;
  public from: any;
  public last_page: any;
  public last_page_url: any;
  public next_page_url: any;
  public path: any
  public per_page: any;
  public prev_page_url: any;
  public to: any
  public total: number = 0;
  public p: number = 1;
  // Fin Paginación


  // Limpiar input buscador
  public searchTerm: string = '';


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private usuarioServices: UsuariosService
  ) { }

  ngOnInit(): void {

    this.eliminarLocalStorage();

    this.crearFormulario();
    this.crearFormularioModificar();
    this.indexServidores();
    // Buscador de servidores publicos
    this.submitSearch();

    // Borrar texto buscar

    const user = localStorage.getItem('access');
    if (user) {
      const { token, identity } = JSON.parse(user);
      this.usuario = identity;
      this.token = token;
      this.rol = identity.rol;
    }

  }

  /**
  * crearFormulario
  */
  public crearFormulario() {
    this.formulario = this.fb.group({
      nombres: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(50)])],
      paterno: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(50)])],
      materno: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(50)])],
      user: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      password: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      roluser: ['', Validators.compose([Validators.required])],

    });
  }
  get nombres() {
    return this.formulario.get('nombres');
  }

  get paterno() {
    return this.formulario.get('paterno');
  }

  get materno() {
    return this.formulario.get('materno');
  }

  get user() {
    return this.formulario.get('user');
  }

  get password() {
    return this.formulario.get('password');
  }

  get roluser() {
    return this.formulario.get('roluser');
  }


  /**
  * crearFormularioModificar
  */
  public crearFormularioModificar() {
    this.formularioModificar = this.fb.group({
      nombresM: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(50)])],
      paternoM: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(50)])],
      maternoM: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(50)])],
      userM: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      estadoM: ['', Validators.compose([Validators.required])],
      roluserM: ['', Validators.compose([Validators.required])],
    });
  }

  get nombresM() {
    return this.formulario.get('nombresM');
  }

  get paternoM() {
    return this.formulario.get('paternoM');
  }

  get maternoM() {
    return this.formulario.get('maternoM');
  }

  get userM() {
    return this.formulario.get('userM');
  }

  get estadoM() {
    return this.formulario.get('estadoM');
  }

  get roluserM() {
    return this.formulario.get('roluserM');
  }

  /**
   * Registrar nuevo usuario
   */
  public submit() {

    this.btnSave = false;
    this.cargando = true;

    console.log(this.formulario.value);
    this.usuarioServices.storeServidoresPublicos(this.formulario.value)
      .subscribe({
        next: ({ status, message }) => {
          if (status === 'success') {

            this.eliminarLocalStorage();

            $('#myModal_crear_servidor').modal('hide');
            this.indexServidores(); //aqui esta this.cargando = true;
            // Limpiar el campo de búsqueda
            this.searchTerm = '';
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: `${message}`,
              text: 'Sistema de control y fiscalización de regalia minera',
              showConfirmButton: false,
              timer: 2000
            })
          } else {
            this.toastr.error(message, 'Sistema de control y fiscalización de regalia minera');
          }
        },
        error: (err: any) => {
          // console.log(err);
          this.cargando = false;
          this.btnSave = true;

          if (err.error.errors.carnet) {
            Swal.fire('Error', err.error.errors.carnet[0], 'error')
          } else {
            Swal.fire('Error', err.error.message, 'error')
          }

        },
        complete: () => {
          this.btnSave = true;
          this.cargando = false;
        }
      });

  }

  /**
   * indexServidores
   */
  public indexServidores() {

    this.dataServidores = [];
    this.cargando = true;

    // Condicion si es para el textoBuscar
    const textoBuscar = localStorage.getItem('textoBuscar');

    if (textoBuscar != null) {

      const posicion = localStorage.getItem('position');

      const formData: { servidor: string, page: number } = {
        servidor: textoBuscar,
        page: Number(posicion)
      }

      this.cargando = true;
      this.usuarioServices.searchServidoresPublicos(formData)
        .subscribe(({ users }) => {

          const {
            data,
            current_page,
            first_page_url,
            from,
            last_page,
            last_page_url,
            next_page_url,
            path,
            per_page,
            prev_page_url,
            to,
            total
          } = users;

          this.dataServidores = data;

          this.current_page = current_page;
          this.first_page_url = first_page_url;
          this.from = from;
          this.last_page = last_page;
          this.last_page_url = last_page_url;
          this.next_page_url = next_page_url;
          this.path = path;
          this.per_page = per_page;
          this.prev_page_url = prev_page_url;
          this.to = to;
          this.total = total;

          this.p = this.current_page;

          this.cargando = false;

          // Para paginación
          localStorage.setItem('position', `${this.p}`);
          localStorage.setItem('items', `${this.total}`);
        })

    } else {
      let pagina = 1;
      const position = localStorage.getItem('position');
      if (position != null) {
        pagina = Number(position);
      }

      this.usuarioServices.indexServidoresPublicos(pagina)
        .subscribe(({ users }) => {

          const {
            data,
            current_page,
            first_page_url,
            from,
            last_page,
            last_page_url,
            next_page_url,
            path,
            per_page,
            prev_page_url,
            to,
            total
          } = users;

          this.cargando = false;
          this.dataServidores = data;

          this.current_page = current_page;
          this.first_page_url = first_page_url;
          this.from = from;
          this.last_page = last_page;
          this.last_page_url = last_page_url;
          this.next_page_url = next_page_url;
          this.path = path;
          this.per_page = per_page;
          this.prev_page_url = prev_page_url;
          this.to = to;
          this.total = total;

          this.p = current_page;

          // Para paginación
          localStorage.setItem('position', `${this.p}`);
          localStorage.setItem('items', `${this.total}`);

        })
    }


  }

  /**
  * Cargar datos para modificar servidores
  */
  public modificarServidoresPublicos(id: number) {

    this.idServidor = id;

    this.usuarioServices.showServidoresPublicos(id)
      .subscribe(({ users }) => {

        this.formularioModificar.setValue({
          nombresM: users.nombres,
          paternoM: users.paterno,
          maternoM: users.materno,
          userM: users.user,
          estadoM: users.estado,
          roluserM: users.rol

        });

      }, (err) => {
        Swal.fire('Error', err.error.message, 'error')
      });

    $('#myModal_editar_usuario').modal('show');
  }

  /**
  * submitModificar
  */
  public submitModificar() {

    const formData = {
      nombres: this.formularioModificar.value.nombresM,
      paterno: this.formularioModificar.value.paternoM,
      materno: this.formularioModificar.value.maternoM,
      user: this.formularioModificar.value.userM,
      estado: this.formularioModificar.value.estadoM,
      rol: this.formularioModificar.value.roluserM
    }

    this.cargando = true;
    this.btnSave = false;
    this.usuarioServices.updateServidores(formData, this.idServidor)
      .subscribe(({ message }) => {

        $('#myModal_editar_usuario').modal('hide');
        this.indexServidores();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: '¡Modificación Correcta!',
          text: `${message}`,
          showConfirmButton: false,
          timer: 2000
        })

      }, (err) => {
        console.log(err);
        Swal.fire('Error', err.error.message, 'error')
        this.cargando = false;
        this.btnSave = true;
      }, () => {
        this.cargando = false;
        this.btnSave = true;
      });

  }

  /**
* borrarFormulario
*/
  public borrarFormulario(formDirective: FormGroupDirective) {
    this.formulario.reset();
    if (this.formulario.valid || !this.formulario.valid) {
      formDirective.resetForm();
      this.formulario.reset();
    }
  }

  /**
  * destroyPersona
  */
  public destroyServidorPublico(id: number, nombres: string, paterno: string, estado: string) {

    if (estado === 'no habilitado') {
      this.toastr.error('Este servidor ya ha sido deshabilitado', 'Control de relagias mineras')
    } else {
      Swal.fire({
        title: 'Se deshabilitara a:',
        text: `${nombres + ' ' + paterno}`,
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'Cancelar!',
        confirmButtonText: 'Si, deshabilitar!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuarioServices.destroyServidorPublico(id)
            .subscribe(({ status, message }) => {
              if (status === 'success') {
                this.indexServidores();
                Swal.fire(
                  `${nombres + ' ' + paterno}`,
                  `A sido deshabilitado correctamente`,
                  'success'
                );
              }
            }, (err) => {
              this.cargando = false;
              Swal.fire('Error', err.error.message, 'error')
            });
        }
      })
    }
  }


  /**
  * Formulario buscar servidor publico
  */
  public submitSearch() {

    // this.cargandoBuscar = true;
    this.searchTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.OnDestroy$)
    )
      .subscribe(texto => {

        localStorage.setItem('textoBuscar', texto);

        if (texto.length === 0) {
          this.indexServidores();
          localStorage.removeItem('textoBuscar');
        } else {
          const formData: { servidor: string } = {
            servidor: texto
          }
          this.cargando = true;
          this.usuarioServices.searchServidoresPublicos(formData)
            .subscribe(({ users }) => {

              const {
                data,
                current_page,
                first_page_url,
                from,
                last_page,
                last_page_url,
                next_page_url,
                path,
                per_page,
                prev_page_url,
                to,
                total
              } = users;

              this.dataServidores = data;

              this.current_page = current_page;
              this.first_page_url = first_page_url;
              this.from = from;
              this.last_page = last_page;
              this.last_page_url = last_page_url;
              this.next_page_url = next_page_url;
              this.path = path;
              this.per_page = per_page;
              this.prev_page_url = prev_page_url;
              this.to = to;
              this.total = total;

              this.p = this.current_page;

              this.cargando = false;

              // Para paginación
              localStorage.setItem('position', `${this.p}`);
              localStorage.setItem('items', `${this.total}`);
            })
        }
      });
  }

  /**
   * pageChange(event)  
   */
  public pageChange(event: any) {

    this.dataServidores = [];
    this.cargando = true;
    this.p = event;

    // Condicion si es para el textoBuscar
    const textoBuscar = localStorage.getItem('textoBuscar');

    // 
    if (textoBuscar != null) {

      const formData: { servidor: string, page: number } = {
        servidor: textoBuscar,
        page: this.p
      }

      this.cargando = true;
      this.usuarioServices.searchServidoresPublicos(formData)
        .subscribe(({ servidores }) => {

          const {
            data,
            current_page,
            first_page_url,
            from,
            last_page,
            last_page_url,
            next_page_url,
            path,
            per_page,
            prev_page_url,
            to,
            total
          } = servidores;

          this.dataServidores = data;
          console.log(this.dataServidores);


          this.current_page = current_page;
          this.first_page_url = first_page_url;
          this.from = from;
          this.last_page = last_page;
          this.last_page_url = last_page_url;
          this.next_page_url = next_page_url;
          this.path = path;
          this.per_page = per_page;
          this.prev_page_url = prev_page_url;
          this.to = to;
          this.total = total;

          this.p = this.current_page;

          this.cargando = false;

          // Para paginación
          localStorage.setItem('position', `${this.p}`);
          localStorage.setItem('items', `${this.total}`);
        })

    } else {
      const formData: { page: number } = {
        page: this.p
      }
      this.usuarioServices.paginateServidores(formData)
        .subscribe(({ users }) => {

          const {
            data,
            current_page,
            first_page_url,
            from,
            last_page,
            last_page_url,
            next_page_url,
            path,
            per_page,
            prev_page_url,
            to,
            total
          } = users;

          this.dataServidores = data;

          this.current_page = current_page;
          this.first_page_url = first_page_url;
          this.from = from;
          this.last_page = last_page;
          this.last_page_url = last_page_url;
          this.next_page_url = next_page_url;
          this.path = path;
          this.per_page = per_page;
          this.prev_page_url = prev_page_url;
          this.to = to;
          this.total = total;

          this.cargando = false;

          // Para paginación
          localStorage.setItem('position', `${this.p}`);
          localStorage.setItem('items', `${this.total}`);
        })
    }
  }

  /**
    * eliminarLocalStorage
    */
  public eliminarLocalStorage() {
    localStorage.removeItem('textoBuscar');
    localStorage.removeItem('items');
    localStorage.removeItem('position');
  }


}
