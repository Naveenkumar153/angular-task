import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer/customer.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CustomerComponent
  ],
  imports: [
    CommonModule,
    NgxSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    CustomerComponent]
})
export class CustomersModule { }
