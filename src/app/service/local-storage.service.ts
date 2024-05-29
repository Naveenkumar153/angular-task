import { Injectable } from '@angular/core';

@Injectable()

export class LocalStorageService {

  constructor() { }

  setStorage(key: any, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getStorage(key: any): any | null {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  removeStorage(key:any):void{
    localStorage.removeItem(key);
  }

  clearStorage():void{
    localStorage.clear();
  }
}
