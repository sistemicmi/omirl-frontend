import {
  AfterViewChecked,
  Component,
  Inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import { LayerMenuNode } from '../layer-menu/layer-menu.component';
//import { isDefined } from 'angular-util';
import {
  IMap,
  ISensor,
  IHydro,
  MapNavigatorService,
} from 'src/app/services/map-navigator.service';
import {
  IHydroStation,
  IStation,
  StationService,
} from 'src/app/services/station.service';
import {
  IColorRangeEntry,
  IMapLayerData,
  LayerService,
} from 'src/app/services/layer.service';
import { ConstantsService } from 'src/app/services/constants.service';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Circle from 'ol/style/Circle';
import { MapService } from '../../services/map.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TileWMS } from 'ol/source';
import Select, { SelectEvent } from 'ol/interaction/Select';
import Geometry from 'ol/geom/Geometry';
import { MousePosition } from 'ol/control';
import Events from 'ol/events/Event';
import { StationPopupComponent } from '../station-popup/station-popup.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslationService } from 'src/app/services/translation.service';
import * as _ from 'lodash';
import { IconService } from 'src/app/services/icon.service';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MediaObserver } from '@angular/flex-layout';
import { ChartPopupComponent } from '../chart-popup/chart-popup.component';
import { CookieService } from 'ngx-cookie-service';
import { SessionService } from 'src/app/services/session.service';
import { StationhydroPopupComponent } from '../stationhydro-popup/stationhydro-popup.component';
import { ChartHydroPopupComponent } from '../chart-hydro-popup/chart-hydro-popup.component';
import { ComponentType } from '@angular/cdk/portal';
import { WebcamPopupComponent } from '../webcam-popup/webcam-popup.component';
import 'ol/ol.css';
import Overlay from 'ol/Overlay';
import { combineLatest } from 'rxjs';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less'],
})
export class MapComponent implements OnInit {
  map!: Map;
  selectedSensorDateTime?: Date = new Date();
  selectedSensorDateTimeIcon?: string;
  selectedSensorIcon: string = '';
  m_dCenterLon: number = 8.6;
  m_dCenterLat = 44.2;
  m_iCenterZoom = 9.5;
  isLayerMenuOpen: boolean = true;
  isLayerMenuRail: boolean = false;
  selectedMapDateTime: Date = new Date();
  selectedMapDateTimeIcon: string = '';
  selectedSatelliteLink: string = '';
  selectedRadarLink: string = '';
  selectedFeature: Feature<Geometry> | null = null;
  //stationPopup: MatDialogRef<StationPopupComponent> | MatDialogRef<StationhydroPopupComponent> | null = null;
  stationPopup: MatDialogRef<any> | null = null;
  selectedSensorCode!: string;
  selectedSensorDescription: string = '';
  selectedMapCode!: string;
  selectedMapIcon: string = '';
  selectedMapDescription: string = '';
  selectedHydroIcon: string = '';
  selectedHydroDescription: string = '';
  selectedRadarIcon: string = '';
  selectedRadarDescription: string = '';
  selectedSatIcon: string = '';
  selectedSatDescription: string = '';
  activeSensorNode: LayerMenuNode | undefined = undefined;
  activeMapNode: LayerMenuNode | undefined = undefined;
  activeHydroNode: LayerMenuNode | undefined = undefined;
  activeRadNode: LayerMenuNode | undefined = undefined;
  activeSatNode: LayerMenuNode | undefined = undefined;
  isLegendSensorVisible: boolean = true;
  isLegendMapVisible: boolean = true;
  stationBottomSheet: MatBottomSheetRef<any> | null = null;
  selectedDateTime: Date | null = null;
  hydroSensorLayerColorRanges: IColorRangeEntry[] = [
    { lmt: 1, clr: '#00DC00' },
    { lmt: 2, clr: '#E6DC32' },
    { lmt: 3, clr: '#F08228' },
    { lmt: 4, clr: '#FA3C3C' },
    { lmt: 5, clr: '#FA3C3C' },
    { lmt: 10000, clr: '#FFFFFF' },
  ];
  infoLayerSelected: boolean = false;
  overlay: Overlay | undefined;
  overlayFeatures: any[] = [];
  objectKeys = Object.keys; //used to make Object.keys available in template
  menuStatus: number = 2;

  constructor(
    private stationService: StationService,
    private layerService: LayerService,
    public constantsService: ConstantsService,
    private mapService: MapService,
    private mapNavigatorService: MapNavigatorService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private translate: TranslationService,
    private icons: IconService,
    private bottomSheet: MatBottomSheet,
    public mediaObserver: MediaObserver,
    public session: SessionService,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.mapService = mapService;
    icons.registerSvgIcon('btn-arrow-left.svg');
    icons.registerSvgIcon('btn-arrow-right.svg');
    icons.registerSvgIconFromAssetsImg('layers.svg');
    icons.registerSvgIconFromAssetsImg('info-layer.svg');
  }

  ngOnInit(): void {
    console.log('sessiondata: ', this.constantsService.sessionData);

    this.route.paramMap.subscribe((params: ParamMap) => {
      if (this.constantsService.logged && params.get('reftime')) {
        this.session.setSelectedDateTimeCookie(
          new Date(parseInt(params.get('reftime') as string))
        );
      } else {
        this.session.deleteSelectedDateTimeCookie();
      }
    });

    this.map = this.mapService.new();
    setTimeout(() => {
      this.map.updateSize();
    }, 0);

    //refresh map data periodically
    setInterval(() => {
      if (this.activeSensorNode?.sensor) {
        this.showStationsLayer(this.activeSensorNode.sensor);
      }

      if (this.activeMapNode?.map) {
        this.showMapLayer(this.activeMapNode);
      }

      if (this.activeHydroNode?.hydro) {
        this.showHydroLayer(this.activeHydroNode?.hydro);
      }

      if (this.activeRadNode?.radar) {
        this.showRadLayer(this.activeRadNode);
      }

      if (this.activeSatNode?.sat) {
        this.showSatLayer(this.activeSatNode);
      }
    }, 1000 * 60 * 5);
  }

  ngAfterViewInit() {
    const container = document.getElementById('popup');

    /**
     * Create an overlay to anchor the popup to the map.
     */
    this.overlay = new Overlay({
      element: container!,
      autoPan: false,
    });

    //handler for layer info button
    this.map.on('singleclick', (evt) => {
      //show info only if info button is selected
      if (!this.infoLayerSelected) {
        return;
      }

      this.clearInfoLayer();

      const coordinate = evt.coordinate;
      const infoUrls = this.layerService.getQueryLayers(evt);
      console.log('layer info urls: ', infoUrls);
      if (_.isArray(infoUrls) && infoUrls.length > 0) {
        this.overlay?.setPosition(coordinate);
        this.map.addOverlay(this.overlay!);

        let infoLayerPromises = [];
        for (const url of infoUrls) {
          if (url) {
            infoLayerPromises.push(this.layerService.getLayerInfo(url));
          }
        }

        combineLatest(infoLayerPromises).subscribe(
          (infoData: any[]) => {
            //console.log("layer info data: ", infoData)
            if (container) {
              container.style.display = 'block';
            }

            for (const infoDataEntry of infoData) {
              //console.log("infodataentry:", infoDataEntry)
              this.overlayFeatures.push(infoDataEntry.features[0]);
            }

            //console.log("pushed features: ", this.overlayFeatures)
          },
          (err) => {
            console.log('Error fetching layer info: ', err);
            this.overlayFeatures.push({ properties: { Errore: err.name } });
          }
        );
      }
    });
  }

  onMenuStatusChange(e: MatSliderChange) {
    switch (e.value) {
      case 0: {
        this.isLayerMenuOpen = false;
        this.isLayerMenuRail = false;
        setTimeout(() => {
          this.map.updateSize();
        }, 100);
        break;
      }
      case 1: {
        this.isLayerMenuOpen = true;
        this.isLayerMenuRail = true;
        setTimeout(() => {
          this.map.updateSize();
        }, 100);
        break;
      }
      case 2: {
        this.isLayerMenuOpen = true;
        this.isLayerMenuRail = false;
        setTimeout(() => {
          this.map.updateSize();
        }, 100);
        break;
      }
    }
  }

  formatLabel(value: number) {
    let label = '';
    switch (value) {
      case 0: {
        label = 'Nascosto';
        break;
      }
      case 1: {
        label = 'Icone';
        break;
      }
      case 2: {
        label = 'Ampio';
        break;
      }
    }
    return label;
  }

  clearInfoLayer() {
    this.overlayFeatures = [];
    this.overlay?.setPosition([0, 0]);
  }

  ngOnDestroy() {
    if (this.map) {
      console.log('disposing map');
      this.map.dispose();
    }
  }

  createMap(): void {
    this.map = this.mapService.new();
    setTimeout(() => {
      this.map.updateSize();
    }, 0);
  }

  onLayerMenuItemsChanged(nodes: (LayerMenuNode | undefined)[]) {
    console.log('caught layermenuitem clicked event on node: %o', nodes);
    //check if node is station layer or map layer
    if (
      (!nodes[0] || !_.isEqual(nodes[0], this.activeSensorNode)) &&
      (!nodes[2] || !_.isEqual(nodes[2], this.activeHydroNode))
    ) {
      //if node has been deselected, remove the related layer
      this.activeSensorNode = undefined;
      this.selectedSensorCode = '';
      this.selectedSensorDateTime = undefined;
    }

    //if sensor is present, then it's a station layer
    if (
      nodes[0]?.sensor &&
      (!_.isEqual(nodes[0], this.activeSensorNode) ||
        this.session.getSelectedDateTimeCookie() != this.selectedDateTime)
    ) {
      this.showStationsLayer(nodes[0].sensor);
    }

    this.activeSensorNode = nodes[0];

    //check if a map node is selected too
    if (!nodes[1] || !_.isEqual(nodes[1], this.activeMapNode)) {
      //if node has been deselected, remove the related layer
      this.activeMapNode = undefined;
      this.selectedMapCode = '';
      //this.selectedMapDateTime = undefined
    }

    //if map is present, then it's a map layer
    if (
      nodes[1]?.map &&
      (!_.isEqual(nodes[1], this.activeMapNode) ||
        this.session.getSelectedDateTimeCookie() != this.selectedDateTime)
    ) {
      this.showMapLayer(nodes[1]);
    }

    this.activeMapNode = nodes[1];

    //check if a hydro node is selected too
    if (!nodes[2] || !_.isEqual(nodes[2], this.activeHydroNode)) {
      //if node has been deselected, remove the related layer
      this.activeHydroNode = undefined;
      //this.selectedMapDateTime = undefined
    }
    //if hydro is present, then it's a hydro layer
    if (
      nodes[2]?.hydro &&
      (!_.isEqual(nodes[2], this.activeHydroNode) ||
        this.session.getSelectedDateTimeCookie() != this.selectedDateTime)
    ) {
      this.showHydroLayer(nodes[2].hydro);
    }

    this.activeHydroNode = nodes[2];

    //check if a sat node is selected too
    if (!nodes[3] && !_.isEqual(nodes[3], this.activeSatNode)) {
      //if (!nodes[3]) {
      //if node has been deselected, remove the related layer
      this.activeSatNode = undefined;
    } // else {
    //if sat is present, then it's a sat layer
    if (
      nodes[3]?.sat &&
      (!_.isEqual(nodes[3], this.activeSatNode) ||
        this.session.getSelectedDateTimeCookie() != this.selectedDateTime)
    ) {
      //if (nodes[3]?.sat) {
      this.showSatLayer(nodes[3]!);
    }

    this.activeSatNode = nodes[3];

    //check if a radar node is selected too
    if (!nodes[4] && !_.isEqual(nodes[4], this.activeRadNode)) {
      //if (!nodes[3]) {
      //if node has been deselected, remove the related layer
      this.activeRadNode = undefined;
    } // else {
    //if sat is present, then it's a sat layer
    if (
      nodes[4]?.radar &&
      (!_.isEqual(nodes[4], this.activeRadNode) ||
        this.session.getSelectedDateTimeCookie() != this.selectedDateTime)
    ) {
      //if (nodes[3]?.sat) {
      this.showRadLayer(nodes[4]!);
    }

    this.activeRadNode = nodes[4];

    //remove layer if neither map nor sat node is selected
    if (!this.activeMapNode && !this.activeSatNode && !this.activeRadNode) {
      this.selectedMapDescription = '';
      this.selectedMapIcon = '';
      this.map.removeLayer(this.layerService.getDynamicLayer());
    }

    if (!this.activeSensorNode && !this.activeHydroNode) {
      this.map.removeLayer(this.layerService.getSensorsLayer());
      this.selectedSensorDescription = '';
      this.selectedSensorIcon = '';
    }

    this.selectedDateTime = this.session.getSelectedDateTimeCookie();
  }

  compareStations = (oFirst: any, oSecond: any) => {
    if (oFirst.value < oSecond.value) return -1;
    if (oFirst.value > oSecond.value) return 1;
    return 0;
  };

  getFeatureOpacity = (oReferenceDate: Date | null) => {
    // Get Now
    let oDate = this.session.getSelectedDateTimeCookie();
    if (oDate == null) oDate = new Date();

    // Compute time difference
    var dtDifference = oDate.getTime() - oReferenceDate!.getTime();

    // How it is in minutes?
    var iMinutes = 1000 * 60;

    var iDeltaMinutes = Math.round(dtDifference / iMinutes);

    var iMaxDelayMinutes = 4320;

    if (iDeltaMinutes > iMaxDelayMinutes) return -1.0;

    var dDelayRatio = iDeltaMinutes / iMaxDelayMinutes;

    dDelayRatio = 1.0 - dDelayRatio;

    dDelayRatio *= 0.9;

    return dDelayRatio;
  };

  /**
   * Function called to show the selected sensor layer
   * @param sensorData
   */
  showStationsLayer = (sensorData: ISensor) => {
    //var oServiceVar = this;

    this.selectedSensorIcon = this.icons.getFileNameWithoutExtension(
      sensorData.imageLinkOff
    );
    this.selectedSensorDescription =
      this.translate.menuTranslations[sensorData.description];

    // Obtain Stations Values from the server
    this.stationService.getStations(sensorData).subscribe(
      (data: any[]) => {
        this.parseSensorFeaturesFromWS(data, sensorData);
      },
      (error: any) => {
        console.log('Error contacting Omirl Server: %o', error);
      }
    );
  };

  parseSensorFeaturesFromWS = (stations: any[], sensorData: ISensor) => {
    //update date time info
    this.selectedSensorDateTime = new Date();
    this.selectedSensorDateTimeIcon = '';
    if (stations != null && stations.length > 0) {
      if (stations[0].updateDateTime && stations[0].updateDateTime != null) {
        var oDate = new Date(stations[0].updateDateTime + ' UTC');
        this.selectedSensorDateTime = oDate;
        this.selectedSensorDateTimeIcon = '';
      }
    }

    // remove current Sensors Layer from the map
    this.map.removeLayer(this.layerService.getSensorsLayer());

    // Clear the layer
    if (this.layerService.getSensorsLayer().getSource()) {
      this.layerService.getSensorsLayer().getSource().clear();
    }

    // Projection change for points
    // var epsg4326 =  new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
    // var projectTo = this.map.getProjectionObject(); //The map projection (Spherical Mercator)

    // Get System Reference Date
    let systemRefDate = this.session.getSelectedDateTimeCookie();
    if (systemRefDate == null) systemRefDate = new Date();

    // For each station
    let features = [];

    stations.sort(this.compareStations);

    for (const station of stations) {
      var oMarkerIcon = new Point(
        olProj.fromLonLat([station.lon, station.lat])
      );

      // Get Increment from server
      let increment = station.increment;

      var oReferenceDate = station.refDate
        ? new Date(station.refDate + 'Z')
        : null;
      var dOpacity = oReferenceDate
        ? this.getFeatureOpacity(oReferenceDate)
        : undefined;

      var lTimeGap = oReferenceDate
        ? systemRefDate.getTime() - oReferenceDate.getTime()
        : null;
      if (lTimeGap && lTimeGap > 7 * 24 * 60 * 60 * 1000) continue;

      if (sensorData.code == 'Elio') {
        station.value = (station.value * 100) / 30;
      }

      if (sensorData.code == 'Foglie') {
        station.value = (station.value * 100) / 30;
      }

      //color
      var dValue = station.value;

      if (sensorData.code == 'Sfloc') {
        var oRefDate = new Date(station.refDate);

        dValue = oRefDate.getHours() * 60;
        dValue += oRefDate.getMinutes();
      } else if (sensorData.code == 'Idro') {
        dValue = station.otherHtml;
      }

      let oColor = '#ffffff';
      if (sensorData.code == 'Idro') {
        sensorData.legends = [
          { lmt: 1, clr: '#00DC00' },
          { lmt: 2, clr: '#E6DC32' },
          { lmt: 3, clr: '#F08228' },
          { lmt: 4, clr: '#FA3C3C' },
          { lmt: 5, clr: '#FA3C3C' },
          { lmt: 10000, clr: '#FFFFFF' },
        ];
      }

      if (sensorData.legends) {
        for (var iColors = 0; iColors < sensorData.legends.length; iColors++) {
          if (dValue < sensorData.legends[iColors].lmt) {
            oColor = sensorData.legends[iColors].clr;
            break;
          }
        }
      }

      var feature = new Feature(
        oMarkerIcon
        //{ stroke: new Stroke({
        //   color: '#000000',
        //   width: 1.25
        // }),
        // description: station.description,
        // //,{externalGraphic: oStation.imgPath, graphicHeight: 32, graphicWidth: 32, graphicXOffset:0, graphicYOffset:0, title: oStation.name + " " + oStation.value }
        // title: station.name + " " + station.value}
      );

      // Set attributes of the Feature
      feature.setProperties({
        // Station Id
        stationId: station.stationId,
        // Station Name
        name: station.name,
        // Sensor Value
        value: station.value,
        // Reference Date
        referenceDate: station.refDate,
        // Measure Unit
        measureUnit: sensorData.mesUnit,
        // Other Html content for the pop up, received from the server
        otherHtml: station.otherHtml,
        // Altitude
        altitude: station.alt,
        // Coordinates
        lat: station.lat,
        lon: station.lon,
        // Station Code
        shortCode: station.shortCode,
        // Image Link to use in the popup
        imageLinkInv: sensorData.imageLinkInv,
        // Image Link to use in the popup
        imageLinkOff: sensorData.imageLinkOff,
        // Sensor Type
        sensorType: sensorData.code,
        sensorDescription: sensorData.description,
        // Increment
        increment: increment,
        // Municipality
        municipality: station.municipality,
        // Image Path
        imgPath: station.imgPath,
        // Opacity
        opacity: dOpacity,
        //Color
        color: oColor,
      });

      // Add the feature to the array
      features.push(feature);
    }

    // Add feature array to the layer
    this.layerService.getSensorsLayer().getSource().addFeatures(features);

    // Add the layer to the map
    this.map.addLayer(this.layerService.getSensorsLayer());

    //remove old interactions (hover) from the map
    this.mapService.removeSelectHoverInteractions();

    //add click and hover interactions
    if (sensorData.code == 'webcam') {
      this.addInteractions(StationPopupComponent, WebcamPopupComponent);
    } else {
      this.addInteractions(StationPopupComponent, ChartPopupComponent);
    }

    //this.map.setLayerIndex(this.layerService.getSensorsLayer(), this.layerService.getSensorsLayerIndex());

    // //Refresh WebCam
    // if (feature) {
    //     if (feature.attributes.sensorType == 'webcam') {
    //         WebcamDialog.refreshWebcamImage(feature.attributes.shortCode, feature.attributes.imgPath);
    //     }
    // }

    // // Feature Click and Hover Control: added?
    // if (this.stationsPopupControllerAdded == false) {

    //     // Create the Control
    //     var oPopupCtrl = new OpenLayers.Control.SelectFeature(oServiceVar.m_oLayerService.getSensorsLayer(), {
    //         hover: true,
    //         onSelect: function(feature) {
    //             // Hover Select: call internal function
    //             oMapController.showStationsPopup(feature);
    //         },
    //         onUnselect: function(feature) {
    //             // Hover Unselect: remove pop u
    //             // TODO POPUP
    //             feature.layer.map.removePopup(feature.popup);
    //         },
    //         callbacks: {
    //             // Click
    //             click: function(feature) {
    //                 // Show chart
    //                 oMapController.showStationsChart(feature);
    //             }
    //         }
    //     });

    //     // Add and activate the control
    //     oServiceVar.m_oMapService.map.addControl(oPopupCtrl);
    //     oPopupCtrl.activate();

    //     // Remember it exists now
    //     oServiceVar.m_oMapService.stationsPopupControllerAdded = true;
    // }

    if (stations.length == 0) {
      // If the layer is 'Fulminazioni (Sfloc)' change the alert message
      // into "Nessuna fulminazione registrata"
      if (sensorData.code == 'Sfloc') {
        // oServiceVar.m_oTranslateService('MAP_NOT_AVAILABLE_SFLOC').then(function(msg){
        //     oServiceVar.activeDirectiveScope.callbackDeselectLastClickedMenuItem(oSensorLink.myLevel);
        //     vex.dialog.alert({
        //         message: msg
        //     });
        // });
      }

      // oServiceVar.m_oTranslateService('MAP_NOT_AVAILABLE').then(function(msg){
      //     oServiceVar.activeDirectiveScope.callbackDeselectLastClickedMenuItem(oSensorLink.myLevel);

      //     vex.dialog.alert({
      //         message: msg
      //     });

      // });
    }
  };

  parseHydroFeaturesFromWS = (
    stations: IHydroStation[],
    sensorData: IHydro
  ) => {
    //update date time info
    this.selectedSensorDateTime = new Date();
    this.selectedSensorDateTimeIcon = '';
    if (stations != null && stations.length > 0) {
      if (stations[0].updateDateTime && stations[0].updateDateTime != null) {
        var oDate = new Date(stations[0].updateDateTime + ' UTC');
        this.selectedSensorDateTime = oDate;
        this.selectedSensorDateTimeIcon = '';
      }
    }

    // remove current Sensors Layer from the map
    this.map.removeLayer(this.layerService.getSensorsLayer());

    // Clear the layer
    if (this.layerService.getSensorsLayer().getSource()) {
      this.layerService.getSensorsLayer().getSource().clear();
    }

    // Projection change for points
    // var epsg4326 =  new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
    // var projectTo = this.map.getProjectionObject(); //The map projection (Spherical Mercator)

    // Get System Reference Date
    let systemRefDate = this.session.getSelectedDateTimeCookie();
    if (systemRefDate == null) systemRefDate = new Date();

    // For each station
    let features = [];

    stations.sort(this.compareStations);

    for (const station of stations) {
      var oMarkerIcon = new Point(
        olProj.fromLonLat([station.lon, station.lat])
      );

      // Get Increment from server
      //let increment = station.increment;

      var oReferenceDate = station.refDate
        ? new Date(station.refDate + 'Z')
        : null;
      var dOpacity = oReferenceDate
        ? this.getFeatureOpacity(oReferenceDate)
        : undefined;

      var lTimeGap = oReferenceDate
        ? systemRefDate.getTime() - oReferenceDate.getTime()
        : null;
      if (lTimeGap && lTimeGap > 7 * 24 * 60 * 60 * 1000) continue;

      //color
      var dValue = station.value;

      let oColor = '#ffffff';

      oColor = this.getHydroFillColor(station.color);

      var feature = new Feature(oMarkerIcon);

      // Set attributes of the Feature
      feature.setProperties({
        // Station Id
        stationId: station.code,
        // Station Name
        name: station.name,
        // Sensor Value
        value: station.value,
        // Reference Date
        referenceDate: station.refDate,
        // Measure Unit
        measureUnit: sensorData.mesUnit,
        // Other Html content for the pop up, received from the server
        otherHtml: station.otherHtml,
        // Altitude
        alt: station.alt,
        // Coordinates
        lat: station.lat,
        lon: station.lon,
        // Station Code
        shortCode: station.code,
        // Image Link to use in the popup
        imageLinkInv: sensorData.imageLinkInv,
        // Image Link to use in the popup
        imageLinkOff: sensorData.link,
        // Sensor Type
        sensorType: sensorData.linkCode,
        sensorDescription: sensorData.description,
        // Municipality
        municipality: station.municipality,
        // Image Path
        imgPath: station.imgPath,
        // Opacity
        opacity: dOpacity,
        //Color
        color: oColor,
        //specific hydro properties
        basin: station.basin,
        basinArea: station.basinArea,
        basinClass: station.basinClass,
        river: station.river,
        warningArea: station.warningArea,
        layerType: 'hydro',
      });

      // Add the feature to the array
      features.push(feature);
    }

    // Add feature array to the layer
    this.layerService.getSensorsLayer().getSource().addFeatures(features);

    // Add the layer to the map
    this.map.addLayer(this.layerService.getSensorsLayer());

    //remove old interactions (hover) from the map
    this.mapService.removeSelectHoverInteractions();

    this.addInteractions(StationhydroPopupComponent, ChartHydroPopupComponent);
  };

  addInteractions = <T, U>(
    hoverComponentType: ComponentType<T>,
    clickComponentType: ComponentType<U>
  ) => {
    if (!this.constantsService.isMobile) {
      this.mapService.addSelectHoverInteraction((event) => {
        //console.log('target: %o', event.target as Select);

        if (event.deselected.length > 0) {
          //console.log('Clearing timeout ', event.deselected[0].get('timeoutRef'))
          clearTimeout(event.deselected[0].get('timeoutRef'));
          if (this.stationPopup) {
            this.stationPopup.close();
            this.selectedFeature = null;
            //return to prevent popup reopening
            return;
          }
        }

        if (
          (event.target as Select).getFeatures().getLength() == 0 &&
          (event.target as Select).getFeatures().getArray()[0] ==
            this.selectedFeature
        ) {
          //no features under the mouse pointer, skip
        } else {
          //found a feature under mousepointer: open popup with station info
          //get mouse coordinates in pixels

          let popupTimeoutRef = setTimeout(() => {
            let mouseScreenPositionX =
              event.mapBrowserEvent.originalEvent.clientX - 5;
            let mouseScreenPositionY =
              event.mapBrowserEvent.originalEvent.clientY - 5;
            let dialogPosition = {
              left: mouseScreenPositionX + 'px',
              top: mouseScreenPositionY + 'px',
            };
            this.selectedFeature = (event.target as Select)
              .getFeatures()
              .getArray()[0];

            //console.log('selected feature props: ', this.selectedFeature?.getProperties())

            let featureValues;

            try {
              if (!this.selectedFeature) {
                return;
              }

              featureValues = this.selectedFeature.getProperties();

              if (this.stationPopup) {
                this.stationPopup.close();
              }
              this.stationPopup = this.dialog.open(hoverComponentType, {
                hasBackdrop: false,
                position: dialogPosition,
                data: featureValues,
              });
              this.stationPopup.afterOpened().subscribe((res) => {
                //console.log("this: ", this.stationPopup?.id)
                let dialog = <HTMLElement>(
                  document.querySelector('#' + this.stationPopup?.id)
                );
                //console.log("dialog:", dialog)
                if (dialog) {
                  if (
                    dialog.offsetLeft + dialog.clientWidth >
                    window.innerWidth
                  ) {
                    let defaultWidth = 200;
                    //dialog.style.left = (mouseScreenPositionX - dialog.clientWidth + 5) + "px"
                    if (dialog.parentElement) {
                      dialog.parentElement.style.marginLeft =
                        mouseScreenPositionX - defaultWidth + 5 + 'px';
                    }
                  }
                  if (
                    dialog.offsetTop + dialog.clientHeight >
                    window.innerHeight
                  ) {
                    //let defaultWidth = 200
                    //dialog.style.left = (mouseScreenPositionX - dialog.clientWidth + 5) + "px"
                    if (dialog.parentElement) {
                      dialog.parentElement.style.marginTop =
                        mouseScreenPositionY - dialog.clientHeight + 5 + 'px';
                    }
                  }
                }
              });
            } catch (ex) {
              console.log(ex);
            }
          }, 500) as unknown as number;

          (event.target as Select)
            .getFeatures()
            .getArray()[0]
            .set('timeoutRef', popupTimeoutRef);
        }
      }, this.layerService.getStationsStyle);
    }

    if (this.activeSensorNode?.sensor?.code != 'Sfloc') {
      this.mapService.addSelectClickInteraction((event) => {
        setTimeout(() => {
          if ((event.target as Select).getFeatures().getLength() != 0) {
            this.selectedFeature = (event.target as Select)
              .getFeatures()
              .getArray()[0];
            let featureValues: IStation = <IStation>(
              this.selectedFeature.getProperties()
            );
            if (this.constantsService.isMobile) {
              //if (this.mediaObserver.isActive('xs')) {
              this.stationBottomSheet = this.bottomSheet.open(
                hoverComponentType,
                {
                  data: featureValues,
                }
              );

              this.stationBottomSheet.afterDismissed().subscribe((res) => {
                (event.target as Select).getFeatures().clear();
              });
            } else {
              //prevent opening hover popup on desktop when clicking feature
              if (this.selectedFeature) {
                clearTimeout(this.selectedFeature.get('timeoutRef'));
              }

              if (this.stationPopup) {
                this.stationPopup.close();
              }
              this.dialog.open(clickComponentType, {
                maxWidth: '95vw',
                hasBackdrop: false,
                data: featureValues,
              });
            }
          }
        }, 100);
      });
    }
  };

  showHydroLayer = (sensorData: IHydro) => {
    //this.selectedSensorIcon = this.icons.getFileNameWithoutExtension(sensorData.link)
    this.selectedSensorIcon = this.icons.registerSvgIcon('Idro_1.svg');
    this.selectedSensorDescription =
      this.translate.menuTranslations[sensorData.description];

    this.stationService
      .getHydroStations(sensorData.linkCode)
      .subscribe((data: IHydroStation[]) => {
        this.parseHydroFeaturesFromWS(data, sensorData);
      });
  };

  getHydroFillColor = (color: number) => {
    try {
      //color grey, station not present or enabled
      if (color == -1) return '#808080';

      let oColor = '#808080';

      for (
        let iCount = 0;
        iCount < this.hydroSensorLayerColorRanges.length;
        iCount++
      ) {
        if (color < this.hydroSensorLayerColorRanges[iCount].lmt) {
          oColor = this.hydroSensorLayerColorRanges[iCount].clr;
          break;
        }
      }

      //oService.m_aoHydroSensorLayerColorRanges[feature.attributes.color];

      return oColor;
    } catch (e) {
      return '#FFFFFF';
    }
  };

  opacityFunction = (featureOpacity: number) => {
    if (featureOpacity == -1.0) {
      return 0.9;
    }
    return featureOpacity;
  };

  /**
   * Function called to show the selected map layer
   * @param node the selected menu node
   */
  showMapLayer = (node: LayerMenuNode) => {
    let mapData: IMap = node.map!;

    let modifier: string = 'none';

    //add third level modifier for map layer type (interpolata, comuni,...)
    if (node.map && node.map.layerIDModifier) {
      modifier = node.map.layerIDModifier;
    }

    //this.selectedMapIcon = this.icons.getFileNameWithoutExtension(mapData.link)
    this.selectedMapIcon = node.treePath[0].icon;
    this.selectedMapDescription =
      node.treePath[0].description + ' | ' + node.treePath[1].description;

    //reset date time
    this.selectedMapDateTime = new Date();
    this.selectedMapDateTimeIcon = '';

    // Obtain Stations Values from the server
    this.mapNavigatorService
      .getSatelliteLayerDetails(
        mapData.linkCode || mapData.layerID.split(':').pop() || ''
      )
      .subscribe(
        (data) => {
          if (data) {
            if (data.updateDateTime && data.updateDateTime != null) {
              var oDate = new Date(data.updateDateTime + ' UTC');
              this.selectedMapDateTime = oDate;
              this.selectedMapDateTimeIcon = '';
            }
          }
        },
        (error: any) => {
          console.log('Error contacting Omirl Server: %o', error);
        }
      );

    let layerCode = mapData.layerID;
    let linkParts = layerCode.split(':');

    if (linkParts != null) {
      layerCode = linkParts[1];
    }

    let oldLayerIdentifier = '';

    if (this.layerService.getDynamicLayer() != null) {
      let dynLayer = this.layerService.getDynamicLayer();
      oldLayerIdentifier = dynLayer.getSource().getParams().LAYER;
      dynLayer.setZIndex(0);
      this.layerService.getSensorsLayer().setZIndex(20);
    }

    this.selectedSatelliteLink = '';
    this.selectedRadarLink = '';

    this.layerService.getLayerId(layerCode, modifier).subscribe(
      (data: IMapLayerData) => {
        //oController.setSelectedMapLinkOnScreen(oController,oMapLink);

        if (data.layerId != null && data.layerId != oldLayerIdentifier) {
          // Remove current map layer TODO check if is really needed
          if (this.layerService.getDynamicLayer() != null) {
            if (this.mapService.map) {
              this.mapService.map.removeLayer(
                this.layerService.getDynamicLayer()
              );
            }
          }

          // Create WMS Layer
          let mapLayer = this.layerService.getDynamicLayer();
          mapLayer.setSource(
            new TileWMS({
              url: mapData.layerWMS,
              params: { LAYERS: data.layerId },
              //transparent: "true",
              //format: "image/png"
            })
          );
          //mapLayer.isBaseLayer = false;

          mapLayer.setOpacity(0.6);
          // Add the new layer to the map
          //oController.m_oLayerService.setDynamicLayer(mapLayer);
          if (this.map) {
            this.map.addLayer(mapLayer);
          }
          //this.mapService.map.setLayerIndex(mapLayer, oController.m_oLayerService.getBaseLayers().length);
        } else if (data.layerId == null) {
          // Remove last one
          if (this.layerService.getDynamicLayer() != null) {
            if (this.mapService.map) {
              this.mapService.map.removeLayer(
                this.layerService.getDynamicLayer()
              );
              this.layerService.setDynamicLayer(null);
            }
          }

          // oController.m_oTranslateService('MAP_NOT_AVAILABLE').then(function(msg)
          // {
          //     oController.activeDirectiveScope.callbackDeselectLastClickedMenuItem(oMapLink.myLevel);

          //     vex.dialog.alert({
          //         message: msg
          //     });
          //     //alert(msg);
          // });

          this.dialog.open(ErrorDialogComponent, {
            data: { msg: $localize`:@@LAYER_NOT_FOUND:Layer non disponibile` },
          });
        }

        //set date time
        // if (angular.isDefined(data.updateDateTime) && data.updateDateTime != null) {
        //     var oDate = new Date(data.updateDateTime + " UTC");
        //     oController.m_oTranslateService('MAP_LAYERDATEINFO', {data: oDate.toString()}).then(function (msg) {
        //         oController.m_oSelectedMapDateTimeInfo = msg;
        //         oController.m_oSelectedMapDateTimeIcon = oMapLink.link;
        //     });
        // }
      },
      //err:
      (data) => {
        // oController.setSelectedMapLinkOnScreen(oController,oController.m_oSelectedMapLink)
        // oController.m_oTranslateService('ERRORCONTACTSERVER').then(function(error){
        //     vex.dialog.alert({
        //             message: error,
        //         })
        //     //alert(error);
      }
    );
  };

  /**
   * Function called to show the selected sat layer
   * @param node the selected menu node
   */
  showSatLayer = (node: LayerMenuNode) => {
    let satData: IMap = node.sat!;

    //for future use in case of multiple level menu
    let modifier: string = 'none';

    //this.selectedMapIcon = this.icons.getFileNameWithoutExtension(mapData.link)
    this.selectedMapIcon = node.treePath[0].icon;
    //this.selectedSatDescription = node.treePath[0].description + ' | ' + node.treePath[1].description
    this.selectedMapDescription = node.treePath[0].description;

    //reset date time
    this.selectedMapDateTime = new Date();
    this.selectedMapDateTimeIcon = '';

    // Obtain Stations Values from the server
    this.mapNavigatorService
      .getSatelliteLayerDetails(satData.linkCode || '')
      .subscribe(
        (data) => {
          if (data) {
            if (data.updateDateTime && data.updateDateTime != null) {
              var oDate = new Date(data.updateDateTime + ' UTC');
              this.selectedMapDateTime = oDate;
              this.selectedMapDateTimeIcon = '';
            }
          }
        },
        (error: any) => {
          console.log('Error contacting Omirl Server: %o', error);
        }
      );

    let oldLayerIdentifier = '';

    if (this.layerService.getDynamicLayer() != null) {
      let dynLayer = this.layerService.getDynamicLayer();
      oldLayerIdentifier = dynLayer.getSource().getParams().LAYER;
      dynLayer.setZIndex(0);
      this.layerService.getSensorsLayer().setZIndex(20);
    }

    this.selectedSatelliteLink = '';
    this.selectedRadarLink = '';

    this.layerService.getLayerId(satData.linkCode!, modifier).subscribe(
      (data: IMapLayerData) => {
        //oController.setSelectedMapLinkOnScreen(oController,oMapLink);

        if (data.layerId != null && data.layerId != oldLayerIdentifier) {
          // Remove current map layer TODO check if is really needed
          if (this.layerService.getDynamicLayer() != null) {
            if (this.mapService.map) {
              this.mapService.map.removeLayer(
                this.layerService.getDynamicLayer()
              );
            }
          }

          // Create WMS Layer
          let mapLayer = this.layerService.getDynamicLayer();
          mapLayer.setSource(
            new TileWMS({
              url: satData.layerWMS,
              params: { LAYERS: data.layerId },
              //transparent: "true",
              //format: "image/png"
            })
          );
          //mapLayer.isBaseLayer = false;

          mapLayer.setOpacity(0.6);
          // Add the new layer to the map
          //oController.m_oLayerService.setDynamicLayer(mapLayer);
          if (this.map) {
            this.map.addLayer(mapLayer);
          }
          //this.mapService.map.setLayerIndex(mapLayer, oController.m_oLayerService.getBaseLayers().length);
        } else if (data.layerId == null) {
          // Remove last one
          if (this.layerService.getDynamicLayer() != null) {
            if (this.mapService.map) {
              this.mapService.map.removeLayer(
                this.layerService.getDynamicLayer()
              );
              this.layerService.setDynamicLayer(null);
            }
          }

          // oController.m_oTranslateService('MAP_NOT_AVAILABLE').then(function(msg)
          // {
          //     oController.activeDirectiveScope.callbackDeselectLastClickedMenuItem(oMapLink.myLevel);

          //     vex.dialog.alert({
          //         message: msg
          //     });
          //     //alert(msg);
          // });

          this.dialog.open(ErrorDialogComponent, {
            data: { msg: $localize`:@@LAYER_NOT_FOUND:Layer non disponibile` },
          });
        }

        //set date time
        // if (angular.isDefined(data.updateDateTime) && data.updateDateTime != null) {
        //     var oDate = new Date(data.updateDateTime + " UTC");
        //     oController.m_oTranslateService('MAP_LAYERDATEINFO', {data: oDate.toString()}).then(function (msg) {
        //         oController.m_oSelectedMapDateTimeInfo = msg;
        //         oController.m_oSelectedMapDateTimeIcon = oMapLink.link;
        //     });
        // }
      },
      //err:
      (data) => {
        // oController.setSelectedMapLinkOnScreen(oController,oController.m_oSelectedMapLink)
        // oController.m_oTranslateService('ERRORCONTACTSERVER').then(function(error){
        //     vex.dialog.alert({
        //             message: error,
        //         })
        //     //alert(error);
      }
    );
  };

  /**
   * Function called to show the selected radar layer
   * @param node the selected menu node
   */
  showRadLayer = (node: LayerMenuNode) => {
    let radData: IMap = node.radar!;

    //for future use in case of multiple level menu
    let modifier: string = 'none';

    //this.selectedRadarIcon = node.treePath[0].icon
    this.selectedMapIcon = this.icons.registerSvgIcon('radar.svg');

    this.selectedMapDescription = node.treePath[0].description;

    //reset date time
    this.selectedMapDateTime = new Date();
    this.selectedMapDateTimeIcon = '';

    // Obtain Stations Values from the server
    this.mapNavigatorService
      .getSatelliteLayerDetails(radData.linkCode || '')
      .subscribe(
        (data) => {
          if (data) {
            if (data.updateDateTime && data.updateDateTime != null) {
              var oDate = new Date(data.updateDateTime + ' UTC');
              this.selectedMapDateTime = oDate;
              this.selectedMapDateTimeIcon = '';
            }
          }
        },
        (error: any) => {
          console.log('Error contacting Omirl Server: %o', error);
        }
      );

    let oldLayerIdentifier = '';

    if (this.layerService.getDynamicLayer() != null) {
      let dynLayer = this.layerService.getDynamicLayer();
      oldLayerIdentifier = dynLayer.getSource().getParams().LAYER;
      dynLayer.setZIndex(0);
      this.layerService.getSensorsLayer().setZIndex(20);
    }

    this.selectedRadarLink = '';

    this.layerService.getLayerId(radData.linkCode!, modifier).subscribe(
      (data: IMapLayerData) => {
        //oController.setSelectedMapLinkOnScreen(oController,oMapLink);

        if (data.layerId != null && data.layerId != oldLayerIdentifier) {
          // Remove current map layer TODO check if is really needed
          if (this.layerService.getDynamicLayer() != null) {
            if (this.mapService.map) {
              this.mapService.map.removeLayer(
                this.layerService.getDynamicLayer()
              );
            }
          }

          // Create WMS Layer
          let mapLayer = this.layerService.getDynamicLayer();
          mapLayer.setSource(
            new TileWMS({
              url: radData.layerWMS,
              params: { LAYERS: data.layerId },
              //transparent: "true",
              //format: "image/png"
            })
          );
          //mapLayer.isBaseLayer = false;

          mapLayer.setOpacity(0.6);
          // Add the new layer to the map
          //oController.m_oLayerService.setDynamicLayer(mapLayer);
          if (this.map) {
            this.map.addLayer(mapLayer);
          }
          //this.mapService.map.setLayerIndex(mapLayer, oController.m_oLayerService.getBaseLayers().length);
        } else if (data.layerId == null) {
          // Remove last one
          if (this.layerService.getDynamicLayer() != null) {
            if (this.mapService.map) {
              this.mapService.map.removeLayer(
                this.layerService.getDynamicLayer()
              );
              this.layerService.setDynamicLayer(null);
            }
          }

          this.dialog.open(ErrorDialogComponent, {
            data: { msg: $localize`:@@LAYER_NOT_FOUND:Layer non disponibile` },
          });
        }
      },
      //err:
      (data) => {
        // oController.setSelectedMapLinkOnScreen(oController,oController.m_oSelectedMapLink)
        // oController.m_oTranslateService('ERRORCONTACTSERVER').then(function(error){
        //     vex.dialog.alert({
        //             message: error,
        //         })
        //     //alert(error);
      }
    );
  };

  toggleLayerMenu = () => {
    this.isLayerMenuOpen = !this.isLayerMenuOpen;
    setTimeout(() => {
      this.map.updateSize();
    }, 100);
  };

  toggleRailLayerMenu = () => {
    this.isLayerMenuRail = !this.isLayerMenuRail;
    if (this.isLayerMenuRail) this.menuStatus = 1;
    else this.menuStatus = 2;
    setTimeout(() => {
      this.map.updateSize();
    }, 100);
  };

  toggleLegendSensor = () =>
    (this.isLegendSensorVisible = !this.isLegendSensorVisible);

  toggleLegendMap = () => (this.isLegendMapVisible = !this.isLegendMapVisible);

  toggleInfoLayerSelection() {
    this.infoLayerSelected = !this.infoLayerSelected;
  }

  onDateTimeChanged(date: Date | null) {
    if (date) {
      this.session.setSelectedDateTimeCookie(date);
    } else {
      this.session.deleteSelectedDateTimeCookie();
    }

    let params = this.route.snapshot.params;

    let selectedTime = this.session.getSelectedDateTimeCookie();

    let refTime = '';
    if (selectedTime && selectedTime.getTime()) {
      refTime = selectedTime.getTime() + '';
    }

    params = {
      ...params,
      reftime: refTime,
    };

    this.router.navigate(['/dati', params]);
  }

  isLegendOpen() {
    return (
      (this.activeSensorNode?.sensor?.legendLink &&
        this.isLegendSensorVisible) ||
      (this.activeMapNode?.map?.legendLink && this.isLegendMapVisible) ||
      (this.activeRadNode?.radar?.legendLink && this.isLegendMapVisible) ||
      (this.activeRadNode?.sat?.legendLink && this.isLegendMapVisible)
    );
  }
}
