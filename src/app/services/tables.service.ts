import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../../omirl-config';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { IStation } from 'src/app/services/station.service';
import { SessionService } from './session.service';
import { formatDate } from '@angular/common';
import { ConstantsService } from './constants.service';

export interface IModelsRow {
  color: number;
  orderNumber: number;
  sectionCode: string;
  sectionName: string;
}

export interface IModelsResponse {
  basinName: string;
  orderNumber: number;
  sectionBasinsCodes: IModelsRow[];
}

export interface IAlertzonesRow {
  basin: string;
  code: string;
  date24HMax: string;
  dateRef: string;
  district: string;
  municipality: string;
  river: string;
  station: string;
  valueOnDate24HMax: number;
  valueOnDateRef: number;
  warnArea: string;
}

export interface IAlertzonesResponse {
  alertZonesA: IAlertzonesRow[];
  alertZonesB: IAlertzonesRow[];
  alertZonesC: IAlertzonesRow[];
  alertZonesCLess: IAlertzonesRow[];
  alertZonesCPlus: IAlertzonesRow[];
  alertZonesD: IAlertzonesRow[];
  alertZonesE: IAlertzonesRow[];
  alertZonesM: IAlertzonesRow[];
  updateDateTime: string;
}

export interface ITempSummaryRow {
  description: string;
  max: number;
  min: number;
  refDateMax: string;
  refDateMin: string;
  stationMax: string;
  stationMin: string;
}
export interface IWindSummaryRow {
  description: string;
  gust: number;
  max: number;
  refDateGust: string;
  refDateWind: string;
  stationGust: string;
  stationMax: string;
}
export interface ISummaryResponse {
  alertInfo: ITempSummaryRow[];
  districtInfo: ITempSummaryRow[];
  updateDateTime: string;
  windInfo: IWindSummaryRow[];
}

export interface IMaxRow {
  h1: string;
  h1BkColor: string;
  h1code: string;
  h1val: string;
  h3: string;
  h3BkColor: string;
  h3code: string;
  h3val: string;
  h6: string;
  h6BkColor: string;
  h6code: string;
  h6val: string;
  h12: string;
  h12BkColor: string;
  h12code: string;
  h12val: string;
  h24: string;
  h24BkColor: string;
  h24code: string;
  h24val: string;
  m5: string;
  m5BkColor: string;
  m5code: string;
  m5val: string;
  m15: string;
  m15BkColor: string;
  m15code: string;
  m15val: string;
  m30: string;
  m30BkColor: string;
  m30code: string;
  m30val: string;
  name: string;
}

export interface IMaxResponse {
  alertZones: IMaxRow[];
  districts: IMaxRow[];
  generationDate: string;
  updateDateTime: string;
}

export interface ISensorsRow {
  area: string;
  basin: string;
  code: string;
  district: string;
  last: number;
  max: number;
  min: number;
  municipality: string;
  name: string;
  underbasin: string;
}

export interface ISensorsResponse {
  sensorTye: string;
  tableRows: ISensorsRow[];
  updateDateTime: string;
}

export interface ITableLink {
  active: boolean;
  code: string;
  description: string;
  imageLinkOff: string;
  isActive: boolean;
  location: string;
}

export interface ISensorType {
  imageLinkOff?: string;
  code: string;
  description: string;
}

export interface IHydroModelsType {
  code: string;
  description: string;
  iconLink: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  // class-methods ---------------------------------------------------------- //
  constructor(
    private http: HttpClient,
    private session: SessionService,
    private constantsService: ConstantsService,
    @Inject(LOCALE_ID) protected localeId: string
  ) {
    this.APIURL = this.constantsService.apiURL;
  }
  // ------------------------------------------------------------------------ //

  // props ---------------------------------------------------------------------------------- //
  APIURL: string;
  // ---------------------------------------------------------------------------------------- //

  // methods -------------------------------------------------------------------------------- //
  getSensorsTable(sensor: string): Observable<ISensorsResponse> {
    return this.http.get<ISensorsResponse>(
      this.APIURL + '/stations/sensorvalues/' + sensor,
      {
        headers: this.session.prepareHeaders(),
      }
    );
  }

  getMaxTable(): Observable<IMaxResponse> {
    return this.http.get<IMaxResponse>(this.APIURL + '/tables/max', {
      headers: this.session.prepareHeaders(),
    });
  }

  getSummaryTable(): Observable<ISummaryResponse> {
    return this.http.get<ISummaryResponse>(this.APIURL + '/tables/summary', {
      headers: this.session.prepareHeaders(),
    });
  }

  getAlertzonesTable(): Observable<IAlertzonesResponse> {
    return this.http.get<IAlertzonesResponse>(
      this.APIURL + '/tables/maxhydroalert',
      {
        headers: this.session.prepareHeaders(),
      }
    );
  }

  getModelsTable(sensor: string): Observable<IModelsResponse[]> {
    return this.http.get<IModelsResponse[]>(
      this.APIURL + '/tables/sectionbasinlist/' + sensor,
      {
        headers: this.session.prepareHeaders(),
      }
    );
  }

  // aux methods ----------------------------------------------------------------------- //
  // setHeaders(): HttpHeaders {
  //   return new HttpHeaders()
  //     .append('x-refdate', this.cookieService.get('selectedDateTime'))
  //     .append('x-session-token', this.cookieService.get('sessionId'));
  // }

  prettyDate(): string {
    let res = '';
    let dateTimeCookie = this.session.getSelectedDateTimeCookie();
    if (dateTimeCookie) {
      // let date = new Date(dateTimeCookie);

      // let hours = date.getHours() < 10 ? 0 + date.getHours() : date.getHours();
      // let minutes =
      //   date.getMinutes() < 10 ? 0 + date.getMinutes() : date.getMinutes();

      // let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      // let month =
      //   date.getMonth() + 1 < 10
      //     ? '0' + date.getMonth() + 1
      //     : date.getMonth() + 1;
      // let year = date.getFullYear();

      // res = day + '/' + month + '/' + year + '%20' + hours + ':' + minutes;

      res = formatDate(dateTimeCookie, 'dd/MM/yyyy HH:mm', this.localeId);
    }
    return res;
  }
  // ----------------------------------------------------------------------------------- //

  // click ----------------------------------------------------------------------------- //
  getStationISensorByCode(code: string): Observable<IStation> {
    return this.http.get<IStation>(this.APIURL + '/tables/anag/' + code);
  }

  getStationISensorByName(station: string): Observable<IStation> {
    return this.http.get<IStation>(
      this.APIURL + '/tables/anagByName/' + station
    );
  }
  // ----------------------------------------------------------------------------------- //

  // menu ------------------------------------------------------------------------------ //
  getTableMenuLinks(): Observable<ITableLink[]> {
    return this.http.get<ITableLink[]>(this.APIURL + '/tables/tablelinks', {
      headers: this.session.prepareHeaders(),
    });
  }

  getSensorTypes(): Observable<ISensorType[]> {
    return this.http.get<ISensorType[]>(this.APIURL + '/stations/types');
  }

  getHydroModelsTypes(): Observable<IHydroModelsType[]> {
    return this.http.get<IHydroModelsType[]>(
      this.APIURL + '/tables/hydromodellist',
      {
        headers: this.session.prepareHeaders(),
      }
    );
  }
  // ----------------------------------------------------------------------------------- //

  // export ---------------------------------------------------------------------------- //

  exportCSVSensorsTable(sensor: string): string {
    return this.APIURL + '/stations/exportsensorvalues/' + sensor;
  }

  exportCSVMaxTable(date: string): string {
    return (
      this.APIURL + '/tables/exportmaxvalues?sRefDate=' + this.prettyDate()
    );
  }

  exportCSVModelsTable(sensor: string, date: string): string {
    return (
      this.APIURL +
      '/tables/exportmodel/' +
      sensor +
      '/?sRefDate=' +
      this.prettyDate()
    );
  }
  // ----------------------------------------------------------------------------------- //

  // cookies --------------------------------------------------------------------------- //
  // setSelectedDateTimeCookie(selectedDateTime: string) {
  //   this.cookieService.set('selectedDateTime', selectedDateTime, { path: '/' });
  // }

  // deleteSelectedDateTimeCookie() {
  //   this.cookieService.delete('selectedDateTime', '/');
  // }

  // getSelectedDateTimeCookie(): string {
  //   return this.cookieService.get('selectedDateTime');
  // }
  // ----------------------------------------------------------------------------------- //

  // ---------------------------------------------------------------------------------------- //
}
