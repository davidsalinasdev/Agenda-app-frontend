import { Component, OnInit } from '@angular/core';

// Para utilizar formularios reactivos
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Motras ntificaciones en tarjetas
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService,
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
        if ((resp.status === 'success') && (resp.identity.estado === 'habilitado')) {
          this.router.navigateByUrl('/inicio');

          // Carga del estado de usuario al localstorage
          localStorage.setItem('access', JSON.stringify(resp));


          this.toastr.success(`${resp.identity.nombres} ${resp.identity.paterno}`, 'Bienvenid@', {
            positionClass: 'toast-top-right'
          });

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
