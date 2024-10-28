import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { FormControl } from '@angular/forms';
import { ConstantsService } from '../../services/constants.service';
import { SettingsService } from '../../services/settings.service';
import { MapComponent } from '../map/map.component';
import { MapService } from '../../services/map.service';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import * as olProj from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import * as _ from 'lodash';
import Geometry from 'ol/geom/Geometry';
import { ISensorType, TablesService } from 'src/app/services/tables.service';
import { TranslationService } from 'src/app/services/translation.service';
import {
  IStaticLayer,
  MapNavigatorService,
} from '../../services/map-navigator.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less'],
})
export class SettingsComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    public session: SessionService,
    public constantsService: ConstantsService,
    private settingsService: SettingsService,
    private mapService: MapService,
    private tablesService: TablesService,
    private translationService: TranslationService,
    private mapNavigatorService: MapNavigatorService
  ) {}

  ngOnInit(): void {
    this.email.disable();
    this.oldPwd.disable();
    this.newPwd.disable();
    this.checkPwd.disable();

    this.tablesService.getSensorTypes().subscribe((response) => {
      let res: ISensorType[] = [];
      _.forEach(response, (el) => {
        res.push({
          code: el.code,
          description:
            this.translationService.menuTranslations[el.description] || '',
        });
      });
      this.sensors = res;
      this.selectedLayerStazioni =
        this.constantsService.sessionData?.defaultSensorType || '';
    });

    this.mapNavigatorService.getStaticLayerLinks().subscribe((response) => {
      let res: IStaticLayer[] = [];
      _.forEach(response, (el) => {
        res.push({
          ...el,
          description_translated:
            this.translationService.menuTranslations[el.description] || '',
        });
      });
      this.staticLayers = res;
      this.selectedStaticLayers =
        this.constantsService.sessionData?.defaultStatics.split(',') || [];
    });
  }

  ngAfterViewInit() {}

  resizeMap() {
    setTimeout(() => {
      this.map?.updateSize();
    }, 0);
  }

  ngOnDestroy() {
    this.disposeMap();
  }

  disposeMap() {
    if (this.map) {
      console.log('disposing map');
      this.map.dispose();
    }
  }

  map: Map | null = null;
  positionLayer: VectorLayer<VectorSource<Geometry>> | null = null;

  datePanel: boolean = true;
  accountPanel: boolean = true;
  mapPanel: boolean = true;

  sensors: ISensorType[] = [];
  staticLayers: IStaticLayer[] = [];
  selectedLayerStazioni = '';
  selectedStaticLayers = [] as string[];

  form = {
    it: {
      email: 'Indirizzo email: ',
      username: 'Username: ',
      oldPwd: 'Vecchia password: ',
      newPwd: 'Nuova password: ',
      checkPwd: 'Conferma password: ',
      latitude: 'Lat',
      longitude: 'Lon',
      zoom: 'Zoom',
      layerStaz: 'Layer stazioni',
      layerStat: 'Layer statici',
    },
    fr: {
      email: 'Indirizzo email',
      username: 'Username',
      oldPwd: 'Vecchia password',
      newPwd: 'Nuova password',
      checkPwd: 'Conferma password',
      latitude: 'Lat',
      longitude: 'Lon',
      zoom: 'Zoom',
      layerStaz: 'Layer stazioni',
      layerStat: 'Layer statici',
    },
  };

  changePassword = false;

  email = new FormControl();
  username = new FormControl();
  oldPwd = new FormControl();
  newPwd = new FormControl();
  checkPwd = new FormControl();
  latitude = new FormControl();
  longitude = new FormControl();
  zoom = new FormControl();
  layerStaz = new FormControl();
  layerStat = new FormControl();

  hideOldPwd: boolean = true;
  hideNewPwd: boolean = true;
  hideCheckPwd: boolean = true;

  saveAccountStatusOK: boolean = false;
  saveAccountResponse: string = '';
  saveMapStatusOK: boolean = false;
  saveMapResponse: string = '';

  setUpMap() {
    console.log(this.getLongitude(), this.getLatitude());
    if (!this.map) {
      this.positionLayer = new VectorLayer({
        source: new VectorSource({
          features: [
            new Feature({
              geometry: new Point(
                olProj.fromLonLat([this.getLongitude(), this.getLatitude()])
              ),
            }),
          ],
        }),
      });

      let options = {
        target: 'settings-map',
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          this.positionLayer,
        ],
        view: new View({
          center: olProj.fromLonLat([this.getLongitude(), this.getLatitude()]),
          zoom: this.getZoom(),
        }),
      };

      this.map = new Map(options);

      this.map.on('singleclick', (e) => {
        if (this.positionLayer) {
          let layer: VectorLayer<VectorSource<Geometry>> | null =
            (_.find(
              this.map?.getLayers().getArray(),
              this.positionLayer
            ) as VectorLayer<VectorSource<Geometry>>) || null;
          if (layer) {
            /*this.map?.removeLayer(this.positionLayer);*/
            this.positionLayer.getSource().clear();
            this.positionLayer.getSource().addFeature(
              new Feature({
                geometry: new Point(e.coordinate),
              })
            );
            this.longitude.setValue(
              olProj.toLonLat(e.coordinate)[0].toFixed(2)
            );
            this.latitude.setValue(olProj.toLonLat(e.coordinate)[1].toFixed(2));
            /*this.map?.addLayer(this.positionLayer);*/
            /*layer;*/
          }
        }
      });
    }
  }

  // onChange of events functions ---------------- //

  onDateTimeChanged(date: Date | null) {
    // if (this.selectedDateTime != '')
    //   this.session.setSelectedDateTimeCookie(this.selectedDateTime);
    // else this.session.deleteSelectedDateTimeCookie();

    if (date) {
      this.session.setSelectedDateTimeCookie(date);
    } else {
      this.session.deleteSelectedDateTimeCookie();
    }

    //this.initTables();
  }

  onChangePassword() {
    this.changePassword = !this.changePassword;
    if (!this.changePassword) {
      this.oldPwd.disable();
      this.newPwd.disable();
      this.checkPwd.disable();
    } else {
      this.oldPwd.enable();
      this.newPwd.enable();
      this.checkPwd.enable();
    }
  }

  // --------------------------------------------- //

  // getters for account info --------------------- //

  getUserName(): string {
    if (this.constantsService.sessionData)
      return this.constantsService.sessionData.name;
    return 'Username';
  }

  getEmail(): string {
    if (this.constantsService.sessionData)
      return this.constantsService.sessionData.mail;
    return 'Indirizzo email';
  }

  getLatitude(): number {
    const defaultLat = this.constantsService.sessionData?.defaultLat;
    return defaultLat ?? 0;
  }

  getLongitude(): number {
    const defaultLon = this.constantsService.sessionData?.defaultLon;
    return defaultLon ?? 0;
  }

  getZoom(): number {
    const defaultZoom = this.constantsService.sessionData?.defaultZoom;
    return defaultZoom ?? 0;
  }

  getRole(): number {
    const role = this.constantsService.sessionData?.role;
    return role ?? 0;
  }

  getLogged(): boolean {
    const logged = this.constantsService.logged;
    return logged ?? false;
  }
  // --------------------------------------------- //

  // save functions------------------------------- //

  saveAccountSettings() {
    this.saveAccountStatusOK = false;
    this.saveAccountResponse = '';

    this.settingsService
      .saveSettings({
        changePassword: this.changePassword,
        confirmPassword: this.checkPwd.value ? this.checkPwd.value : '',
        newPassword: this.newPwd.value ? this.newPwd.value : '',
        oldPassword: this.oldPwd.value ? this.oldPwd.value : '',
        userName: this.username.value
          ? this.username.value
          : this.getUserName(),
        IAccountSettings: true,
      })
      .subscribe((response) => {
        this.saveAccountStatusOK = response.BoolValue;
        this.saveAccountResponse = response.StringValue;
        this.oldPwd.reset();
        this.newPwd.reset();
        this.checkPwd.reset();
      });
  }

  saveMapSettings() {
    this.saveMapStatusOK = false;
    this.saveMapResponse = '';

    this.settingsService
      .saveSettings({
        defaultLat: this.latitude.value
          ? this.latitude.value
          : this.getLatitude(),
        defaultLon: this.longitude.value
          ? this.longitude.value
          : this.getLongitude(),
        defaultMap: '',
        defaultSensorType: this.selectedLayerStazioni,
        // CAST TO STRING - COMMA SEPARATED VALUES
        defaultStatics: `${this.selectedStaticLayers}`,
        defaultZoom: this.zoom.value ? this.zoom.value : this.getZoom(),
        isLogged: this.getLogged(),
        logged: this.getLogged(),
        mail: this.getEmail(),
        name: this.getUserName(),
        role: this.getRole(),
        IMapSettings: true,
      })
      .subscribe((response) => {
        this.saveMapStatusOK = response.BoolValue;
        this.saveMapResponse = response.StringValue;
      });
  }
  // --------------------------------------------- //
}
