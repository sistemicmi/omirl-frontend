import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Vector from 'ol/layer/Vector';
import Layer from 'ol/renderer/Layer';
import Style from 'ol/style/Style';
import { TileWMS, Vector as VectorSource } from 'ol/source';
import Geometry from 'ol/geom/Geometry';
import Feature from 'ol/Feature';
import { Config } from 'src/omirl-config';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Text from 'ol/style/Text';
import TileLayer from 'ol/layer/Tile';
import { Observable } from 'rxjs';
import Icon from 'ol/style/Icon';
import Polygon from 'ol/geom/Polygon';
import RegularShape from 'ol/style/RegularShape';
import { IStaticLayer } from './map-navigator.service';
import * as _ from 'lodash';
import { SessionService } from './session.service';
import { asArray, asString } from 'ol/color';
import { fill } from 'lodash';
import { MapService } from './map.service';
import { ConstantsService } from './constants.service';
import Select, { SelectEvent } from 'ol/interaction/Select';
import { click } from 'ol/events/condition';

//data = {code: "rainfall7d", layerId: "20210904rainfall7d_std_1630", styleId: "OmirlRain7d", updateDateTime: "09/04/2021 04:30:31 PM"}
export interface IMapLayerData {
  code: string;
  layerId: string;
  styleId: string;
  updateDateTime: string;
}

export interface IColorRangeEntry {
  lmt: number;
  clr: string;
}
@Injectable({
  providedIn: 'root',
})
export class LayerService {
  sensorsLayer!: Vector<VectorSource<Geometry>>;
  dynamicLayer!: TileLayer<TileWMS> | null;
  _staticLayers!: IStaticLayer[];
  http: HttpClient;
  apiUrl: string;

  constructor(
    httpClient: HttpClient,
    private session: SessionService,
    private mapService: MapService,
    private constantsService: ConstantsService
  ) {
    this.http = httpClient;
    this.apiUrl = this.constantsService.apiURL;
  }

  getStaticLayer = (layer: IStaticLayer): IStaticLayer | undefined => {
    return _.find(this._staticLayers, layer);
  };

  getStaticLayerById = (layerId: string): IStaticLayer | undefined => {
    let resultLayer = _.find(this._staticLayers, {
      layerId: layerId,
    }) as IStaticLayer;

    return resultLayer;
  };

  getOrCreateStaticLayer = (layer: IStaticLayer) => {
    let resultLayer = _.find(this._staticLayers, {
      layerId: layer.layerID,
    }) as IStaticLayer;

    if (resultLayer) {
      return resultLayer;
    }

    this._staticLayers.push(layer);

    return layer;
  };

  selectStaticLayer = (
    layerToSelect: IStaticLayer
  ): IStaticLayer | undefined => {
    let foundLayer = _.find(this._staticLayers, layerToSelect);
    if (foundLayer) {
      if (!foundLayer.selected) {
        foundLayer.mapLayer = new TileLayer({
          source: new TileWMS({
            url: foundLayer.layerWMS,
            params: { LAYERS: foundLayer.layerID },
          }),
        });

        foundLayer.selected = true;
        foundLayer.mapLayer.setZIndex(0);
      }
    }

    return foundLayer;
  };

  deselectStaticLayer = (layerToRemove: IStaticLayer) => {
    let foundLayer = _.find(this._staticLayers, layerToRemove);
    if (foundLayer) {
      if (foundLayer.selected) {
        foundLayer.mapLayer = undefined;
        foundLayer.selected = false;
      }
    }
  };

  getSelectedStaticLayers = (): IStaticLayer[] => {
    return _.filter(this._staticLayers, { selected: true });
  };

  set staticLayers(layers: IStaticLayer[]) {
    this._staticLayers = layers;
  }

  get staticLayers() {
    return this._staticLayers;
  }

  getDynamicLayer = () => {
    if (this.dynamicLayer == null) {
      this.dynamicLayer = new TileLayer({
        source: new TileWMS(),
      });
    }

    return this.dynamicLayer;
  };

  setDynamicLayer = (dynamicLayer: TileLayer<TileWMS> | null): void => {
    this.dynamicLayer = dynamicLayer;
  };

  getLayerId = (
    sCode: string,
    sModifier: string
  ): Observable<IMapLayerData> => {
    const headers = this.session.prepareHeaders();

    if (headers) {
      return this.http.get<IMapLayerData>(
        this.apiUrl + '/maps/layer/' + sCode + '/' + sModifier,
        { headers: headers }
      );
    } else {
      return this.http.get<IMapLayerData>(
        this.apiUrl + '/maps/layer/' + sCode + '/' + sModifier
      );
    }
  };

  /**
   * Gets the sensors layer
   * @returns {null}
   */
  getSensorsLayer = () => {
    if (this.sensorsLayer == null) {
      // No: create it

      this.sensorsLayer = new Vector({
        source: new VectorSource(),
        updateWhileAnimating: true,
        updateWhileInteracting: true,
        style: this.getStationsStyle,
      });
    }

    return this.sensorsLayer;
  };

  getStationsStyle = (feature: any, resolution: number) => {
    return new Style({
      image: this.getStationImageStyle(feature, resolution),
      text: this.getStationTextStyle(feature, resolution),
    });
  };

  addOpacityToColor = (feature: any, color: string) => {
    let olColor = asArray(color);
    olColor[3] = feature.getProperties().opacity;
    return asString(olColor);
  };

  getStationImageStyle = (feature: any, resolution: number) => {
    //radius of the circle when showing numeric values on the markers
    let largeRadius = 22;
    let markerFill = new Fill({
      color: this.addOpacityToColor(feature, feature.getProperties().color),
    });
    let markerStroke = new Stroke({
      color: this.addOpacityToColor(feature, '#000000'),
      width: 1.25,
    });

    if (feature.getProperties().sensorType == 'Press') {
      largeRadius = 23;
    }

    if (feature.getProperties().layerType == 'hydro') {
      largeRadius = 7;
    }

    if (feature.getProperties().sensorType == 'Vento') {
      return new Icon({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        rotation: (feature.getProperties().increment * Math.PI) / 180,
        src:
          'https://omirl.regione.liguria.it/' + feature.getProperties().imgPath,
        rotateWithView: true,
        opacity: feature.getProperties().opacity,
      });
    }
    // else if (feature.getProperties().sensorType == 'webcam') {
    //   return new Icon({
    //     //anchor: [0.5, 1],
    //     //anchorXUnits: 'fraction',
    //     //anchorYUnits: 'fraction',
    //     //rotation: feature.getProperties().increment * Math.PI / 180,
    //     src: 'https://omirl.regione.liguria.it/'+feature.getProperties().imgPath,
    //     //rotateWithView: true,
    //     scale:0.1
    //   })
    // }
    else if (
      feature.getProperties().sensorType == 'Idro' &&
      feature.getProperties().increment != 0
    ) {
      return new RegularShape({
        fill: markerFill,
        stroke: markerStroke,
        points: 3,
        radius: resolution < 150 ? 30 : 7,
        rotation: Math.PI * (1 + feature.getProperties().increment),
        angle: 0,
      });
    } else if (feature.getProperties().sensorType == 'Sfloc') {
      //let image = feature.getProperties().image
      // return new Icon({
      //   src: 'assets/img/layout-menu-icons/stazioni/lightning-c.svg',
      //   //src: image.src,
      //   opacity: feature.getProperties().opacity,
      //   scale:0.8
      // })
      if (feature.getProperties().name == 'C') {
        return new Circle({
          radius: resolution < 150 ? /*largeRadius*/ 5 : 3,
          // fill: new Fill({
          //   color: this.addOpacityToColor(feature, feature.getProperties().color),
          // }),
          stroke: new Stroke({
            color: this.addOpacityToColor(
              feature,
              feature.getProperties().color
            ),
            width: 2,
          }),
        });
      } else {
        return new RegularShape({
          radius:
            resolution < 150
              ? /*largeRadius*/ 5 * Math.sqrt(2)
              : 3 * Math.sqrt(2),
          // fill: new Fill({
          //   color: this.addOpacityToColor(feature, feature.getProperties().color),
          // }),
          stroke: new Stroke({
            color: this.addOpacityToColor(
              feature,
              feature.getProperties().color
            ),
            width: 2,
          }),
          points: 4,
          radius2: 0,
          angle: Math.PI / 4,
        });
      }
    } else {
      return new Circle({
        radius: resolution < 150 ? largeRadius : 7,
        fill: new Fill({
          color: this.addOpacityToColor(feature, feature.getProperties().color),
        }),
        stroke: markerStroke,
      });
    }
  };

  getStationTextStyle = (feature: any, resolution: number) => {
    let markerFill = new Fill({
      color: this.addOpacityToColor(feature, feature.getProperties().color),
    });

    let markerStroke = new Stroke({
      color: this.addOpacityToColor(feature, '#000000'),
      width: 1.25,
    });

    let textFill = new Fill({
      color: this.addOpacityToColor(feature, '#000000'),
    });

    let text = '';
    if (feature.getProperties().sensorType == 'Idro') {
      text =
        resolution < 150 ? feature.getProperties().value.toFixed(2) + '' : '';
    } else if (feature.getProperties().sensorType == 'webcam') {
      text = '';
    } else if (feature.getProperties().sensorType == 'Vento') {
      text = '';
    } else if (feature.getProperties().layerType == 'hydro') {
      text = '';
    } else if (feature.getProperties().sensorType == 'Sfloc') {
      text = '';
    } else {
      text =
        resolution < 150 ? feature.getProperties().value.toFixed(1) + '' : '';
    }
    return new Text({
      text: text,
      font: 'bold 14px/1 Helvetica',
      backgroundFill: markerFill,
      stroke: markerStroke,
      fill: textFill,
    });
  };

  getQueryLayers = (evt: any) => {
    //TODO fix evt type

    var sLayers = '';
    var asUrls = [];

    const selectedStaticLayers = this.getSelectedStaticLayers();

    if (this.dynamicLayer == null && selectedStaticLayers == null) return '';
    if (this.dynamicLayer == null && selectedStaticLayers.length == 0)
      return '';

    let oLayer = {} as TileLayer<TileWMS> | undefined;

    if (this.dynamicLayer != null && this.mapService.map) {
      oLayer = this.dynamicLayer;
      sLayers = oLayer.getSource().getParams().LAYERS;
      const url = oLayer
        .getSource()
        .getFeatureInfoUrl(
          evt.coordinate,
          this.mapService.map.getView().getResolution(),
          this.mapService.map.getView().getProjection(),
          {
            REQUEST: 'GetFeatureInfo',
            EXCEPTIONS: 'application/vnd.ogc.se_xml',
            //BBOX: this.mapService.map.getExtent().toBBOX(),
            X: evt.pixel_[0],
            Y: evt.pixel_[1],
            //INFO_FORMAT: 'text/html',
            INFO_FORMAT: 'application/json',
            QUERY_LAYERS: sLayers,
            //WIDTH: oLayer.map.size.w,
            //HEIGHT: oLayer.map.size.h
          }
        );
      asUrls.push(url);
    }

    //static layer
    if (selectedStaticLayers != null) {
      if (selectedStaticLayers.length > 0) {
        for (
          var iStatics = 0;
          iStatics < selectedStaticLayers.length;
          iStatics++
        ) {
          oLayer = selectedStaticLayers[iStatics].mapLayer;
          if (oLayer && this.mapService.map) {
            sLayers = selectedStaticLayers[iStatics].mapLayer
              ?.getSource()
              .getParams().LAYERS;
            const url = oLayer
              .getSource()
              .getFeatureInfoUrl(
                evt.coordinate,
                this.mapService.map.getView().getResolution(),
                this.mapService.map.getView().getProjection(),
                {
                  REQUEST: 'GetFeatureInfo',
                  EXCEPTIONS: 'application/vnd.ogc.se_xml',
                  //BBOX: oLayer.map.getExtent().toBBOX(),
                  X: evt.pixel_[0],
                  Y: evt.pixel_[1],
                  //INFO_FORMAT: 'text/html',
                  INFO_FORMAT: 'application/json',
                  QUERY_LAYERS: sLayers,
                  //WIDTH: oLayer.map.size.w,
                  //HEIGHT: oLayer.map.size.h
                }
              );
            asUrls.push(url);
          }
        }
      }
    }

    return asUrls;
  };

  getLayerInfo = (url: string) => {
    const headers = this.session.prepareHeaders();

    if (headers) {
      return this.http.get(
        decodeURI(url),
        { headers: headers }
      );
    } else {
      return this.http.get(
        decodeURI(url)
      );
    }
  };
}
