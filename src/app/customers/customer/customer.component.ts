import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { INgxSelectOption } from 'ngx-select-ex';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { CountriesApiResponse, CountryData, Customers } from 'src/app/interface/api.interface';
import { LocalStorageService } from 'src/app/service/local-storage.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  providers:[LocalStorageService]
})
export class CustomerComponent implements OnInit, OnChanges, OnDestroy {
  
  private unsubscribe$: Subject<void> = new Subject<void>();

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


  @Input() openModel:{ display:string } = {
    display: '',
  };

  @Output() updatedDataSource: EventEmitter<Customers[]> = new EventEmitter();


  displayModel = 'block';

    constructor(
      private fb:FormBuilder,
      private apiService:ApiService,
      private localStorage:LocalStorageService,
    ) {
      
    };

    ngOnInit(): void {
      this.getCountriesAndRegions();
    };

    ngOnChanges(changes: SimpleChanges): void { }


    onSubmit() {
      if (this.customerForm.valid) {
        const customers:Customers[] = this.localStorage.getStorage('customers') || [];
        const email = this.customerForm.value.email;
        const isEmailUnique = customers.every(customer => customer.email !== email);
        if (isEmailUnique) {
          customers.push(this.customerForm.value);
          this.localStorage.setStorage('customers', customers);
          this.updatedDataSource.emit(this.localStorage.getStorage('customers'));
          this.customerForm.reset();
        } else {
          this.customerForm.controls['email'].setErrors({'duplicate': true});
        }
        this.openModel.display = 'none';
      } else {
          this.markAllAsTouched(this.customerForm);
      }
    };

    markAllAsTouched(form:FormGroup) {
      Object.values(form.controls).forEach((control:AbstractControl) => {
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

      this.customerForm.get('country')?.setValue([]);
      this.countrysNgxValue = [];
    }

    doSelectOptionsCountrys(options:  INgxSelectOption[]) {};

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
    };

    ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }

}
