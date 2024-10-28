import { Component, Input, OnInit } from '@angular/core';
import { type } from 'os';
import { IconService } from 'src/app/services/icon.service';
import { MatMenuTriggerForDirective } from 'src/app/directives/mat-menu-trigger-for.directive';
import { LayerService } from 'src/app/services/layer.service';
import {
  IStaticLayer,
  MapNavigatorService,
} from 'src/app/services/map-navigator.service';
import { TranslationService } from 'src/app/services/translation.service';
import { MapService } from 'src/app/services/map.service';
import { XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import * as _ from 'lodash';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineAll, flatMap, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConstantsService } from 'src/app/services/constants.service';
import { constants } from 'buffer';
import { SessionService } from 'src/app/services/session.service';

export type LayoutDirectionType = 'horizontal' | 'vertical';

export interface IBackgroundLayer {
  name: string;
  url: string;
  selected: boolean;
}

@Component({
  selector: 'visualization-menu',
  templateUrl: './visualization-menu.component.html',
  styleUrls: ['./visualization-menu.component.less'],
})
export class VisualizationMenuComponent implements OnInit {
  backgroundLayers: IBackgroundLayer[] = [
    {
      name: 'OSM',
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      selected: true,
    },
    {
      name: 'Black & White',
      url: 'http://www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png',
      selected: false,
    },
  ];

  routeParams: ParamMap = {} as ParamMap;

  constructor(
    private icons: IconService,
    private mapNavigatorService: MapNavigatorService,
    private mapService: MapService,
    public translate: TranslationService,
    public layerService: LayerService,
    private router: Router,
    private route: ActivatedRoute,
    private constants: ConstantsService,
    public session: SessionService
  ) {
    icons.registerSvgIconFromAssetsImg('sfondi.svg');
    icons.registerSvgIconFromAssetsImg('strati-info.svg');
    icons.registerSvgIconFromAssetsImg('reset-zoom.svg');
    icons.registerSvgIconFromAssetsImg('info-layer.svg');
  }

  ngOnInit(): void {
    // this.mapNavigatorService.getStaticLayerLinks().subscribe(staticLayers => {

    //   this.layerService.staticLayers = staticLayers
    // })

    this.route.paramMap.subscribe((params: ParamMap) => {
      //this.session.checkSession().subscribe(() => {
      this.mapNavigatorService
        .getStaticLayerLinks()
        .pipe(
          mergeMap((staticLayers) => {
            //if the location is being reloaded or loaded for the first time, collect static layers from web service
            if (!this.layerService.staticLayers) {
              this.layerService.staticLayers = staticLayers;
            }
            return of(1);
          }),
          mergeMap((val, index) => {
            const intiallySelectedStaticLayers =
              this.layerService.getSelectedStaticLayers();

            const numOfInitiallySelectedStaticLayers =
              intiallySelectedStaticLayers.length;

            let bgLayerName = params.get('bgmap');
            let staticLayerNames = params.get('static')?.split(',');

            if (
              this.constants.logged &&
              (!staticLayerNames || staticLayerNames.length == 0)
            ) {
              staticLayerNames =
                this.constants.sessionData?.defaultStatics.split(',');
            }

            if (staticLayerNames && staticLayerNames.length > 0) {
              _.each(this.layerService.staticLayers, (staticLayer) => {
                let layerFound = _.find(
                  staticLayerNames,
                  (name) => name == staticLayer.description
                );
                if (layerFound) {
                  if (!staticLayer.selected) {
                    let addedLayer =
                      this.layerService.selectStaticLayer(staticLayer);
                    if (addedLayer && addedLayer.mapLayer) {
                      this.mapService.map?.addLayer(addedLayer.mapLayer);
                      addedLayer.mapLayer.setZIndex(0);
                      if (this.layerService.getSensorsLayer()) {
                        this.layerService.getSensorsLayer().setZIndex(20);
                      }
                    }
                  }
                } else {
                  if (staticLayer.selected) {
                    let layerToRemove =
                      this.layerService.getStaticLayer(staticLayer);
                    if (layerToRemove && layerToRemove.mapLayer) {
                      this.mapService.map?.removeLayer(layerToRemove.mapLayer);
                      this.layerService.deselectStaticLayer(layerToRemove);
                    }
                  }
                }
              });
            }

            let bgLayerFromRoute = _.find(this.backgroundLayers, {
              name: bgLayerName,
            }) as IBackgroundLayer;

            if (bgLayerFromRoute && !bgLayerFromRoute.selected) {
              this.setBgLayer(bgLayerFromRoute);
            }

            return of(1);
          })
        )
        .subscribe((res) => {
          console.log('route subscription initialization complete');
        });
      // });
    });
  }

  onStaticLayerClick = (staticLayer: IStaticLayer) => {
    //find descriptions of currently selected layers
    let selectedLayers = _.map(
      _.filter(this.layerService.staticLayers, { selected: true }),
      (selectedLayer) => selectedLayer.description
    );

    if (!staticLayer.selected) {
      //add description of currently clicked layer to selected layers
      selectedLayers.push(staticLayer.description);
    } else {
      _.remove(
        selectedLayers,
        (layerDescr) => layerDescr == staticLayer.description
      );
    }

    this.router.navigate([
      '/dati',
      _.defaults({ static: [selectedLayers] }, this.route.snapshot.params),
    ]);

    // if (staticLayer.selected) {
    //     // Remove the layer from the map
    //     try {
    //       let layerToRemove = this.layerService.getStaticLayer(staticLayer)
    //       if (layerToRemove && layerToRemove.mapLayer) {
    //         this.mapService.map?.removeLayer(layerToRemove.mapLayer)
    //         this.layerService.deselectStaticLayer(layerToRemove)
    //       }
    //     }
    //     catch (err) {
    //       console.log('Error deselecting static layer: ', err, "- layer: ", staticLayer)
    //     }
    // }
    // else {
    //     // Add the layer to the map
    //     let addedLayer = this.layerService.selectStaticLayer(staticLayer);
    //     if (addedLayer && addedLayer.mapLayer) {
    //       this.mapService.map?.addLayer(addedLayer.mapLayer);
    //     }
    // }

    // //staticLayer.selected = !staticLayer.selected;
  };

  setBgLayer = (bgLayer: IBackgroundLayer) => {
    this.mapService.map
      ?.getLayers()
      .setAt(0, new TileLayer({ source: new XYZ({ url: bgLayer.url }) }));

    _.each(this.backgroundLayers, (layer) => {
      if (_.isEqual(layer, bgLayer)) {
        layer.selected = true;
      } else {
        layer.selected = false;
      }
    });
  };

  onBgLayerClick = (bgLayer: IBackgroundLayer) => {
    this.router.navigate([
      '/dati',
      _.defaults({ bgmap: bgLayer.name }, this.route.snapshot.params),
    ]);
  };

  resetZoom = () => {
    if (this.constants.logged) {
      this.mapService.applyUserConfig();
    } else {
      this.mapService.applyDefaultConfigForReset();
    }
  };
}
