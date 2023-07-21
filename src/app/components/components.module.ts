import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Componentes de COMPONENTS
import { FormularioComponent } from './formulario/formulario.component';



@NgModule({
  declarations: [
    FormularioComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FormularioComponent
  ]
})
export class ComponentsModule { }
