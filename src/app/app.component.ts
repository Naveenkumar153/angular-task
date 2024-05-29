import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { INgxSelectOption } from 'ngx-select-ex';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from './api.service';
import { Subject, takeUntil } from 'rxjs';
import { CountriesApiResponse, CountryData, Customers, DataSource } from './interface/api.interface';
import { LocalStorageService } from './service/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[LocalStorageService],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();


  

  public dataSource: DataSource[] = []
  
  public collaborators!: any[];

  openCustomerModal:{ display:string } = {
    display: '',
  };

  openPinsModel:{ display:string } = {
    display: '',
  };


    constructor(
      private fb:FormBuilder,
      private apiService:ApiService,
      private localStorage:LocalStorageService,
      private cdRef:ChangeDetectorRef
    ) {
      
    };

    ngOnInit(): void {
      this.dataSource = this.localStorage.getStorage('dataSource') || [];
      this.updatedDataSource([]);
    }

    openCustomerModalDialog() {
      this.openCustomerModal = {
        display: 'block',
      }
    };

    openPinsModalDialog(){
      this.openPinsModel = {
        display: 'block',
      }
    };
    

    updatedFormCustomers(data:Customers[] = []){
      this.collaborators = data
    }

    updatedDataSource(data:DataSource[] = []){
      if(data.length){
        setTimeout(() => {
          console.log(this.localStorage.getStorage('dataSource'))
          this.dataSource = JSON.parse(JSON.stringify(data)) || [];
          this.cdRef.detectChanges();
        });
      }
    };

    ngOnDestroy(): void {
    }

}
