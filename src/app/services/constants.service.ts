import { Inject, Injectable } from '@angular/core';
import { ISessionResponse } from './session.service';
import Map from 'ol/Map';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ConstantsService {
  // Data ------------------------------------------------- //
  private _referenceDate: Date | null = null;
  private _sessionData: ISessionResponse | null = null;
  private _logged: boolean | null = null;
  private _map: Map | null = null;
  //private _sensors: Observable<ISensor[]> | null = null;
  public apiProtocol: string
  public baseURL: string
  public siteURL: string
	public apiURL: string
	public sensorsApiURL: string 
	public mapsApiURL: string 
	public staticsApiURL: string 

  // ------------------------------------------------------ //

  constructor(@Inject(DOCUMENT) private document: Document) {
    console.log("constructor of ConstantsService")
    this.apiProtocol = document.location.protocol
    this.baseURL = 'omirl.regione.liguria.it'
    this.siteURL = this.apiProtocol + '//' + this.baseURL
    this.apiURL = this.siteURL + '/Omirl/rest'
    this.sensorsApiURL = this.apiURL + "/mapnavigator/sensors"
    this.mapsApiURL = this.apiURL + "/mapnavigator/maps"
    this.staticsApiURL = this.apiURL + "/mapnavigator/statics"
  }

  // Getters & setters ------------------------------------ //

  // // _referenceDate ------------------------------------------------------------- //
  // public get referenceDate(): Date | null {
  //   return this._referenceDate;
  // }

  // public set referenceDate(value: Date | null) {
  //   this._referenceDate = value;
  // }
  // ---------------------------------------------------------------------------- //

  // _sessionData --------------------------------------------------------------- //
  public get sessionData(): ISessionResponse | null {
    return this._sessionData;
  }

  public set sessionData(sessionData: ISessionResponse | null) {
    this._sessionData = sessionData;
  }
  // ---------------------------------------------------------------------------- //

  // _logged -------------------------------------------------------------------- //
  public get logged(): boolean | null {
    return this._logged;
  }

  public set logged(logged: boolean | null) {
    this._logged = logged;
  }
  // ---------------------------------------------------------------------------- //

  // _map ----------------------------------------------------------------------- //
  public get map(): Map | null {
    return this._map;
  }

  public set map(map: Map | null) {
    this._map = map;
  }
  // ---------------------------------------------------------------------------- //

  // /**
  //  * return the list of first level sensors. The request is cached using shareReplay(1) in the pipe,
  //  * which forces the observable to emit just the last value.
  //  */
  // public get sensors(): Observable<ISensor[]> {
  //   if (this._sensors) {
  //     return this._sensors
  //   }
      
  //   return this._sensors = this.mapNavigatorService.getSensorFirstLevel().pipe(shareReplay(1))
  // }

  public get isMobile():boolean {
    var ua = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)
  }
  
}


