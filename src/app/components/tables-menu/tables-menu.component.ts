import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeNode,
} from '@angular/material/tree';
import { DomSanitizer } from '@angular/platform-browser';
import Observable from 'ol/Observable';
import {
  combineLatest,
  CombineLatestSubscriber,
} from 'rxjs/internal/observable/combineLatest';
import { of } from 'rxjs/internal/observable/of';
import { combineAll, flatMap, map, mergeMap } from 'rxjs/operators';
import { ConstantsService } from 'src/app/services/constants.service';
import {
  ISensorType,
  ITableLink,
  TablesService,
} from 'src/app/services/tables.service';
import {
  MapNavigatorService,
  ISensor,
  IMap,
} from '../../services/map-navigator.service';
import * as _ from 'lodash';
import { LayerMenuNode } from '../layer-menu/layer-menu.component';
import { CookieService } from 'ngx-cookie-service';
import { IconService } from 'src/app/services/icon.service';

const rootBaseUrl = 'assets/img/layout-menu-icons/';
const stazioniBaseUrl = 'assets/img/layout-menu-icons/stazioni/';
const mappeBaseUrl = 'assets/img/layout-menu-icons/mappe/';

export interface TablesMenuNode {
  name: string;
  children?: TablesMenuNode[] | null;
  icon?: string;
  location?: string;
  isActive: boolean;
  ancestorId?: string;
}

/** Flat node with expandable and level information */
interface LayerMenuFlatNode extends TablesMenuNode {
  expandable: boolean;
  level: number;
}

@Component({
  selector: 'tables-menu',
  templateUrl: './tables-menu.component.html',
  styleUrls: ['./tables-menu.component.less'],
})
export class TablesMenuComponent {
  @Output() menuItemClicked = new EventEmitter<TablesMenuNode>();
  @Input() open: boolean = true;
  @Input() path: string = '';

  private _transformer = (
    node: TablesMenuNode,
    level: number
  ): LayerMenuFlatNode => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      icon: node.icon,
      level: level,
      location: node.location,
      isActive: node.isActive,
      ancestorId: node.ancestorId,
    };
  };

  treeControl = new FlatTreeControl<LayerMenuFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  getLevel = (node: LayerMenuFlatNode) => node.level;

  hasChild = (_: number, node: LayerMenuFlatNode) => node.expandable;

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  treeData: TablesMenuNode[] = [];
  iconRegistry: MatIconRegistry;
  sanitizer: DomSanitizer;
  menuTranslations: { [key: string]: string } = {};
  isMobile: boolean;
  activeSensorNode: TablesMenuNode | null; //currently selected station sensors layer node
  activeMapNode: TablesMenuNode | null; //currently selected WMS layer node
  isLayerMenuOpen: boolean = false;
  selectedTableNode: TablesMenuNode | null = null;
  isLogged: boolean = false;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    constants: ConstantsService,
    private tablesService: TablesService,
    cookieService: CookieService,
    private icons: IconService,
    private mapNavigatorService: MapNavigatorService
  ) {
    this.iconRegistry = iconRegistry;
    this.sanitizer = sanitizer;
    this.isMobile = constants.isMobile;
    this.activeSensorNode = null;
    this.activeMapNode = null;
    this.isLogged = cookieService.get('sessionId') != '' ? true : false;

    this.menuTranslations[
      'OMIRLCONFIG_SENSORPLUVIO'
    ] = $localize`:@@OMIRLCONFIG_SENSORPLUVIO:Precipitazione (mm/h)`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORTERMO'
    ] = $localize`:@@OMIRLCONFIG_SENSORTERMO:Temperatura (°C)`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORIDRO'
    ] = $localize`:@@OMIRLCONFIG_SENSORIDRO:Livelli idrometrici (m)`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORWIND'
    ] = $localize`:@@OMIRLCONFIG_SENSORWIND:Vento (km/h)`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORIGRO'
    ] = $localize`:@@OMIRLCONFIG_SENSORIGRO:Umidità dell'aria (%)`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORELIO'
    ] = $localize`:@@OMIRLCONFIG_SENSORELIO:Eliofanie (min)`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORRADIO'
    ] = $localize`:@@OMIRLCONFIG_SENSORRADIO:Radiazione solare (W/m²)`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORFOGLIE'
    ] = $localize`:@@OMIRLCONFIG_SENSORFOGLIE:Bagnatura fogliare (%)`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORPRESS'
    ] = $localize`:@@OMIRLCONFIG_SENSORPRESS:Pressione atmosferica (hPa)`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORBATT'
    ] = $localize`:@@OMIRLCONFIG_SENSORBATT:Tensione batteria (V)`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORBOA'
    ] = $localize`:@@OMIRLCONFIG_SENSORBOA:Stato del mare (m)`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORNEVE'
    ] = $localize`:@@OMIRLCONFIG_SENSORNEVE:Neve (cm)`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORFULMINI'
    ] = $localize`:@@OMIRLCONFIG_SENSORFULMINI:Fulminazioni`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORWEBCAM'
    ] = $localize`:@@OMIRLCONFIG_SENSORWEBCAM:Webcam`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIA'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIA:Pioggia`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPUMIDITASUOLO'
    ] = $localize`:@@OMIRLCONFIG_MAPUMIDITASUOLO:Umidità del suolo`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPTEMPERATURA'
    ] = $localize`:@@OMIRLCONFIG_MAPTEMPERATURA:Temperatura`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIMI15'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIMI15:Ultimi 15'`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIMI30'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIMI30:Ultimi 30'`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIMAORA'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIMAORA:Ultima ora`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIME3ORE'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIME3ORE:Ultime 3 ore`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIME6ORE'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIME6ORE:Ultime 6 ore`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIME12ORE'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIME12ORE:Ultime 12 ore`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIME24ORE'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIME24ORE:Ultime 24 ore`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIMI7G'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIMI7G:Ultimi 7 Giorni`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIMI15G'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIMI15G:Ultimi 15 Giorni`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIMI30G'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIMI30G:Ultimi 30 Giorni`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPUMIDITASUOLO00'
    ] = $localize`:@@OMIRLCONFIG_MAPUMIDITASUOLO00:Stato alle 00:00`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPUMIDITASUOLO06'
    ] = $localize`:@@OMIRLCONFIG_MAPUMIDITASUOLO06:Stato alle 06:00`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPUMIDITASUOLO12'
    ] = $localize`:@@OMIRLCONFIG_MAPUMIDITASUOLO12:Stato alle 12:00`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPUMIDITASUOLO18'
    ] = $localize`:@@OMIRLCONFIG_MAPUMIDITASUOLO18:Stato alle 18:00`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPTEMPERATURAMIN'
    ] = $localize`:@@OMIRLCONFIG_MAPTEMPERATURAMIN:Temperatura - Minima`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPTEMPERATURAMED'
    ] = $localize`:@@OMIRLCONFIG_MAPTEMPERATURAMED:Temperatura - Media`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPTEMPERATURAMAX'
    ] = $localize`:@@OMIRLCONFIG_MAPTEMPERATURAMAX:Temperatura - Massima`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPTEMPERATURATHETAMEDIA'
    ] = $localize`:@@OMIRLCONFIG_MAPTEMPERATURATHETAMEDIA:Temperatura - Theta da Media`;
    this.menuTranslations[
      'OMIRLCONFIG_INTERPOLATA'
    ] = $localize`:@@OMIRLCONFIG_INTERPOLATA:Interpolata`;
    this.menuTranslations[
      'OMIRLCONFIG_VALSTAZ'
    ] = $localize`:@@OMIRLCONFIG_VALSTAZ:Valori stazioni`;
    this.menuTranslations[
      'OMIRLCONFIG_MAXPUNT'
    ] = $localize`:@@OMIRLCONFIG_MAXPUNT:Massimi di precipitazione`;
    this.menuTranslations[
      'OMIRLCONFIG_SINTESI'
    ] = $localize`:@@OMIRLCONFIG_SINTESI:Estremi di temperatura e vento`;
    this.menuTranslations[
      'OMIRLCONFIG_ZONEALLERTA'
    ] = $localize`:@@OMIRLCONFIG_ZONEALLERTA:Livelli idrometrici`;

    //MERGE-REMINDER: STILL TO ADD IN SERVICE
    this.menuTranslations[
      'OMIRLCONFIG_TABELLAMODELLI'
    ] = $localize`:@@OMIRLCONFIG_TABELLAMODELLI:Modelli idrologici`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDRO_OSS_PHAST'
    ] = $localize`:@@OMIRLCONFIG_HYDRO_OSS_PHAST:Osservato + Phast`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDRO_OSS'
    ] = $localize`:@@OMIRLCONFIG_HYDRO_OSS:Osservato`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVDET'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVDET:Deterministica`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVSOGG'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVSOGG:Soggettiva`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVSOGG_AUTO_00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVSOGG_AUTO_00:Soggettiva auto +00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVSOGG_AUTO_+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVSOGG_AUTO_+06:Soggettiva auto +06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVSOGG_AUTO_-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVSOGG_AUTO_-06:Soggettiva auto -06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVSOGG_AUTO_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVSOGG_AUTO_+12:Soggettiva auto +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM10_+00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM10_+00:Bolam 10 +00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM10_+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM10_+06:Bolam 10 +06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM10_-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM10_-06:Bolam 10 -06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM10_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM10_+12:Bolam 10 +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM08_+00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM08_+00:Bolam 08 +00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM08_+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM08_+06:Bolam 8 +06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM08_-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM08_-06:Bolam 8 -06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM08_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM08_+12:Bolam 8 +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH02_+00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH02_+00:Moloch 2 +00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH02_+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH02_+06:Moloch 2 +06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH02_-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH02_-06:Moloch 2 -06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH02_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH02_+12:Moloch 2 +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH15_+00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH15_+00:Moloch 1.5 +00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH15_+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH15_+06:Moloch 1.5 +06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH15_-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH15_-06:Moloch 1.5 -06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH15_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH15_+12:Moloch 1.5 +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI7_00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI7_00:Lami 7 +00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI7_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI7_+12:Lami 7 +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI28_00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI28_00:Lami 2.8 +00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI28_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI28_+12:Lami 2.8 +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI5_00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI5_00:Lami 5 +00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI5_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI5_+12:Lami 5 +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI22_00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI22_00:Lami 2.2 +00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI22_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI22_+12:Lami 2.2 +12`;

    this.loadMenu();
  }

  async addImagesTo(tableSensors: ISensorType[]) {
    let mapSensors: ISensor[] =
      await this.mapNavigatorService.sensors.toPromise();

    _.forEach(tableSensors, (tableSensor) => {
      tableSensor.imageLinkOff = _.get(
        _.find(mapSensors, (mapSensor) => mapSensor.code == tableSensor.code),
        'imageLinkOff'
      );
    });
  }

  async loadMenu() {
    let menuLinks = this.tablesService.getTableMenuLinks();

    //wait for all menu links to be loaded before filling the menu tree
    menuLinks.subscribe((tablesMenuData: ITableLink[]) => {
      console.log('Tables menu data: %o', tablesMenuData);

      for (const [menuIndex, menuLink] of tablesMenuData.entries()) {
        let treeMenuItem: TablesMenuNode = {
          name: this.menuTranslations[menuLink.description],
          children: [],
          icon: this.icons.registerSvgIcon(menuLink.imageLinkOff),
          location: menuLink.location,
          isActive: menuLink.active,
        };

        this.treeData.push(treeMenuItem);

        if (menuLink.location == '/sensorstable') {
          this.tablesService.getSensorTypes().subscribe(async (sensorTypes) => {
            let sensorsTableChildren: TablesMenuNode[] = [];
            await this.addImagesTo(sensorTypes);
            for (const sensor of sensorTypes) {
              if (!this.isMobile) {
                if (sensor.code != 'Batt' && sensor.code != 'webcam')
                  sensorsTableChildren.push({
                    name: this.menuTranslations[sensor.description],
                    location: '/sensorstable/' + sensor.code,
                    isActive: false,
                    ancestorId: menuLink.location,
                    icon: this.icons.registerSvgIcon(
                      sensor.imageLinkOff ? sensor.imageLinkOff : ''
                    ),
                  });
                else if (this.isLogged && sensor.code != 'webcam')
                  sensorsTableChildren.push({
                    name: this.menuTranslations[sensor.description],
                    location: '/sensorstable/' + sensor.code,
                    isActive: false,
                    ancestorId: menuLink.location,
                    icon: this.icons.registerSvgIcon(
                      sensor.imageLinkOff ? sensor.imageLinkOff : ''
                    ),
                  });
              } else {
                if (
                  sensor.code != 'Batt' &&
                  sensor.code != 'webcam' &&
                  sensor.code != 'Elio' &&
                  sensor.code != 'Radio' &&
                  sensor.code != 'Foglie' &&
                  sensor.code != 'Press'
                )
                  sensorsTableChildren.push({
                    name: this.menuTranslations[sensor.description],
                    location: '/sensorstable/' + sensor.code,
                    isActive: false,
                    ancestorId: menuLink.location,
                    icon: this.icons.registerSvgIcon(
                      sensor.imageLinkOff ? sensor.imageLinkOff : ''
                    ),
                  });
              }
            }

            this.treeData[menuIndex].children = sensorsTableChildren;
            //this.dataSource.data[menuIndex].children = sensorsTableChildren
            this.dataSource.data = this.treeData;

            this.selectNodeByPath();
            this.expandNodeAncestors();
          });
        }

        if (menuLink.location == '/modelstable') {
          this.tablesService
            .getHydroModelsTypes()
            .subscribe((hydroModelsTypes) => {
              let hydroModelsTableChildren: TablesMenuNode[] = [];
              for (const hydroModel of hydroModelsTypes) {
                hydroModelsTableChildren.push({
                  name: this.menuTranslations[hydroModel.description],
                  location: '/modelstable/' + hydroModel.code,
                  isActive: false,
                  ancestorId: menuLink.location,
                });
              }

              this.treeData[menuIndex].children = hydroModelsTableChildren;
              //this.dataSource.data[menuIndex].children = sensorsTableChildren
              this.dataSource.data = this.treeData;

              this.selectNodeByPath();
              this.expandNodeAncestors();
            });
        }

        if (menuLink.location == '/alertzones') {
          this.treeData[menuIndex].location = '/alertzonestable';
        }
      }

      //this.dataSource.data = this.treeData;
    });
  }

  getTableNodeById = (id: string): TablesMenuNode | null => {
    let result = _.find<TablesMenuNode | undefined>(
      this.treeControl.dataNodes,
      (child) => {
        return child?.name == id;
      }
    );
    if (result) return result;
    return null;
  };

  getTableNodeByLocation = (id: string): TablesMenuNode | null => {
    let result = _.find<TablesMenuNode | undefined>(
      this.treeControl.dataNodes,
      (child) => {
        return child?.location == id;
      }
    );
    if (result) return result;
    return null;
  };

  selectNodeByPath = () => {
    if (this.selectedTableNode)
      this.selectedTableNode.isActive = !this.selectedTableNode.isActive;

    this.selectedTableNode = this.getTableNodeByLocation(this.path);

    if (this.selectedTableNode)
      this.selectedTableNode.isActive = !this.selectedTableNode.isActive;
  };

  expandNodeAncestors = () => {
    let ancestorId = '';

    if (this.selectedTableNode) {
      ancestorId = this.selectedTableNode.ancestorId || '';
    }

    while (ancestorId && ancestorId != '') {
      const flattenedNode = _.find(
        this.treeControl.dataNodes,
        (node) => node.location == ancestorId
      );

      if (flattenedNode && flattenedNode.expandable) {
        ancestorId = flattenedNode.ancestorId || '';
        this.treeControl.expand(flattenedNode);
      }
    }
  };

  layerMenuItemClicked = (node: TablesMenuNode) => {
    console.log('Menu clicked - Node: %o', node);

    // //detect the node type that has been clicked
    // //nodeType type constraint is needed for the TypeScript compiler to allow square bracket notation on (this)
    // let nodeType: 'activeSensorNode' | 'activeMapNode' = node.sensor
    //   ? 'activeSensorNode'
    //   : 'activeMapNode';

    // if (this[nodeType] == node) {
    //   //user has clicked on the active node, deselect it
    //   this[nodeType] = null;
    // } else {
    //   //user has clicked on a new node: deactivate the old one and activate current node
    //   if (this[nodeType]) {
    //     this[nodeType]!.isActive = false;
    //   }
    //   this[nodeType] = node;
    // }
    let newSelectedTableNode = this.getTableNodeById(node.name);

    if (this.selectedTableNode)
      this.selectedTableNode.isActive = !this.selectedTableNode.isActive;
    node.isActive = !node.isActive;
    this.selectedTableNode = newSelectedTableNode;

    this.menuItemClicked.emit(node);
  };

  // registerSvgIcon = (iconFileName: string, iconName?: string): string => {
  //   if (!iconName) {
  //     //remove extension from filename
  //     iconName = iconFileName.replace(/\.[^/.]+$/, '');
  //   }
  //   this.iconRegistry.addSvgIcon(
  //     iconName,
  //     this.sanitizer.bypassSecurityTrustResourceUrl(
  //       '../../assets/img/layout-menu-icons/' + iconName + '.svg'
  //     )
  //   );
  //   return iconName;
  // };

  toggle = () => (this.open = !this.open);
}
