import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Componentes de COMPONENTS
import { MiagendaComponent } from './miagenda/miagenda.component';


@NgModule({
  declarations: [

    MiagendaComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MiagendaComponent
  ]
})
export class ComponentsModule { }
