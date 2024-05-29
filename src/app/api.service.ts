import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CountriesApiResponse } from './interface/api.interface';
import { environment } from 'src/environments/environment';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  BASE_URL:string = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { };


  getCountries():Observable<CountriesApiResponse> {
    return this.http.get<CountriesApiResponse>(`${this.BASE_URL}/countries`);
  };


  markAllAsTouched(form:FormGroup) {
    Object.values(form.controls).forEach((control:AbstractControl) => {
      control.markAsTouched();
    });
  }
  

}
