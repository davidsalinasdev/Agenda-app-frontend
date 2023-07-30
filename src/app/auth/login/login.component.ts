import { Component, OnInit } from '@angular/core';

// Para utilizar formularios reactivos
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Motras ntificaciones en tarjetas
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
// import Toastify from 'toastify-js';

// Para navegar de una pagina a otra
import { Router } from '@angular/router';

// Servicios
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public cargando = false;

  // Formularios
  public formulario!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioServices: UsuariosService,
    private toastr: ToastrService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void { }

  /**
   * crearFormulario
   */
  public crearFormulario() {
    this.formulario = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  // Validaciones para formulario
  get user() {
    return this.formulario.get('user');
  }
  get password() {
    return this.formulario.get('password');
  }

  /**
   * login de Usuarios
   */
  public login() {

    // Spinner de ingresando al sistema
    this.cargando = true;
    // console.log(this.formulario.value);


    this.usuarioServices.login(this.formulario.value)
      .subscribe(resp => {

        this.cargando = false;
        if ((resp.status === 'success') && (resp.identity.estado === 'Habilitado')) {
          this.router.navigateByUrl('/inicio');

          // Carga del estado de usuario al localstorage
          localStorage.setItem('access', JSON.stringify(resp));


          this.toastr.success(`${resp.identity.nombres}`, 'Bienvenid@', {
            positionClass: 'toast-top-right'
          });

          // this.messageService.add({ severity: 'success', summary: 'Bienvenid@', detail: `${resp.identity.nombres} ${resp.identity.paterno}` });

          // Toastify({
          //   text: "This is a toast with offset",
          //   offset: {
          //     x: 50, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
          //     y: 10 // vertical axis - can be a number or a string indicating unity. eg: '2em'
          //   },
          // }).showToast();


        } else {
          this.cargando = false;
          Swal.fire({
            icon: 'error',
            title: 'Credenciales incorrectas..!',
            text: 'Vuelva a intentarlo!',
            footer: 'Gobierno Autónomo Departamental de Cochabamba'
          })
        }
      }, (err) => {
        this.cargando = false;
        console.log(err);
        Swal.fire('Error', err.error.message, 'error')
      });
  }

}
