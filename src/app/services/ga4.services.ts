import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class Ga4Service {

  constructor() { }

  public event(eventName: string, eventParams: { [key: string]: any }) {

    if (typeof gtag === 'function') {
        gtag('event', eventName, eventParams);
      } else {
        console.warn('gtag function is not available');
      }
  }
}