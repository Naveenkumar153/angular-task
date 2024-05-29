export interface CountryData {
    country: string;
    region: string;
  }
  
  interface ResponseData {
    [key: string]: CountryData;
  }
  
export  interface CountriesApiResponse {
    status: string;
    "status-code": number;
    version: string;
    access: string;
    data: ResponseData;
};

export interface Customers{
   name:string;
   email:string;
   country:string[];
   region:string[];
}
  