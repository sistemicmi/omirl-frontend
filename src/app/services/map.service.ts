import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Select from 'ol/interaction/Select';
import { SelectEvent } from 'ol/interaction/Select';
import { click, pointerMove } from 'ol/events/condition';
import * as olProj from 'ol/proj';
import Events from 'ol/events/Event';
import * as _ from 'lodash';
import Interaction from 'ol/interaction/Interaction';
import Style from 'ol/style/Style';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  // Data ------------------------------------------------- //
  map: Map | null;
  constantsService: ConstantsService;
  defaultLon: number = 8.8;
  defaultLat = 44.2;
  defaultZoom = 9.4;
  // ------------------------------------------------------ //

  // class-methods ---------------------------------------------------------- //
  constructor(constantsService: ConstantsService) {
    this.constantsService = constantsService;
    this.map = constantsService.map;
  }
  // ----------------------------------------------------------------------- //

  // methods -------------------------------------------------------------------------------- //
  new(): Map {
    let options = {};

    if (this.constantsService.logged && this.constantsService.sessionData)
      options = {
        target: 'dati-map',
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: olProj.fromLonLat([
            this.constantsService.sessionData.defaultLon,
            this.constantsService.sessionData.defaultLat,
          ]),
          zoom: this.constantsService.sessionData.defaultZoom,
        }),
      };
    else
      options = {
        target: 'dati-map',
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: olProj.fromLonLat([this.defaultLon, this.defaultLat]),
          zoom: this.defaultZoom,
        }),
      };

    this.map = new Map(options);
    //this.constantsService.map = this.map;
    return this.map;
  }

  //add a listener to the map, which listens to mouse clicks on features
  addSelectClickInteraction = (callback: (e: SelectEvent) => any) => {
    const selectClick = new Select({
      condition: click,
    });

    this.map!.addInteraction(selectClick);

    selectClick.on('select', (event) => {
      callback(event);
    });
  };

  //add a listener to the map, which listens to mouseover on features
  addSelectHoverInteraction = (
    callback: (e: SelectEvent) => any,
    styleFunction: (feature: any, resolution: number) => Style
  ) => {
    const selectHover = new Select({
      condition: pointerMove,
      hitTolerance: 1,
      style: styleFunction,
    });

    this.map!.addInteraction(selectHover);

    selectHover.on('select', (event) => {
      callback(event);
    });
  };

  removeSelectHoverInteractions = () => {
    //It's assumed that no other interactions than custom hover and click are added. this.map?.getInteractions().clear() cannot be used because it removes map dragging and other default interactions too.

    let interactions = this.map?.getInteractions().getArray();
    const interactionsToRemove: any = [];

    _.each(interactions, (interaction: any) => {
      if (
        interaction?.condition_?.name == click.name ||
        interaction?.condition_?.name == pointerMove.name
      ) {
        interactionsToRemove.push(interaction);
      }
    });

    interactionsToRemove.forEach((element: any) => {
      this.map?.getInteractions().remove(element);
    });
  };

  applyUserConfig() {
    if (!this.constantsService.logged) return;

    //let view = this.constantsService.map?.getView();
    const view = this.map?.getView();
    if (this.constantsService.sessionData && view) {
      view.setCenter(
        olProj.fromLonLat([
          this.constantsService.sessionData.defaultLon,
          this.constantsService.sessionData.defaultLat,
        ])
      );
      view.setZoom(this.constantsService.sessionData.defaultZoom);
    }
  }

  applyDefaultConfigForReset() {
    let view = this.map?.getView();
    if (view) {
      view.setCenter(olProj.fromLonLat([this.defaultLon, this.defaultLat]));
      view.setZoom(this.defaultZoom);
    }
  }

  applyDefaultConfig() {
    let view = this.constantsService.map?.getView();
    if (view) {
      view.setCenter(olProj.fromLonLat([this.defaultLon, this.defaultLat]));
      view.setZoom(this.defaultZoom);
    }
  }

  // ---------------------------------------------------------------------------------------- //
}
