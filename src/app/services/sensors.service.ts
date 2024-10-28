import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../omirl-config';
import { Observable } from 'rxjs';
//import { chartData } from 'src/app/components/chart-popup/chart-popup.component.js';



export class SensorsService{

// class-methods ---------------------------------------------------------- //
constructor(private http: HttpClient) {
    this.APIURL = Config.apiURL;
  }
  // ----------------------------------------------------------------------- //

  // props ---------------------------------------------------------------------------------- //
  APIURL: string;
 
        

// methods -------------------------------------------------------------------------------- //
// getSensorbar(): Observable<chartData> {
//     return this.http.get<chartData>(this.APIURL + '/charts/STILA/Pluvio');
// }

 }