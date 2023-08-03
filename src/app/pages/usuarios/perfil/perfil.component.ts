import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Servicios
import { UsuariosService } from 'src/app/services/usuarios.service';

// Notificaciones
import Swal from 'sweetalert2';

// Utilizando jquery
declare var JQuery: any;
declare var $: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  // Datos de usuario
  public usuario: any;
  public token: any;
  public rol: any;

  // Formularios reactivos
  public formulario!: FormGroup;

  // Para deshabilitar el boton de guardar
  public btnSave: boolean = true;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuariosServices: UsuariosService,
  ) { }

  ngOnInit(): void {

    this.crearFormulario();

    const user = localStorage.getItem('access');
    if (user) {
      const { token, identity } = JSON.parse(user);
      this.usuario = identity;
      this.token = token;
      this.rol = identity.rol;
    }

    // console.log(this.usuario);
    // console.log(this.token);
    // console.log(this.rol);

  }

  /**
* crearFormulario
*/
  public crearFormulario() {
    this.formulario = this.fb.group({
      actualPassword: ['', Validators.compose([Validators.required])],
      nuevoPassword: ['', Validators.compose([Validators.required, this.validatePassword])]
    });
  }

  // Función personalizada para validar la contraseña
  public validatePassword(control: AbstractControl): { [key: string]: boolean } | null {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    const isValid = passwordRegex.test(control.value);
    return isValid ? null : { invalidPassword: true };
  }


  get actualPassword() {
    return this.formulario.get('actualPassword');
  }

  get nuevoPassword() {
    return this.formulario.get('nuevoPassword');
  }


  /**
  * submit
  */
  public submit() {


    const formData = {
      user: this.usuario.usuario,
      password: this.formulario.value.actualPassword
    }

    this.btnSave = false;
    this.usuariosServices.loginChangesPassword(formData)
      .subscribe(({ status }) => {
        if (status === 'success') {

          Swal.fire({
            title: 'Esta seguro de cambiar su contraseña?',
            text: `Si esta de acuerdo debe iniciar sesión nuevamente`,
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Cancelar!',
            confirmButtonText: 'Si, cambiar'
          }).then((result) => {
            if (result.isConfirmed) {

              const nuevaContraseña = {
                idUsuario: this.usuario.sub,
                password: this.formulario.value.nuevoPassword
              }

              console.log(nuevaContraseña);


              this.usuariosServices.updateChangesPassword(nuevaContraseña)
                .subscribe(resp => {
                  $('#myModal_changes_pass').modal('hide');
                  // localStorage.removeItem('position');
                  // localStorage.removeItem('items');
                  localStorage.removeItem('token');
                  localStorage.removeItem('access');
                  localStorage.removeItem('ultimoClic');
                  this.router.navigateByUrl('/login');
                  Swal.fire(
                    'La contraseña se cambio correctamente!',
                    'Inicie sesión nuevamente',
                    'success'
                  )
                });
            }
          })
        } else {
          Swal.fire('Error', 'La credencial actual es incorrecta..', 'error')
        }

      }, (err) => {
        console.log(err);
        Swal.fire('Error', err.error.message, 'error')
        this.btnSave = true;
      }, () => {
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

}
