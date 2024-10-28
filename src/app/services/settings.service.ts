import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SessionService } from './session.service';
import { Config } from '../../omirl-config';
import * as _ from 'lodash';
import { ConstantsService } from './constants.service';

declare interface IAccountSettings {
  changePassword: boolean;
  confirmPassword: string;
  newPassword: string;
  oldPassword: string;
  userName: string;
  IAccountSettings: boolean;
}

declare interface IMapSettings {
  defaultLat: number;
  defaultLon: number;
  defaultMap: string;
  defaultSensorType: string;
  defaultStatics: string;
  defaultZoom: number;
  isLogged: boolean;
  logged: boolean;
  mail: string;
  name: string;
  role: number;
  IMapSettings: boolean;
}

declare interface ISettingsResponse {
  BoolValue: boolean;
  DoubleValue: number;
  IntValue: number;
  StringValue: string;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(
    private http: HttpClient,
    private session: SessionService,
    private constantsService: ConstantsService) {
    this.APIURL = this.constantsService.apiURL;
  }

  // props ---------------------------------------------------------------------------------- //
  APIURL: string;
  // ---------------------------------------------------------------------------------------- //

  saveSettings(
    settings: IAccountSettings | IMapSettings
  ): Observable<ISettingsResponse> {
    return this.http.post<ISettingsResponse>(
      _.has(settings, 'IAccountSettings')
        ? this.APIURL + '/auth/settings'
        : this.APIURL + '/auth/mapsettings',
      settings,
      {
        headers: this.session.prepareHeaders(),
      }
    );
  }
}
