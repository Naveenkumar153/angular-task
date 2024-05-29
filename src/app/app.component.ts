import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { INgxSelectOption } from 'ngx-select-ex';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './api.service';
import { Subject, takeUntil } from 'rxjs';
import { CountriesApiResponse, CountryData, Customers } from './interface/api.interface';
import { LocalStorageService } from './service/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[LocalStorageService]
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  public displayStyle = "none"; 

  public dataSource: any[] = Array.from({length: 8}, (_, i) => ({
    title: `Project ${String.fromCharCode(65 + i % 5)}`,
    image: `image${i+1}.jpg`,
    collaborators: `${['John', 'Jane', 'Alice', 'Bob', 'Mike'][i % 5]} ${['Doe', 'Smith', 'Brown', 'White', 'Johnson'][i % 5]}`,
    privacy: ['Private', 'Public'][i % 2]
  }));

  public regions: any[] = [];
  public regionsNgxValue: any = [];
  public countrys: any[] = [];
  public countrysNgxValue: any = [];
  private countriesData: { [key: string]: CountryData } = {};

  public customerForm = this.fb.group({
      name:['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      region: [[], Validators.required],
      country: [[], Validators.required]
  });


    constructor(
      private fb:FormBuilder,
      private apiService:ApiService,
      private localStorage:LocalStorageService,
    ) {
      
    };

    ngOnInit(): void {
      this.getCountriesAndRegions();
    }


    onSubmit() {
      if (this.customerForm.valid) {
        const customers:Customers[] = this.localStorage.getStorage('customers') || [];
        const email = this.customerForm.value.email;
        const isEmailUnique = customers.every(customer => customer.email !== email);
        if (isEmailUnique) {
          customers.push(this.customerForm.value);
          this.localStorage.setStorage('customers', customers);
          this.customerForm.reset();
        } else {
          this.customerForm.controls['email'].setErrors({'duplicate': true});
        }
      } else {
        if (this.customerForm.invalid) {
          this.markAllAsTouched();
          return;
        }
      }
    };

    markAllAsTouched() {
      Object.values(this.customerForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }

    processApiResponse(response: CountriesApiResponse): void {
      this.countriesData = response.data;
      this.regions = Array.from(new Set(Object.values(this.countriesData).map(item => item.region)));
    }
  
  
    doSelectOptions(options: INgxSelectOption[]): void {
      const selectedRegions = options.map(option => option.value);
      this.countrys = Object.values(this.countriesData)
        .filter(item => selectedRegions.includes(item.region))
        .map(item => item.country);

      // Reset the country field when region changes
      this.customerForm.get('country')?.setValue([]);
      this.countrysNgxValue = [];
    }

    doSelectOptionsCountrys(options:  INgxSelectOption[]) {
      console.log('MultipleDemoComponent.doSelectOptions', options)    
    };

    getCountriesAndRegions(){
      this.apiService.getCountries()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next:(res:CountriesApiResponse) => {
          this.processApiResponse(res);
        },
        error:(err) => {
          console.error('error', err);
        }
      })
    }



    ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }

}
