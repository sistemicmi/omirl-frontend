import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Session } from 'inspector';
import { ConstantsService } from './constants.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})

export class ChartService {

  //TODO FIX type
  charts:Map<string,any> = new Map()

  constructor(
    private http:HttpClient,
    private constantsService:ConstantsService,
    private session: SessionService) {
    
  }

  setChart  = (sCode: string, oChart: any) => {

    this.charts.set(sCode, oChart)
  }

  // addChart  = (sCode: string, oChart: any) => {
  //   var chartReference = {};

  //   chartReference.sCode = sCode;
  //   chartReference.oChart = oChart;

  //   this.charts.push(chartReference);
  // }

  getChart = (sCode: string) => {
    return this.charts.get(sCode)
  }

  removeChart = (sCode: string) => {
    this.charts.delete(sCode)
  }

  getStationChart = (sensorCode: string, chart: string) => {
    // if ( chart == 'Vento'){
    //   //chart = 'Vento2';
    //   chart = 'Vento';
    // }else {
    //   if ( chart == 'Vento2'){
    //     chart = 'Vento2';
    //   }
    // }

    let sAPIURL = this.constantsService.apiURL;
    let headers = this.session.prepareHeaders()

    if (headers) {

      return this.http.get(sAPIURL + '/charts/'+sensorCode+'/'+chart, {headers: headers});
    } else {

      return this.http.get(sAPIURL + '/charts/'+sensorCode+'/'+chart);
    }
  }

  getSectionChart = (sectionCode: string, model: string, subFolder: string = '') => {
    let sAPIURL = this.constantsService.apiURL;
    let headers = this.session.prepareHeaders()

    if (headers) {

      return this.http.get(sAPIURL + '/charts/sections/'+ sectionCode+'/'+ model, {headers: headers});
    } else {

      return this.http.get(sAPIURL + '/charts/sections/'+ sectionCode+'/'+ model);
    }
  }
}
