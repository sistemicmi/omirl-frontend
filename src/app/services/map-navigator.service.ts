import { Injectable } from '@angular/core';
import { Config } from '../../omirl-config';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, shareReplay } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import Layer from 'ol/layer/Layer';
import { TileWMS } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { SessionService } from './session.service';
import { ConstantsService } from './constants.service';

export interface ILegend {
  clr: string;
  lmt: number;
}
export interface ISensor {
  active: boolean;
  clickable: boolean;
  code: string;
  count: number;
  description: string;
  imageLinkInv: string;
  imageLinkOff: string;
  imageLinkOn: string;
  isActive: boolean;
  isClickable: boolean;
  isVisible: boolean;
  legendLink: string;
  legends: ILegend[];
  mesUnit: string;
  visible: boolean;
  linkCode?: string;
  linkId?: string;
  link?: string;
}

export interface IHydro {
  active: boolean;
  clickable: boolean;
  count: number;
  description: string;
  imageLinkInv: string;
  imageLinkOff: string;
  imageLinkOn: string;
  isActive: boolean;
  isClickable: boolean;
  isVisible: boolean;
  legendLink: string;
  legends: ILegend[];
  mesUnit: string;
  visible: boolean;
  linkCode: string;
  linkId?: string;
  hasChilds: boolean;
  hasThirdLevel: boolean;
  link: string;
  parentDescription: string;
  parentLinkCode: string;
  selected: false;
}

export interface IMap {
  description: string;
  hasChilds?: boolean;
  hasThirdLevel: boolean;
  layerID: string;
  layerWMS: string;
  legendLink: string;
  link: string;
  linkCode?: string;
  linkId: number;
  selected: boolean;
  firstLevelIndex?: number;
  secondLevelIndex?: number;
  layerIDModifier?: string;
}

export interface IStaticLayer {
  description: string;
  description_translated: string;
  layerID: string;
  layerWMS: string;
  selected: boolean;
  mapLayer?: TileLayer<TileWMS>;
}

export interface ISatLayerDetails {
  code: string;
  layerId: string;
  styleId: string;
  updateDateTime: Date;
}

@Injectable({
  providedIn: 'root',
})
export class MapNavigatorService {
  apiURL: string;
  mapFirstLevels: never[];
  hydroFirstLevels: never[];
  radarFirstLevels: never[];
  satelliteFirstLevels: never[];
  http: any;
  private _sensors: Observable<ISensor[]> | null = null;
  private _hydroSensors: IHydro[] | null = null;

  handleError = (error: HttpErrorResponse) => {
    console.log('error: %o', error);
    return throwError('"error: %o", error');
  };

  constructor(
    private httpClient: HttpClient,
    private session: SessionService,
    private constantsService: ConstantsService
  ) {
    this.http = httpClient;

    this.apiURL = this.constantsService.apiURL;

    this.mapFirstLevels = [];

    this.hydroFirstLevels = [];

    this.radarFirstLevels = [];

    this.satelliteFirstLevels = [];
  }

  fetchMapFirstLevels = () => {
    this.mapFirstLevels = [];

    let data = this.http
      .get(this.apiURL + '/mapnavigator/maps')
      .pipe(catchError(this.handleError));

    //******************************************************************
    // Add the flag to indicate the menu link item level and
    // if the menu link has a sub-level.
    // or not. These parametere should come from server but, at the
    // moment, are initialized here
    for (var key in data) {
      data[key].hasSubLevel = true;
      data[key].myLevel = 0;
    }
    //******************************************************************

    this.mapFirstLevels = data;
  };

  getMapFirstLevels = (): Observable<IMap[]> => {
    //return this.m_aoMapFirstLevels;
    return this.http.get(this.apiURL + '/mapnavigator/maps');
  };

  getMapSecondLevels = (linkId: number): Observable<IMap[]> => {
    return this.http.get(this.apiURL + '/mapnavigator/maps/' + linkId);
  };

  getMapThirdLevel = (linkId: number): Observable<IMap[]> => {
    let headers = this.session.prepareHeaders();
    if (headers) {
      return this.http.get(this.apiURL + '/mapnavigator/mapsthird/' + linkId, {
        headers: headers,
      });
    } else {
      return this.http.get(this.apiURL + '/mapnavigator/mapsthird/' + linkId);
    }
  };

  getSensorFirstLevel = (): Observable<ISensor[]> => {
    let headers = this.session.prepareHeaders();

    if (headers) {
      return this.http.get(this.apiURL + '/mapnavigator/sensors', {
        headers: headers,
      });
    } else {
      return this.http.get(this.apiURL + '/mapnavigator/sensors');
    }
  };

  getStaticLayerLinks = (): Observable<IStaticLayer[]> => {
    return this.http.get(this.apiURL + '/mapnavigator/statics');
  };

  getStaticLayerOptionList = () => {
    var aoStaticLinks = [{}];

    return aoStaticLinks;
  };

  getFlattedHydro = () => {
    return this.http.get(this.apiURL + '/mapnavigator/flattedhydro');
  };

  fetchHydroFirstLevels = () => {
    this.hydroFirstLevels = [];

    let data = this.http
      .get(this.apiURL + '/mapnavigator/hydro')
      .pipe(catchError(this.handleError));

    //******************************************************************
    // Add the flag to indicate the menu link item level and
    // if the menu link has a sub-level.
    // or not. These parametere should come from server but, at the
    // moment, are initialized here
    for (var key in data) {
      data[key].hasSubLevel = data[key].hasChilds;
      data[key].myLevel = 0;
    }
    //******************************************************************

    this.hydroFirstLevels = data;

    // Remember links
    for (var iElement = 0; iElement < data.length; iElement++) {
      //oControllerVar.m_oConstantsService.pushToHydroLinks(data[iElement]);
    }
  };

  getHydroFirstLevels = (): Observable<IHydro[]> => {
    //return this.hydroFirstLevels;
    const headers = this.session.prepareHeaders();
    if (headers) {
      return this.http.get(this.apiURL + '/mapnavigator/hydro', {
        headers: headers,
      });
    } else {
      return this.http.get(this.apiURL + '/mapnavigator/hydro');
    }
  };

  getHydroSecondLevels = (linkCode: string) => {
    const headers = this.session.prepareHeaders();
    if (headers) {
      return this.http.get(this.apiURL + '/mapnavigator/hydro/' + linkCode, {
        headers: headers,
      });
    } else {
      return this.http.get(this.apiURL + '/mapnavigator/hydro/' + linkCode);
    }
  };

  getHydroThirdLevel = (linkCode: number) => {
    return this.http.get(this.apiURL + '/mapnavigator/hydrothird/' + linkCode);
  };

  fetchRadarFirstLevels = () => {
    this.radarFirstLevels = [];

    let data = this.http
      .get(this.apiURL + '/mapnavigator/radar')
      .pipe(catchError(this.handleError));

    //******************************************************************
    // Add the flag to indicate the menu link item level and
    // if the menu link has a sub-level.
    // or not. These parametere should come from server but, at the
    // moment, are initialized here
    for (var key in data) {
      data[key].hasSubLevel = data[key].hasChilds;
      data[key].myLevel = 0;
    }
    //******************************************************************

    this.radarFirstLevels = data;
  };

  getRadarFirstLevels = (): Observable<IMap[]> => {
    const headers = this.session.prepareHeaders();
    if (headers) {
      return this.http.get(this.apiURL + '/mapnavigator/radar', {
        headers: headers,
      });
    } else {
      return this.http.get(this.apiURL + '/mapnavigator/radar');
    }
  };

  getRadarSecondLevels = (linkCode: string): Observable<IMap[]> => {
    const headers = this.session.prepareHeaders();
    if (headers) {
      return this.http.get(this.apiURL + '/mapnavigator/radar/' + linkCode, {
        headers: headers,
      });
    } else {
      return this.http.get(this.apiURL + '/mapnavigator/radar/' + linkCode);
    }
  };

  getRadarThirdLevel = (linkCode: number) => {
    return this.http.get(this.apiURL + '/mapnavigator/radarthird/' + linkCode);
  };

  fetchSatelliteFirstLevels = () => {
    this.satelliteFirstLevels = [];

    let data = this.http
      .get(this.apiURL + '/mapnavigator/satellite')
      .pipe(catchError(this.handleError));

    //******************************************************************
    // Add the flag to indicate the menu link item level and
    // if the menu link has a sub-level.
    // or not. These parametere should come from server but, at the
    // moment, are initialized here
    for (var key in data) {
      data[key].hasSubLevel = data[key].hasChilds;
      data[key].myLevel = 0;
    }
    //******************************************************************

    this.satelliteFirstLevels = data;
  };

  getSatelliteFirstLevels = (): Observable<IMap[]> => {
    //return this.hydroFirstLevels;
    const headers = this.session.prepareHeaders();
    if (headers) {
      return this.http.get(this.apiURL + '/mapnavigator/satellite', {
        headers: headers,
      });
    } else {
      return this.http.get(this.apiURL + '/mapnavigator/satellite');
    }
  };

  getSatelliteLayerDetails = (
    linkCode: string
  ): Observable<ISatLayerDetails> => {
    const headers = this.session.prepareHeaders();
    if (headers) {
      return this.http.get(this.apiURL + '/maps/layer/' + linkCode + '/none', {
        headers: headers,
      });
    } else {
      return this.http.get(this.apiURL + '/maps/layer/' + linkCode + '/none');
    }
  };

  getSatelliteThirdLevel = (linkCode: number) => {
    return this.http.get(
      this.apiURL + '/mapnavigator/satellitethird/' + linkCode
    );
  };

  getFeaturesInfo = (url: string) => {
    return this.http.get(url);
  };

  /**
   * return the list of first level sensors. The request is cached using shareReplay(1) in the pipe,
   * which forces the observable to emit just the last value.
   */
  public get sensors(): Observable<ISensor[]> {
    if (this._sensors) {
      return this._sensors;
    }

    return (this._sensors = this.getSensorFirstLevel().pipe(shareReplay(1)));
  }

  public set hydroSensors(sensors: IHydro[] | null) {
    this._hydroSensors = sensors;
  }

  public get hydroSensors() {
    return this._hydroSensors;
  }
}
