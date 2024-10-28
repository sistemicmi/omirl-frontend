import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { mergeMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Config } from '../../omirl-config';
import { ConstantsService } from './constants.service';
import { MapService } from './map.service';
import { Router } from '@angular/router';
import { formatDate, getLocaleId } from '@angular/common';

export interface ISessionResponse {
  defaultLat: number;
  defaultLon: number;
  defaultMap: string; //??
  defaultSensorType: string;
  defaultStatics: string;
  defaultZoom: 9;
  isLogged: boolean;
  logged: boolean;
  mail: string;
  name: string;
  role: number;
  sessionId: string;
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  // class-methods ---------------------------------------------------------- //
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private constantsService: ConstantsService,
    private mapService: MapService,
    private router: Router
  ) {
    this.APIURL = this.constantsService.apiURL;
  }
  // ----------------------------------------------------------------------- //

  // props ---------------------------------------------------------------------------------- //
  APIURL: string;
  // ---------------------------------------------------------------------------------------- //

  // methods -------------------------------------------------------------------------------- //
  checkSession(): Observable<boolean> {
    let sessionId = this.cookieService.get('sessionId');
    if (!sessionId) return of(false);
    return this.http
      .get<ISessionResponse>(this.APIURL + '/auth/cookieCheck/' + sessionId)
      .pipe(
        mergeMap((data) => {
          if (data) {
            console.log('sei ancora loggato');
            this.constantsService.sessionData = data;
            this.constantsService.logged = true;
            return of(true);
          } else {
            this.cookieService.delete('sessionId', '/');
            this.cookieService.delete('selectedDateTime', '/');
            this.constantsService.sessionData = null;
            this.constantsService.logged = false;
            window.location.reload();
            return of(false);
          }
        })
      );
  }

  login(credentials: {
    userId: string;
    userPassword: string;
  }): Observable<boolean> {
    return this.http
      .post<ISessionResponse>(this.APIURL + '/auth/login', credentials)
      .pipe(
        mergeMap((data) => {
          if (data.sessionId !== null) {
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.cookieService.set('sessionId', data.sessionId, { path: '/' });
            this.constantsService.sessionData = data;
            this.constantsService.logged = true;
            this.mapService.applyUserConfig();
            window.location.reload();
            this.router.routeReuseStrategy.shouldReuseRoute = () => true;
            return of(true);
          } else {
            this.cookieService.delete('sessionId', '/');
            this.cookieService.delete('selectedDateTime', '/');
            this.constantsService.sessionData = null;
            this.constantsService.logged = false;
            alert('Credenziali errate!');
            return of(false);
          }
        })
      );
  }

  logout() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.cookieService.delete('sessionId', '/');
    this.cookieService.delete('selectedDateTime', '/');
    window.location.reload();
    this.router.routeReuseStrategy.shouldReuseRoute = () => true;
  }
  // ---------------------------------------------------------------------------------------- //

  // aux methods ----------------------------------------------------------------------- //
  prepareHeaders(): HttpHeaders {
    let headers = new HttpHeaders().append(
      'x-session-token',
      this.cookieService.get('sessionId')
    );

    if (this.cookieService.get('selectedDateTime')) {
      headers = headers.append(
        'x-refdate',
        formatDate(
          this.cookieService.get('selectedDateTime'),
          'yyyy-MM-ddTHH:mm:ss.SSSZ',
          'en-US'
        )
      );
    }

    return headers;
  }

  // cookies --------------------------------------------------------------------------- //
  setSelectedDateTimeCookie(selectedDateTime: Date) {
    this.cookieService.set(
      'selectedDateTime',
      selectedDateTime.getTime() + '',
      { path: '/' }
    );
  }

  deleteSelectedDateTimeCookie() {
    this.cookieService.delete('selectedDateTime', '/');
  }

  getSelectedDateTimeCookie(): Date | null {
    let cookieTime = this.cookieService.get('selectedDateTime');

    if (cookieTime) {
      return new Date(parseFloat(cookieTime));
    } else {
      return null;
    }
  }
  // ----------------------------------------------------------------------------------- //

  // // _referenceDate ------------------------------------------------------------- //
  // public get referenceDate(): Date | null {
  //   return this._referenceDate;
  // }

  // public set referenceDate(value: Date | null) {
  //   this._referenceDate = value;
  // }
}
