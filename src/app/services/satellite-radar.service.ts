import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Config } from '../../omirl-config';
import { TablesService } from './tables.service';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { of } from '@reactivex/rxjs/dist/package';
import { formatDate } from '@angular/common';
import { SessionService } from './session.service';
import { ConstantsService } from './constants.service';

export interface IAnimation {
  BoolValue: boolean;
  DoubleValue: number;
  IntValue: number;
  StringValue: string;
}

@Injectable({
  providedIn: 'root',
})
export class SatelliteRadarService {
  // class-methods ---------------------------------------------------------- //
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private constantsService: ConstantsService,
    private session: SessionService,
    @Inject(LOCALE_ID) protected localeId: string
  ) {
    this.APIURL = this.constantsService.apiURL;
  }
  // ------------------------------------------------------------------------ //

  // props ---------------------------------------------------------------------------------- //
  APIURL: string;
  // ---------------------------------------------------------------------------------------- //

  // methods -------------------------------------------------------------------------------- //
  getImage(id: string): Observable<string> {
    // animation/image/PIEMradarRain10m
    return this.http
      .get<IAnimation>(this.APIURL + '/animation/image/' + id, {
        headers: this.session.prepareHeaders(),
      })
      .pipe(
        mergeMap((res) => {
          return of(res.StringValue);
        })
      );
  }
  getAnimation(id: string): Observable<string> {
    // animation/animation/radarRain1h
    return this.http
      .get<IAnimation>(this.APIURL + '/animation/animation/' + id, {
        headers: this.session.prepareHeaders(),
      })
      .pipe(
        mergeMap((res) => {
          return of(res.StringValue);
        })
      );
  }

  // aux methods ----------------------------------------------------------------------- //
  setHeaders(): HttpHeaders {
    return new HttpHeaders()
      .append('x-refdate', this.cookieService.get('selectedDateTime'))
      .append('x-session-token', this.cookieService.get('sessionId'));
  }

  prettyDate(): string {
    let res = '';
    let dateTimeCookie = this.session.getSelectedDateTimeCookie();
    if (dateTimeCookie) {
      //   let date = new Date(dateTimeCookie);

      //   let hours = date.getHours() < 10 ? 0 + date.getHours() : date.getHours();
      //   let minutes =
      //     date.getMinutes() < 10 ? 0 + date.getMinutes() : date.getMinutes();

      //   let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      //   let month =
      //     date.getMonth() + 1 < 10
      //       ? '0' + date.getMonth() + 1
      //       : date.getMonth() + 1;
      //   let year = date.getFullYear();

      //  res = day + '/' + month + '/' + year + '%20' + hours + ':' + minutes;
      res = formatDate(dateTimeCookie, 'dd/MM/yyyy HH:mm', this.localeId);
    }
    return res;
  }
  // ----------------------------------------------------------------------------------- //

  // ---------------------------------------------------------------------------------------- //
}
