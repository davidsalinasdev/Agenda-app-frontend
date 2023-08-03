import { NgModule } from '@angular/core';
// PrimeNG
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
    exports: [
        CalendarModule,
        InputTextModule,
        ColorPickerModule,
        ProgressSpinnerModule,
        DropdownModule,
        CardModule,
        CheckboxModule,
        RadioButtonModule
    ]
})
export class PrimengModule { }