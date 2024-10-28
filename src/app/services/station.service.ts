import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken } from '@angular/core';
import { getTransformFromProjections } from 'ol/proj';
import { Observable } from 'rxjs';
import { Config } from '../../omirl-config';
import { ConstantsService } from './constants.service';
import { IHydro } from './map-navigator.service';
import { SessionService } from './session.service';

export interface IStation {
  altitude: number;
  color: string;
  geometry: any;
  imageLinkInv: string;
  imageLinkOff: string;
  imgPath: string;
  increment: number;
  lat: number;
  lon: number;
  measureUnit: string;
  municipality: string;
  name: string;
  opacity: number;
  otherHtml: string;
  referenceDate: string;
  sensorType: string;
  shortCode: string;
  stationId: 1;
  value: 0;
}
export interface IHydroStation {
  alt: number
  basin: string
  basinArea: number
  basinClass: string
  code: string
  color: number
  imageLinkOff?: string
  imgPath: null
  lat: number
  lon: number
  model: string
  municipality: string
  name: string
  otherHtml: string
  refDate: string
  referenceDate?: string
  river: string
  sensorType: string
  sensorDescription: string
  shortCode?: string
  subFolder: string
  updateDateTime: Date
  value: number
  warningArea: string
  layerType: string
}

@Injectable({
  providedIn: 'root',
})
export class StationService {
  APIURL: string;
  http: HttpClient;
  m_aoSensorsTable: {
    name: string;
    stationCode: string;
    municipality: string;
    district: string;
    area: string;
    basin: string;
    subBasin: string;
    lastValue: string;
    value1: string;
    value2: string;
  }[];
  m_aoAggregationTypes: { description: string; code: string }[];
  m_aoMaxTableRows: {
    AlertZones: {
      name: string;
      m5BkColor: string;
      m5val: string;
      m5: string;
      m15BkColor: string;
      m15val: string;
      m15: string;
      m30BkColor: string;
      m30val: string;
      m30: string;
      h1BkColor: string;
      h1val: string;
      h1: string;
      h3BkColor: string;
      h3val: string;
      h3: string;
      h6BkColor: string;
      h6val: string;
      h6: string;
      h12BkColor: string;
      h12val: string;
      h12: string;
      h24BkColor: string;
      h24val: string;
      h24: string;
    }[];
    Districts: {
      name: string;
      m5BkColor: string;
      m5val: string;
      m5: string;
      m15BkColor: string;
      m15val: string;
      m15: string;
      m30BkColor: string;
      m30val: string;
      m30: string;
      h1BkColor: string;
      h1val: string;
      h1: string;
      h3BkColor: string;
      h3val: string;
      h3: string;
      h6BkColor: string;
      h6val: string;
      h6: string;
      h12BkColor: string;
      h12val: string;
      h12: string;
      h24BkColor: string;
      h24val: string;
      h24: string;
    }[];
  };
  getStations: (oStationsLink: any) => any;
  getStationsByCode: (sCode: any) => any;
  getStationsOLD: (
    oStationsLink: any
  ) => {
    stationId: number;
    name: string;
    lat: number;
    lon: number;
    value: number;
    refDate: string;
    shortCode: string;
    alt: string;
    otherHtml: string;
    imgPath: string;
  }[];
  getHydroStations: (sectionCode: string) => Observable<IHydroStation[]>
  //VIEW DEFINITION ABOVE
  /*getSensorsTable: (sType: any) => any*/
  exportCsvSensorsTable: (sSensorCode: any) => string;
  getWeather: () => {
    stationId: number;
    name: string;
    lat: number;
    lon: number;
    value: number;
    refDate: string;
    shortCode: string;
    alt: string;
    otherHtml: string;
    imgPath: string;
  }[];
  getStationsTable: (sType: any) => any;
  getStationsTypes: () => any;
  exportCsvStationList: (sSensorCode: any) => string;
  getAggregationsTypes: () => { description: string; code: string }[];

  constructor(
    private httpClient: HttpClient,
    private session: SessionService,
    private constantsService: ConstantsService) {
    this.APIURL = this.constantsService.apiURL;

    this.http = httpClient;

    this.m_aoSensorsTable = [
      {
        name: 'Alassio',
        stationCode: 'ALASS',
        municipality: 'Alassio',
        district: 'SV',
        area: '',
        basin: '',
        subBasin: '',
        lastValue: '11.0',
        value1: '12.0',
        value2: '8.0',
      },
      {
        name: 'Albenga - Isolabella',
        stationCode: 'ISBLL',
        municipality: 'Albenga',
        district: 'SV',
        area: '',
        basin: 'Neva',
        subBasin: 'Neva',
        lastValue: '0.0',
        value1: '0.0',
        value2: '0.0',
      },
      {
        name: 'Molino Branca',
        stationCode: 'MOBRA',
        municipality: 'Albenga',
        district: 'SV',
        area: '',
        basin: 'Centa',
        subBasin: 'Centa',
        lastValue: '5.0',
        value1: '5.0',
        value2: '0.0',
      },
      {
        name: 'Alpe Gorreto',
        stationCode: 'AGORR',
        municipality: 'Gorreto',
        district: 'GE',
        area: '',
        basin: 'Trebbia',
        subBasin: 'Trebbia',
        lastValue: '7.0',
        value1: '7.5',
        value2: '0.0',
      },
      {
        name: 'Alpe Vobbia',
        stationCode: 'AVOBB',
        municipality: 'Vobbia',
        district: 'GE',
        area: '',
        basin: 'Vobbia',
        subBasin: 'Vobbia',
        lastValue: '13.3',
        value1: '13.3',
        value2: '11.2',
      },
      {
        name: 'Barbagelata',
        stationCode: 'BRGEL',
        municipality: 'Lorsica',
        district: 'GE',
        area: '',
        basin: 'Trebbia',
        subBasin: 'Trebbia',
        lastValue: '2.0',
        value1: '5.0',
        value2: '0.0',
      },
      {
        name: 'Bestagno',
        stationCode: 'BESTA',
        municipality: 'Pontedassio',
        district: 'IM',
        area: '',
        basin: 'Impero',
        subBasin: 'impero',
        lastValue: '2.0',
        value1: '4.3',
        value2: '0.5',
      },
      {
        name: 'Brugnato',
        stationCode: 'BVARA',
        municipality: 'Brugnato',
        district: 'SP',
        area: '',
        basin: 'Vara',
        subBasin: 'Vara',
        lastValue: '3.6',
        value1: '4.1',
        value2: '1.9',
      },
    ];

    this.m_aoAggregationTypes = [
      { description: 'Aree Allertamento', code: 'AAL' },
      { description: 'Comuni', code: 'COM' },
      { description: 'Province', code: 'PRO' },
      { description: 'Bacini', code: 'BAC' },
    ];

    this.m_aoMaxTableRows = {
      AlertZones: [
        {
          name: 'A',
          m5BkColor: 'max-table-green-cell max-table-border-cell',
          m5val: '3 mm ',
          m5: '[15:30] Centro Funzionale',
          m15BkColor: 'max-table-green-cell',
          m15val: '3 mm ',
          m15: '[15:30] Centro Funzionale',
          m30BkColor: 'max-table-green-cell',
          m30val: '3 mm ',
          m30: '[14:20]  Centro Funzionale',
          h1BkColor: 'max-table-green-cell',
          h1val: '3 mm ',
          h1: '[14:20]  Centro Funzionale',
          h3BkColor: 'max-table-green-cell',
          h3val: '3 mm ',
          h3: '[14:20]  Centro Funzionale',
          h6BkColor: 'max-table-green-cell',
          h6val: '3 mm ',
          h6: '[14:20]  Centro Funzionale',
          h12BkColor: 'max-table-green-cell',
          h12val: '29 mm ',
          h12: '[14:20]  Centro Funzionale',
          h24BkColor: 'max-table-green-cell',
          h24val: '3 mm ',
          h24: '[14:20]  Centro Funzionale',
        },
        {
          name: 'B',
          m5BkColor: 'max-table-green-cell',
          m5val: '3 mm ',
          m5: '[15:30]  Centro Funzionale',
          m15BkColor: 'max-table-green-cell max-table-border-cell',
          m15val: '3 mm ',
          m15: '[15:30]  Centro Funzionale',
          m30BkColor: 'max-table-green-cell',
          m30val: '3 mm ',
          m30: '[14:20]  Centro Funzionale',
          h1BkColor: 'max-table-green-cell',
          h1val: '3 mm ',
          h1: '[14:20]  Centro Funzionale',
          h3BkColor: 'max-table-green-cell',
          h3val: '3 mm ',
          h3: '[14:20]  Centro Funzionale',
          h6BkColor: 'max-table-green-cell',
          h6val: '3 mm ',
          h6: '[14:20]  Centro Funzionale',
          h12BkColor: 'max-table-green-cell',
          h12val: '29 mm ',
          h12: '[14:20]  Centro Funzionale',
          h24BkColor: 'max-table-green-cell',
          h24val: '3 mm ',
          h24: '[14:20]  Centro Funzionale',
        },
        {
          name: 'C',
          m5BkColor: 'max-table-green-cell',
          m5val: '3 mm ',
          m5: '[15:30]  Centro Funzionale',
          m15BkColor: 'max-table-green-cell',
          m15val: '3 mm ',
          m15: '[15:30]  Centro Funzionale',
          m30BkColor: 'max-table-green-cell max-table-border-cell',
          m30val: '3 mm ',
          m30: '[14:20]  Centro Funzionale',
          h1BkColor: 'max-table-green-cell',
          h1val: '3 mm ',
          h1: '[14:20]  Centro Funzionale',
          h3BkColor: 'max-table-green-cell',
          h3val: '3 mm ',
          h3: '[14:20]  Centro Funzionale',
          h6BkColor: 'max-table-green-cell',
          h6val: '3 mm ',
          h6: '[14:20]  Centro Funzionale',
          h12BkColor: 'max-table-green-cell',
          h12val: '29 mm ',
          h12: '[14:20]  Centro Funzionale',
          h24BkColor: 'max-table-green-cell',
          h24val: '3 mm ',
          h24: '[14:20]  Centro Funzionale',
        },
        {
          name: 'C+',
          m5BkColor: 'max-table-green-cell',
          m5val: '3 mm ',
          m5: '[15:30]  Centro Funzionale',
          m15BkColor: 'max-table-green-cell',
          m15val: '3 mm ',
          m15: '[15:30]  Centro Funzionale',
          m30BkColor: 'max-table-green-cell',
          m30val: '3 mm ',
          m30: '[14:20]  Centro Funzionale',
          h1BkColor: 'max-table-green-cell max-table-border-cell',
          h1val: '3 mm ',
          h1: '[14:20]  Centro Funzionale',
          h3BkColor: 'max-table-green-cell',
          h3val: '3 mm ',
          h3: '[14:20]  Centro Funzionale',
          h6BkColor: 'max-table-green-cell',
          h6val: '3 mm ',
          h6: '[14:20]  Centro Funzionale',
          h12BkColor: 'max-table-green-cell',
          h12val: '29 mm ',
          h12: '[14:20]  Centro Funzionale',
          h24BkColor: 'max-table-green-cell',
          h24val: '3 mm ',
          h24: '[14:20]  Centro Funzionale',
        },
        {
          name: 'C-',
          m5BkColor: 'max-table-green-cell',
          m5val: '3 mm ',
          m5: '[15:30]  Centro Funzionale',
          m15BkColor: 'max-table-green-cell',
          m15val: '3 mm ',
          m15: '[15:30]  Centro Funzionale',
          m30BkColor: 'max-table-green-cell',
          m30val: '3 mm ',
          m30: '[14:20]  Centro Funzionale',
          h1BkColor: 'max-table-green-cell',
          h1val: '3 mm ',
          h1: '[14:20]  Centro Funzionale',
          h3BkColor: 'max-table-green-cell max-table-border-cell',
          h3val: '3 mm ',
          h3: '[14:20]  Centro Funzionale',
          h6BkColor: 'max-table-green-cell',
          h6val: '3 mm ',
          h6: '[14:20]  Centro Funzionale',
          h12BkColor: 'max-table-green-cell',
          h12val: '29 mm ',
          h12: '[14:20]  Centro Funzionale',
          h24BkColor: 'max-table-green-cell',
          h24val: '3 mm ',
          h24: '[14:20]  Centro Funzionale',
        },
        {
          name: 'Magra',
          m5BkColor: 'max-table-green-cell',
          m5val: '3 mm ',
          m5: '[15:30]  Centro Funzionale',
          m15BkColor: 'max-table-green-cell',
          m15val: '3 mm ',
          m15: '[15:30]  Centro Funzionale',
          m30BkColor: 'max-table-green-cell',
          m30val: '3 mm ',
          m30: '[14:20]  Centro Funzionale',
          h1BkColor: 'max-table-green-cell',
          h1val: '3 mm ',
          h1: '[14:20]  Centro Funzionale',
          h3BkColor: 'max-table-green-cell',
          h3val: '3 mm ',
          h3: '[14:20]  Centro Funzionale',
          h6BkColor: 'max-table-green-cell max-table-border-cell',
          h6val: '3 mm ',
          h6: '[14:20]  Centro Funzionale',
          h12BkColor: 'max-table-green-cell',
          h12val: '29 mm ',
          h12: '[14:20]  Centro Funzionale',
          h24BkColor: 'max-table-green-cell',
          h24val: '3 mm ',
          h24: '[14:20]  Centro Funzionale',
        },
        {
          name: 'D',
          m5BkColor: 'max-table-green-cell',
          m5val: '3 mm ',
          m5: '[15:30]  Centro Funzionale',
          m15BkColor: 'max-table-green-cell',
          m15val: '3 mm ',
          m15: '[15:30]  Centro Funzionale',
          m30BkColor: 'max-table-green-cell',
          m30val: '3 mm ',
          m30: '[14:20]  Centro Funzionale',
          h1BkColor: 'max-table-green-cell',
          h1val: '3 mm ',
          h1: '[14:20]  Centro Funzionale',
          h3BkColor: 'max-table-green-cell',
          h3val: '3 mm ',
          h3: '[14:20]  Centro Funzionale',
          h6BkColor: 'max-table-green-cell',
          h6val: '3 mm ',
          h6: '[14:20]  Centro Funzionale',
          h12BkColor: 'max-table-green-cell max-table-border-cell',
          h12val: '29 mm ',
          h12: '[14:20]  Centro Funzionale',
          h24BkColor: 'max-table-green-cell',
          h24val: '3 mm ',
          h24: '[14:20]  Centro Funzionale',
        },
        {
          name: 'E',
          m5BkColor: 'max-table-green-cell',
          m5val: '3 mm ',
          m5: '[15:30]  Centro Funzionale',
          m15BkColor: 'max-table-green-cell',
          m15val: '3 mm ',
          m15: '[15:30]  Centro Funzionale',
          m30BkColor: 'max-table-green-cell',
          m30val: '3 mm ',
          m30: '[14:20]  Centro Funzionale',
          h1BkColor: 'max-table-green-cell',
          h1val: '3 mm ',
          h1: '[14:20]  Centro Funzionale',
          h3BkColor: 'max-table-green-cell',
          h3val: '3 mm ',
          h3: '[14:20]  Centro Funzionale',
          h6BkColor: 'max-table-green-cell',
          h6val: '3 mm ',
          h6: '[14:20]  Centro Funzionale',
          h12BkColor: 'max-table-green-cell',
          h12val: '29 mm ',
          h12: '[14:20]  Centro Funzionale',
          h24BkColor: 'max-table-green-cell',
          h24val: '3 mm ',
          h24: '[14:20]  Centro Funzionale',
        },
      ],
      Districts: [
        {
          name: 'Genova',
          m5BkColor: 'max-table-green-cell',
          m5val: '3 mm ',
          m5: '[15:30]  Centro Funzionale',
          m15BkColor: 'max-table-green-cell',
          m15val: '3 mm ',
          m15: '[15:30]  Centro Funzionale',
          m30BkColor: 'max-table-green-cell',
          m30val: '3 mm ',
          m30: '[14:20]  Centro Funzionale',
          h1BkColor: 'max-table-green-cell',
          h1val: '3 mm ',
          h1: '[14:20]  Centro Funzionale',
          h3BkColor: 'max-table-green-cell',
          h3val: '3 mm ',
          h3: '[14:20]  Centro Funzionale',
          h6BkColor: 'max-table-green-cell',
          h6val: '3 mm ',
          h6: '[14:20]  Centro Funzionale',
          h12BkColor: 'max-table-green-cell',
          h12val: '29 mm ',
          h12: '[14:20]  Centro Funzionale',
          h24BkColor: 'max-table-green-cell',
          h24val: '3 mm ',
          h24: '[14:20]  Centro Funzionale',
        },
        {
          name: 'Savona',
          m5BkColor: 'max-table-green-cell',
          m5val: '3 mm ',
          m5: '[15:30]  Centro Funzionale',
          m15BkColor: 'max-table-green-cell',
          m15val: '3 mm ',
          m15: '[14:20]  Mallare, Murialdo',
          m30BkColor: 'max-table-green-cell',
          m30val: '3 mm ',
          m30: '[14:20]  Cairo Montenotte',
          h1BkColor: 'max-table-yellow-cell',
          h1val: '3 mm ',
          h1: '[14:20]  Il Pero',
          h3BkColor: 'max-table-red-cell',
          h3val: '3 mm ',
          h3: '[14:20]  Calice Ligure - Ca rosse',
          h6BkColor: 'max-table-green-cell',
          h6val: '3 mm ',
          h6: '[14:20]  Sanda',
          h12BkColor: 'max-table-green-cell',
          h12val: '29 mm ',
          h12: '[14:20]  Sassello',
          h24BkColor: 'max-table-green-cell',
          h24val: '3 mm ',
          h24: '[14:20]  Colle del Melogno',
        },
        {
          name: 'Imperia',
          m5BkColor: 'max-table-green-cell',
          m5val: '3 mm ',
          m5: '[15:30]  Centro Funzionale',
          m15BkColor: 'max-table-green-cell',
          m15val: '3 mm ',
          m15: '[14:20]  Triora',
          m30BkColor: 'max-table-green-cell',
          m30val: '3 mm ',
          m30: '[14:20]  Borgomaro, Bestagno',
          h1BkColor: 'max-table-green-cell',
          h1val: '3 mm ',
          h1: '[14:20]  Sella di Gouta',
          h3BkColor: 'max-table-yellow-cell',
          h3val: '3 mm ',
          h3: '[14:20]  Colle di Nava',
          h6BkColor: 'max-table-green-cell ',
          h6val: '3 mm ',
          h6: '[14:20]  Ventimiglia',
          h12BkColor: 'max-table-green-cell',
          h12val: '29 mm ',
          h12: '[14:20]  Ranzo',
          h24BkColor: 'max-table-green-cell max-table-border-cell',
          h24val: '3 mm ',
          h24: '[14:20]  Dolcedo, Pornassio',
        },
        {
          name: 'La Spezia',
          m5BkColor: 'max-table-green-cell',
          m5val: '3 mm ',
          m5: '[15:30]  Centro Funzionale',
          m15BkColor: 'max-table-green-cell',
          m15val: '4 mm ',
          m15: '[14:20]  Monterosso, La Spezia',
          m30BkColor: 'max-table-green-cell',
          m30val: '3 mm ',
          m30: '[14:20]  Monte Rocchetta',
          h1BkColor: 'max-table-green-cell',
          h1val: '3 mm ',
          h1: '[14:20]  Piana Battolla - Ponte',
          h3BkColor: 'max-table-green-cell',
          h3val: '3 mm ',
          h3: '[14:20]  Brugnato',
          h6BkColor: 'max-table-green-cell',
          h6val: '3 mm ',
          h6: '[14:20]  La Spezia',
          h12BkColor: 'max-table-green-cell',
          h12val: '3 mm ',
          h12: '[14:20]  Monte Rocchetta',
          h24BkColor: 'max-table-green-cell',
          h24val: '3 mm ',
          h24: '[14:20]  La Macchia, Sarzana - Nave',
        },
      ],
    };

    this.getStations = (oStationsLink) => {
      
      let headers = this.session.prepareHeaders()
      if (headers) {

        return this.http.get(this.APIURL + '/stations/' + oStationsLink.code, {headers: headers});
      } else {

        return this.http.get(this.APIURL + '/stations/' + oStationsLink.code);
      }
    };

    this.getStationsByCode = (sCode) => {
      return this.http.get(this.APIURL + '/stations/' + sCode);
    };

    this.getStationsOLD = (oStationsLink) => {
      var aoSensors = [
        {
          stationId: 1,
          name: 'Molino Branca',
          lat: 44.049168,
          lon: 8.212778,
          value: 1,
          refDate: '/Date(1391542388310)/',
          shortCode: 'STNID',
          alt: '120m',
          otherHtml: '',
          imgPath: 'img/marker.png',
        },
        {
          stationId: 2,
          name: 'Sesta Godano',
          lat: 44.298332,
          lon: 9.6775,
          value: 1,
          refDate: '/Date(1391542388310)/',
          shortCode: 'STNID',
          alt: '120m',
          otherHtml: '',
          imgPath: 'img/marker.png',
        },
        {
          stationId: 1,
          name: 'Quiliano',
          lat: 44.291,
          lon: 8.414,
          value: 1,
          refDate: '/Date(1391542478310)/',
          shortCode: 'STNID',
          alt: '120m',
          otherHtml: '',
          imgPath: 'img/marker.png',
        },
      ];

      var sLayerType = oStationsLink.code;

      aoSensors.forEach(function (oEntry) {
        oEntry.value = Math.round(Math.random() * 410);
      });
      return aoSensors;
    };

    this.getHydroStations = (sectionType: string) => {

      const headers = session.prepareHeaders()

      if (headers) {

        return this.http.get(this.APIURL + '/sections/' + sectionType, {headers: headers}) as Observable<IHydroStation[]>;
      } else {

        return this.http.get(this.APIURL + '/sections/' + sectionType) as Observable<IHydroStation[]>;
      }
    }

    //MOVED IN TABLES.SERVICE
    /*this.getSensorsTable = function(sType) {
        return this.http.get(this.APIURL + '/stations/sensorvalues/'+sType);
    }*/

    this.exportCsvSensorsTable = function (sSensorCode) {
      var sAPIURL = this.APIURL;
      return sAPIURL + '/stations/exportsensorvalues/' + sSensorCode;
    };

    this.getWeather = function () {
      var aoSensors = [
        {
          stationId: 1,
          name: 'Molino Branca',
          lat: 44.049168,
          lon: 8.212778,
          value: 1,
          refDate: '/Date(1391542388310)/',
          shortCode: 'STNID',
          alt: '120m',
          otherHtml: '',
          imgPath: 'img/marker.png',
        },
        {
          stationId: 2,
          name: 'Sesta Godano',
          lat: 44.298332,
          lon: 9.6775,
          value: 1,
          refDate: '/Date(1391542388310)/',
          shortCode: 'STNID',
          alt: '120m',
          otherHtml: '',
          imgPath: 'img/marker.png',
        },
        {
          stationId: 1,
          name: 'Ferrea',
          lat: 44.29194,
          lon: 8.369123,
          value: 1,
          refDate: '/Date(1391542478310)/',
          shortCode: 'STNID',
          alt: '120m',
          otherHtml: '',
          imgPath: 'img/marker.png',
        },
        {
          stationId: 1,
          name: 'Quiliano',
          lat: 44.291,
          lon: 8.414,
          value: 1,
          refDate: '/Date(1391542478310)/',
          shortCode: 'STNID',
          alt: '120m',
          otherHtml: '',
          imgPath: 'img/marker.png',
        },
      ];

      aoSensors.forEach(function (oEntry) {
        oEntry.value = Math.round(Math.random() * 31 + 1);

        var iIndex = Math.round(Math.random() * 31 + 1);
        oEntry.imgPath = 'img/weather/w' + iIndex + '.png';
      });
      return aoSensors;
    };

    this.getStationsTable = function (sType) {
      let headers = this.session.prepareHeaders()
      if (headers) {
        return this.http.get(this.APIURL + '/stations/stationlist/' + sType);
      } else {
        return this.http.get(this.APIURL + '/stations/stationlist/' + sType), {headers: headers};
      }
    };

    this.getStationsTypes = function () {
      return this.http.get(this.APIURL + '/stations/types');
    };

    this.exportCsvStationList = function (sSensorCode) {
      var sAPIURL = this.APIURL;
      return sAPIURL + '/stations/exportlist/' + sSensorCode;
    };

    this.getAggregationsTypes = function () {
      return this.m_aoAggregationTypes;
    };
  }
}
