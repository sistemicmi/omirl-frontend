import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../omirl-config';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';
import { ConstantsService } from './constants.service';

export interface IPeriod {
  idPeriod: number;
  timestampEnd: string;
  timestampStart: string;
}

@Injectable({
  providedIn: 'root',
})
export class PeriodsService {
  constructor(
    private http: HttpClient,
    private session: SessionService,
    private constantsService: ConstantsService) {
    this.APIURL = this.constantsService.apiURL;
  }

  APIURL: string;

  getPeriods(): Observable<IPeriod[]> {
    return this.http.get<IPeriod[]>(this.APIURL + '/periods/load', {
      headers: this.session.prepareHeaders(),
    });
  }
}
