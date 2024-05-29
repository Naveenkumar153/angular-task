import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinComponent } from './pin/pin.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PinComponent
  ],
  imports: [
    CommonModule,
    NgxSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[
    PinComponent
  ]
})
export class PinsModule { }
