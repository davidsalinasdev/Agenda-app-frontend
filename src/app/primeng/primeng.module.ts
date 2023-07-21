import { NgModule } from '@angular/core';
// PrimeNG
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    exports: [
        CalendarModule,
        InputTextModule,
        ColorPickerModule,
        ProgressSpinnerModule,
        DropdownModule
    ]
})
export class PrimengModule { }