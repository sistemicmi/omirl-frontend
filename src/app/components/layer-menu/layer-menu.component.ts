import { FlatTreeControl } from '@angular/cdk/tree';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeNode,
} from '@angular/material/tree';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { link } from 'fs';
import * as _ from 'lodash';
import { CookieService } from 'ngx-cookie-service';
import { forkJoin, merge, Observable } from 'rxjs';
import { combineLatest } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { combineAll, flatMap, map, mergeMap, switchMap } from 'rxjs/operators';
import { ConstantsService } from 'src/app/services/constants.service';
import { IconService } from 'src/app/services/icon.service';
import {
  ISessionResponse,
  SessionService,
} from 'src/app/services/session.service';
import { TranslationService } from 'src/app/services/translation.service';
import {
  MapNavigatorService,
  ISensor,
  IMap,
  IHydro,
  ISatLayerDetails,
} from '../../services/map-navigator.service';

const rootBaseUrl = 'assets/img/layout-menu-icons/';
const stazioniBaseUrl = 'assets/img/layout-menu-icons/stazioni/';
const mappeBaseUrl = 'assets/img/layout-menu-icons/mappe/';

type NodeType = 'selectedSensorCode' | 'selectedMapCode';
export interface ITreePathEntry {
  description: string;
  icon: string;
}
export interface LayerMenuNode {
  name: string;
  children?: LayerMenuNode[] | null;
  icon?: string;
  sensor?: ISensor;
  map?: IMap;
  hydro?: IHydro;
  sat?: IMap;
  radar?: IMap;
  isActive: boolean;
  treePath: ITreePathEntry[];
}

/** Flat node with expandable and level information */
interface LayerMenuFlatNode extends LayerMenuNode {
  expandable: boolean;
  level: number;
}

@Component({
  selector: 'layer-menu',
  templateUrl: './layer-menu.component.html',
  styleUrls: ['./layer-menu.component.less'],
})
export class LayerMenuComponent implements OnInit {
  @Output() menuSelectedItemsChanged = new EventEmitter<
    (LayerMenuNode | undefined)[]
  >();
  @Input() open: boolean = true;
  // @Input() selectedSensorCode:string = ''
  // @Input() selectedMapCode:string = ''
  selectedSensorCode: string = '';
  selectedMapCode: string = '';
  selectedMapModifier: string = '';
  selectedHydroCode: string = '';
  selectedSatCode: string = '';
  selectedRadarCode: string = '';
  selectedRadarModifier: string = '';

  private _transformer = (
    node: LayerMenuNode,
    level: number
  ): LayerMenuFlatNode => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      icon: node.icon,
      level: level,
      sensor: node.sensor,
      map: node.map,
      hydro: node.hydro,
      radar: node.radar,
      sat: node.sat,
      isActive: node.isActive,
      treePath: node.treePath,
    };
  };

  treeControl = new FlatTreeControl<LayerMenuFlatNode>(
    (node) => node?.level,
    (node) => node?.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node?.level,
    (node) => node?.expandable,
    (node) => node?.children
  );

  getLevel = (node: LayerMenuFlatNode) => node.level;

  hasChild = (_: number, node: LayerMenuFlatNode) => node.expandable;

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  treeData: LayerMenuNode[] = [];
  //mapNavService: MapNavigatorService;
  //iconRegistry: MatIconRegistry
  //sanitizer: DomSanitizer
  isMobile: boolean;
  activeSensorNode: LayerMenuNode | undefined; //currently selected station sensors layer node
  activeMapNode: LayerMenuNode | undefined; //currently selected WMS layer node
  activeHydroNode: LayerMenuNode | undefined;
  activeSatNode: LayerMenuNode | undefined;
  activeRadarNode: LayerMenuNode | undefined;
  isLayerMenuOpen: boolean = false;
  stationsMenu: LayerMenuNode;
  mapsMenu: LayerMenuNode;
  hydroMenu: LayerMenuNode;
  radarMenu: LayerMenuNode;
  satelliteMenu: LayerMenuNode;

  constructor(
    private mapNavService: MapNavigatorService,
    private icons: IconService,
    private constants: ConstantsService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslationService,
    private cookieService: CookieService,
    public session: SessionService
  ) {
    //this.mapNavService = mapNavService
    //this.iconRegistry = iconRegistry
    //this.sanitizer = sanitizer
    this.isMobile = constants.isMobile;
    this.activeSensorNode = undefined;
    this.activeMapNode = undefined;
    this.activeHydroNode = undefined;
    this.activeSatNode = undefined;
    this.activeRadarNode = undefined;

    this.stationsMenu = {
      name: 'Stazioni',
      children: [],
      icon: this.icons.registerSvgIcon('stazioni.svg'),
      isActive: false,
      treePath: [],
    };

    this.mapsMenu = {
      name: 'Mappe',
      children: [],
      icon: this.icons.registerSvgIcon('mappe.svg'),
      isActive: false,
      treePath: [],
    };

    this.hydroMenu = {
      name: 'Idro',
      children: [],
      icon: this.icons.registerSvgIcon('Idro_1.svg'),
      isActive: false,
      treePath: [],
    };

    this.radarMenu = {
      name: 'Radar',
      children: [],
      icon: this.icons.registerSvgIcon('radar.svg'),
      isActive: false,
      treePath: [],
    };

    this.satelliteMenu = {
      name: 'Satellite',
      children: [],
      icon: this.icons.registerSvgIcon('satellite.svg'),
      isActive: false,
      treePath: [],
    };
  }

  ngOnInit(): void {
    console.log('init LayerMenuComponent');

    this.route.paramMap.subscribe((params: ParamMap) => {
      //wait for session data containing default user settings

      console.log('updating selectedSensorCode from route params');

      console.log(
        'session data in layer menu component: ',
        this.constants.sessionData
      );

      let sensorCode = params.get('sensor');

      this.selectedSensorCode =
        sensorCode ??
        (this.constants.logged && this.constants.sessionData?.defaultSensorType
          ? (this.constants.sessionData as ISessionResponse).defaultSensorType
          : '');

      let mapCode = params.get('map');
      let mapModifier = params.get('mapmod');

      this.selectedMapCode =
        mapCode ?? this.constants.sessionData?.defaultMap ?? '';
      this.selectedMapModifier = mapModifier ?? '';

      let hydroCode = params.get('hydro');
      //if a sensor is already selected, a hydro level cannot be shown at the same time
      this.selectedHydroCode = sensorCode ? '' : hydroCode ?? '';

      let satCode = params.get('sat');
      this.selectedSatCode = mapCode ? '' : satCode ?? '';

      let radarCode = params.get('rad');
      this.selectedRadarCode = mapCode || satCode ? '' : radarCode ?? '';

      this.updateSelectedNodes(
        this.selectedSensorCode,
        parseInt(this.selectedMapCode),
        this.selectedMapModifier,
        this.selectedHydroCode,
        this.selectedSatCode,
        this.selectedRadarCode
      );
    });

    //let sensorService = mapNavService.getSensorFirstLevel();
    let sensorService = this.mapNavService.sensors;
    let mapService = this.mapNavService.getMapFirstLevels();

    //this is the pipe for retrieving and building public menu entries structure.
    //The subscriber to this pipe will be responsible for adding entries to mat-tree
    const publicMenuPipe = combineLatest([sensorService, mapService]).pipe(
      switchMap(([sensorData, mapData]) => {
        //console.log('sensor data: %o', sensorData);
        //console.log('map data: %o', mapData);

        this.parseSensorData(sensorData);
        let arrayofSecondLevelMapRequests =
          this.getArrayOfSecondLevelMapRequests(mapData);

        return of(arrayofSecondLevelMapRequests);
      }),
      mergeMap((mapSecondLevelObservables) => {
        //console.log("2nd level observables: ", mapSecondLevelObservables)
        return forkJoin(mapSecondLevelObservables);
      }),
      mergeMap((secondLevelMenus) => {
        //console.log("2nd level menus: ", secondLevelMenus)
        //we have second level menu items here, retrieved from web service in observables in previous pipe
        //parse second level menus and get observables to retrieve third level menus
        let arrayOfThirdLevelMenuRequests =
          this.getArrayOfThirdLevelMapRequests(secondLevelMenus);
        return of(arrayOfThirdLevelMenuRequests);
      }),
      mergeMap((mapThirdLevelObservables) => {
        //console.log("3rd level observables: ", mapThirdLevelObservables)
        return forkJoin(mapThirdLevelObservables);
      }),
      mergeMap((thirdLevelMenus) => {
        //we have 3rd level menu items here, retrieved from web service in observables in previous pipe
        //console.log("3rd level menus: ", thirdLevelMenus)
        this.parseThirdLevelMenus(thirdLevelMenus);
        return of(1);
      })
    );

    let hydroMenuPipe: Observable<number>;

    if (this.cookieService.get('sessionId')) {
      hydroMenuPipe = this.mapNavService.getHydroFirstLevels().pipe(
        mergeMap((hydroFirstLevels) => {
          console.log('hydro first levels: ', hydroFirstLevels);
          let arrOfSecondLevelHydroMenu =
            this.getArrayOfSecondLevelHydroMenu(hydroFirstLevels);
          return of(arrOfSecondLevelHydroMenu);
        }),
        mergeMap((hydroSecondLevelObservables) => {
          return forkJoin(hydroSecondLevelObservables);
        }),
        mergeMap((hydroSecondLevels) => {
          console.log('hydro second levels: ', hydroSecondLevels);
          //add flattened sensor list to mapnavigator service
          this.mapNavService.hydroSensors = _.flatten(hydroSecondLevels);
          this.parseSecondLevelHydroMenu(hydroSecondLevels);
          return of(1);
        })
      );
    } else {
      hydroMenuPipe = of(1);
    }

    let radarMenuPipe: Observable<number>;

    if (this.cookieService.get('sessionId')) {
      radarMenuPipe = this.mapNavService.getRadarFirstLevels().pipe(
        mergeMap((radarFirstLevels) => {
          console.log('radar first levels: ', radarFirstLevels);
          //return forkJoin(this.parseFirstLevelSatMenu(satFirstLevels))
          return of(this.parseFirstLevelRadarMenu(radarFirstLevels));
        }),
        mergeMap((radarSecondLevelObservables) => {
          console.log(radarSecondLevelObservables);
          return forkJoin(radarSecondLevelObservables);
        }),
        mergeMap((radarSecondLevels) => {
          console.log('radar second levels: ', radarSecondLevels);
          this.parseSecondLevelRadarMenu(radarSecondLevels);
          return of(1);
        })
      );
    } else {
      radarMenuPipe = of(1);
    }

    let satMenuPipe: Observable<number>;

    if (this.cookieService.get('sessionId')) {
      satMenuPipe = this.mapNavService.getSatelliteFirstLevels().pipe(
        mergeMap((satFirstLevels) => {
          console.log('sat first levels: ', satFirstLevels);
          //return forkJoin(this.parseFirstLevelSatMenu(satFirstLevels))
          this.parseFirstLevelSatMenu(satFirstLevels);
          return of(1);
        })
        // mergeMap(satSecondLevelObservables => {

        //     return forkJoin(satSecondLevelObservables)
        // }),
        // mergeMap(satLayerDetails => {

        //     console.log('satLayerDetails: ', satLayerDetails)
        //     this.parseSatLayerDetailsMenu(satLayerDetails)
        //     return of(1)
        // })
      );
    } else {
      satMenuPipe = of(1);
    }

    //subscribe to the menu pipe, to get menu entries and build menus.
    publicMenuPipe
      .pipe(
        mergeMap(() => hydroMenuPipe),
        mergeMap((hydrolevels) => of(hydrolevels)),
        mergeMap(() => radarMenuPipe),
        mergeMap((radarlevels) => of(radarlevels)),
        mergeMap(() => satMenuPipe),
        mergeMap((satlevels) => of(satlevels))
      )
      .subscribe((val) => {
        console.log('value from pipe subscription:', val);
        this.treeData.push(this.stationsMenu);
        this.treeData.push(this.mapsMenu);

        if (this.cookieService.get('sessionId')) {
          this.treeData.push(this.hydroMenu);
          this.treeData.push(this.radarMenu);
          this.treeData.push(this.satelliteMenu);
        }

        this.dataSource.data = this.treeData;

        this.updateSelectedNodes(
          this.selectedSensorCode,
          parseInt(this.selectedMapCode),
          this.selectedMapModifier,
          this.selectedHydroCode,
          this.selectedSatCode,
          this.selectedRadarCode
        );

        if (this.selectedSensorCode) {
          this.treeControl.expand(this.treeControl.dataNodes[0]);
        }

        let selectedMapNode = <LayerMenuFlatNode>(
          this.getMapNodeByLinkIdAndModifier(
            parseInt(this.selectedMapCode),
            this.selectedMapModifier
          )
        );
        this.expandParents(selectedMapNode);

        let selectedHydroNode = <LayerMenuFlatNode>(
          this.getHydroNodeByCode(this.selectedHydroCode)
        );
        this.expandParents(selectedHydroNode);

        let selectedSatNode = <LayerMenuFlatNode>(
          this.getSatNodeByCode(this.selectedSatCode)
        );
        this.expandParents(selectedSatNode);

        let selectedRadarNode = <LayerMenuFlatNode>(
          this.getRadNodeByCode(this.selectedRadarCode)
        );
        this.expandParents(selectedRadarNode);
      });
  }

  parseFirstLevelSatMenu(satData: IMap[]): Observable<ISatLayerDetails>[] {
    let arrOfLayerDetails = [];
    for (const sat of satData) {
      let nodeIcon = this.icons.registerSvgIcon(sat.link);
      let nodeDescription = this.translate.menuTranslations[sat.description];

      arrOfLayerDetails.push(
        this.mapNavService.getSatelliteLayerDetails(sat.linkCode ?? '')
      );
      this.satelliteMenu.children?.push(<LayerMenuNode>{
        name: nodeDescription,
        icon: nodeIcon,
        sat: sat,
        isActive: false,
        treePath: [{ description: nodeDescription, icon: nodeIcon }],
      });
    }

    return arrOfLayerDetails;
  }

  parseSatLayerDetailsMenu(satLayerDetails: ISatLayerDetails[]) {
    for (
      let satFirstLevelIndex = 0;
      satFirstLevelIndex < satLayerDetails.length;
      satFirstLevelIndex++
    ) {
      let satNodeDetails = {
        code: satLayerDetails[satFirstLevelIndex].code,
        layerID: satLayerDetails[satFirstLevelIndex].layerId,
        styleId: satLayerDetails[satFirstLevelIndex].styleId,
        updateDateTime: satLayerDetails[satFirstLevelIndex].updateDateTime,
      };
      this.satelliteMenu.children![satFirstLevelIndex].sat = {
        ...this.satelliteMenu.children![satFirstLevelIndex].sat!,
        ...satNodeDetails,
      };
    }
  }

  parseFirstLevelRadarMenu(radarData: IMap[]): Observable<IMap[]>[] {
    let arrOfSecondLevelRadar = [] as Observable<IMap[]>[];
    for (const radar of radarData) {
      let nodeIcon = this.icons.registerSvgIcon(radar.link);
      let nodeDescription = this.translate.menuTranslations[radar.description];

      if (radar.hasChilds) {
        arrOfSecondLevelRadar.push(
          this.mapNavService.getRadarSecondLevels(radar.linkCode ?? '')
        );
      } else {
        //if node doesn't have children, add a fake empty value
        arrOfSecondLevelRadar.push(of([]));
      }

      this.radarMenu.children?.push(<LayerMenuNode>{
        name: nodeDescription,
        icon: nodeIcon,
        radar: radar,
        children: [],
        isActive: false,
        treePath: [{ description: nodeDescription, icon: nodeIcon }],
      });
    }

    return arrOfSecondLevelRadar;
  }

  parseSecondLevelRadarMenu(radarSecondLevelMenus: IMap[][]) {
    var arrOfThirdLevelRequests = [];

    //mapSecondLevelMenus is an array of arrays containing the children list for each of the first level nodes
    for (
      let firstLevelIndex = 0, len = radarSecondLevelMenus.length;
      firstLevelIndex < len;
      firstLevelIndex++
    ) {
      //mapsMenu.children![subMenuIndex].children = mapSubMenus[subMenuIndex]
      for (const [
        secondLevelIndex,
        secondLevelMenuItem,
      ] of radarSecondLevelMenus[firstLevelIndex].entries()) {
        //console.log("MapSecondLevelMenu[%i][%i]: %o", firstLevelIndex, secondLevelIndex, secondLevelMenuItem)

        //prepare async request for getting third level menus
        //let getMapThirdLevelChildren = this.getThirdLevelMenuChildren(secondLevelMenuItem.linkId, firstLevelIndex, secondLevelIndex)

        let secondLevelNodeDescription =
          this.translate.menuTranslations[secondLevelMenuItem.description];

        //set second level node data
        this.radarMenu.children![firstLevelIndex].children?.push({
          name: secondLevelNodeDescription,
          children: [],
          //...secondLevelMenuItem,
          radar: secondLevelMenuItem,
          isActive: false,
          //no icon is shown for second level map nodes
          //icon: this.registerSvgIcon(secondLevelMenuItem.link),
          treePath: this.radarMenu.children![firstLevelIndex].treePath.concat([
            { description: secondLevelNodeDescription, icon: '' },
          ]),
        });

        //arrOfThirdLevelRequests.push(getMapThirdLevelChildren)
      }
    }

    //return arrOfThirdLevelRequests
  }

  parseSensorData(sensorData: ISensor[]) {
    for (const sensor of sensorData) {
      if (sensor.isVisible) {
        let nodeIcon = this.icons.registerSvgIcon(sensor.imageLinkOff);
        let nodeDescription =
          this.translate.menuTranslations[sensor.description];
        this.stationsMenu.children?.push(<LayerMenuNode>{
          name: nodeDescription,
          icon: nodeIcon,
          sensor: sensor,
          isActive: false,
          treePath: [{ description: nodeDescription, icon: nodeIcon }],
        });
      }
    }
  }

  getArrayOfSecondLevelMapRequests(mapData: IMap[]): Observable<IMap[]>[] {
    var arrOfObservableMapRequests = [];

    for (const map of mapData) {
      //check if menu item has a sub-level:
      let mapSecondLevelChildren = this.mapNavService.getMapSecondLevels(
        map.linkId
      );
      let nodeIcon = this.icons.registerSvgIcon(map.link);
      let nodeDescription = this.translate.menuTranslations[map.description];
      let mapNode: LayerMenuNode = {
        name: nodeDescription,
        children: [],
        icon: nodeIcon,
        isActive: false,
        treePath: [{ description: nodeDescription, icon: nodeIcon }],
      };

      this.mapsMenu.children?.push(mapNode);
      arrOfObservableMapRequests.push(mapSecondLevelChildren);
    }

    return arrOfObservableMapRequests;
  }

  getArrayOfThirdLevelMapRequests(
    mapSecondLevelMenus: IMap[][]
  ): Observable<IMap[]>[] {
    var arrOfThirdLevelRequests = [];

    //mapSecondLevelMenus is an array of arrays containing the children list for each of the first level nodes
    for (
      let firstLevelIndex = 0, len = mapSecondLevelMenus.length;
      firstLevelIndex < len;
      firstLevelIndex++
    ) {
      //mapsMenu.children![subMenuIndex].children = mapSubMenus[subMenuIndex]
      for (const [secondLevelIndex, secondLevelMenuItem] of mapSecondLevelMenus[
        firstLevelIndex
      ].entries()) {
        //console.log("MapSecondLevelMenu[%i][%i]: %o", firstLevelIndex, secondLevelIndex, secondLevelMenuItem)

        //prepare async request for getting third level menus
        let getMapThirdLevelChildren = this.getThirdLevelMenuChildren(
          secondLevelMenuItem.linkId,
          firstLevelIndex,
          secondLevelIndex
        );

        let secondLevelNodeDescription =
          this.translate.menuTranslations[secondLevelMenuItem.description];

        //set second level node data
        this.mapsMenu.children![firstLevelIndex].children?.push({
          name: secondLevelNodeDescription,
          children: [],
          ...secondLevelMenuItem,
          isActive: false,
          //no icon is shown for second level map nodes
          icon: this.icons.registerSvgIcon(secondLevelMenuItem.link),
          treePath: this.mapsMenu.children![firstLevelIndex].treePath.concat([
            { description: secondLevelNodeDescription, icon: '' },
          ]),
        });

        arrOfThirdLevelRequests.push(getMapThirdLevelChildren);
      }
    }

    return arrOfThirdLevelRequests;
  }

  parseThirdLevelMenus(mapThirdLevelMenus: IMap[][]) {
    mapThirdLevelMenus.forEach((mapThirdLevelMenu, mapThirdLevelIndex) => {
      mapThirdLevelMenu.forEach((mapThirdLevelMenuItem) => {
        console.log(
          'mapThirdlevel[%i][%i]: %o',
          mapThirdLevelMenuItem.firstLevelIndex!,
          mapThirdLevelMenuItem.secondLevelIndex!,
          mapThirdLevelMenu
        );

        let mapSecondLevelMenuItem = this.mapsMenu.children![
          mapThirdLevelMenuItem.firstLevelIndex!
        ].children![
          mapThirdLevelMenuItem.secondLevelIndex!
        ] as unknown as IMap & LayerMenuNode;

        //copy parent node data in the map attribute of current node
        //mapThirdLevelMenuItem = {...mapSecondLevelMenuItem, ...mapThirdLevelMenuItem}

        mapThirdLevelMenuItem = {
          ...mapThirdLevelMenuItem,
          layerID: mapSecondLevelMenuItem.layerID ?? '',
          layerWMS: mapSecondLevelMenuItem.layerWMS ?? '',
          legendLink: mapSecondLevelMenuItem.legendLink ?? '',
          linkId: mapSecondLevelMenuItem.linkId ?? 0,
        };

        //console.log("mapThirdlevel[%i][%i] extended: %o", mapThirdLevelMenuItem.firstLevelIndex!, mapThirdLevelMenuItem.secondLevelIndex!, mapThirdLevelMenu)
        let thirdLevelNodeDescription =
          this.translate.menuTranslations[mapThirdLevelMenuItem.description];

        mapSecondLevelMenuItem.children?.push({
          name: thirdLevelNodeDescription,
          //no icon is shown for third level nodes
          //icon: this.registerSvgIcon('stazioni.svg'),
          map: mapThirdLevelMenuItem,
          isActive: false,
          treePath: mapSecondLevelMenuItem.treePath.concat([
            { description: thirdLevelNodeDescription, icon: '' },
          ]),
        });
      });
    });
  }

  getArrayOfSecondLevelHydroMenu(
    hydroFirstLevels: IHydro[]
  ): Observable<IHydro[]>[] {
    var arrOfObservableMapRequests = [];

    for (const hydro of hydroFirstLevels) {
      //check if menu item has a sub-level:
      let mapSecondLevelChildren = this.mapNavService.getHydroSecondLevels(
        hydro.linkCode ?? ''
      );
      let nodeIcon = this.icons.registerSvgIcon(hydro.link ?? '');
      let nodeDescription = this.translate.menuTranslations[hydro.description];
      let mapNode: LayerMenuNode = {
        name: nodeDescription,
        children: [],
        icon: nodeIcon,
        isActive: false,
        treePath: [{ description: nodeDescription, icon: nodeIcon }],
      };

      this.hydroMenu.children?.push(mapNode);
      arrOfObservableMapRequests.push(mapSecondLevelChildren);
    }

    return arrOfObservableMapRequests;
  }

  parseSecondLevelHydroMenu(mapSecondLevelMenus: IHydro[][]) {
    var arrOfThirdLevelRequests = [];

    //mapSecondLevelMenus is an array of arrays containing the children list for each of the first level nodes
    for (
      let firstLevelIndex = 0, len = mapSecondLevelMenus.length;
      firstLevelIndex < len;
      firstLevelIndex++
    ) {
      //mapsMenu.children![subMenuIndex].children = mapSubMenus[subMenuIndex]
      for (const [secondLevelIndex, secondLevelMenuItem] of mapSecondLevelMenus[
        firstLevelIndex
      ].entries()) {
        //console.log("MapSecondLevelMenu[%i][%i]: %o", firstLevelIndex, secondLevelIndex, secondLevelMenuItem)

        //prepare async request for getting third level menus
        //let getMapThirdLevelChildren = this.getThirdLevelMenuChildren(secondLevelMenuItem.linkId, firstLevelIndex, secondLevelIndex)

        let secondLevelNodeDescription =
          this.translate.menuTranslations[secondLevelMenuItem.description];

        //set second level node data
        this.hydroMenu.children![firstLevelIndex].children?.push({
          name: secondLevelNodeDescription,
          children: [],
          //...secondLevelMenuItem,
          hydro: secondLevelMenuItem,
          isActive: false,
          //no icon is shown for second level map nodes
          //icon: this.registerSvgIcon(secondLevelMenuItem.link),
          icon: this.icons.registerSvgIcon(
            this.hydroMenu.children![firstLevelIndex].icon ?? ''
          ),
          treePath: this.hydroMenu.children![firstLevelIndex].treePath.concat([
            { description: secondLevelNodeDescription, icon: '' },
          ]),
        });

        //arrOfThirdLevelRequests.push(getMapThirdLevelChildren)
      }
    }

    //return arrOfThirdLevelRequests
  }

  /**
   * Recursively expand all parents of the passed node.
   */
  expandParents(node: LayerMenuFlatNode) {
    const parent = this.getParent(node);
    if (parent) {
      this.treeControl.expand(parent);
    }

    if (parent && parent.level > 0) {
      this.expandParents(parent);
    }
  }

  /**
   * Iterate over each node in reverse order and return the first node that has a lower level than the passed node.
   */
  getParent(node: LayerMenuFlatNode) {
    const { treeControl } = this;
    const currentLevel = treeControl.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = treeControl.dataNodes[i];

      if (treeControl.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }

    return null;
  }

  getThirdLevelMenuChildren = (
    linkId: number,
    firstLevelIndex: number,
    secondLevelIndex: number
  ) => {
    return this.mapNavService.getMapThirdLevel(linkId).pipe(
      mergeMap((children) => {
        let thirdLevelChildren = children.map((child) => {
          child.firstLevelIndex = firstLevelIndex;
          child.secondLevelIndex = secondLevelIndex;
          return child;
        });
        return of(thirdLevelChildren);
      })
    );
  };

  layerMenuItemClicked = (node: LayerMenuNode) => {
    let params = this.route.snapshot.params;

    if (node.sensor) {
      //only one layer between stations and hydro may be active at the same time
      if (node.sensor.code != this.selectedSensorCode) {
        params = { ...params, hydro: '', sensor: node.sensor.code };
      } else {
        params = { ...params, hydro: '', sensor: '' };
      }
    } else {
      params = { ...params, sensor: this.selectedSensorCode };
    }

    if (node.map) {
      if (
        node.map.linkId != parseInt(this.selectedMapCode) ||
        node.map.layerIDModifier != this.selectedMapModifier
      ) {
        params = {
          ...params,
          map: node.map.linkId,
          mapmod: node.map.layerIDModifier,
        };
      } else {
        params = { ...params, map: null };
      }
    } else {
      // params = {...params, map: this.selectedMapCode, mapmod: this.selectedMapModifier}
    }

    if (node.hydro) {
      //only one layer between stations and hydro may be active at the same time
      if (node.hydro.linkCode != this.selectedHydroCode) {
        params = { ...params, sensor: '', hydro: node.hydro.linkCode };
      } else {
        params = { ...params, sensor: '', hydro: '' };
      }
    } else {
      params = { ...params, hydro: this.selectedHydroCode };
    }

    if (node.radar) {
      //only one layer among map, radar and sat may be active at the same time
      if (node.radar.linkCode != this.selectedRadarCode) {
        params = { ...params, map: '', sat: '', rad: node.radar.linkCode };
      } else {
        params = { ...params, map: '', sat: '', rad: '' };
      }
    } else {
      // params = {...params, rad: this.selectedRadarCode}
    }

    if (node.sat) {
      //only one layer between stations and hydro may be active at the same time
      if (node.sat.linkCode != this.selectedSatCode) {
        params = { ...params, map: '', sat: node.sat.linkCode };
      } else {
        params = { ...params, map: '', sat: '' };
      }
    } else {
      // params = {...params, sat: this.selectedSatCode}
    }

    this.router.navigate(['/dati', params]);
  };

  updateSelectedNodes = (
    sensorCode: string,
    mapCode: number,
    mapModifier: string,
    hydroCode: string,
    satCode: string,
    radCode: string
  ) => {
    //console.log("Menu changed - Node: %o", nodeCode)

    //detect the node type that has been clicked
    //nodeType type constraint is needed for the TypeScript compiler to allow square bracket notation on (this)
    // let nodeType : 'activeSensorNode' | 'activeMapNode' = node.sensor ? 'activeSensorNode' : 'activeMapNode'

    let newSensorNode = this.getSensorNodeByCode(sensorCode);
    let newMapNode = this.getMapNodeByLinkIdAndModifier(mapCode, mapModifier);
    let newHydroNode = this.getHydroNodeByCode(hydroCode);
    let newSatNode = this.getSatNodeByCode(satCode);
    let newRadNode = this.getRadNodeByCode(radCode);

    if (this.activeSensorNode) {
      this.activeSensorNode.isActive = false;
    }

    if (newSensorNode) {
      newSensorNode.isActive = true;
    }

    if (this.activeMapNode) {
      this.activeMapNode.isActive = false;
    }
    if (newMapNode) {
      newMapNode.isActive = true;
    }

    if (this.activeHydroNode) {
      this.activeHydroNode.isActive = false;
    }
    if (newHydroNode) {
      newHydroNode.isActive = true;
    }

    if (this.activeRadarNode) {
      this.activeRadarNode.isActive = false;
    }
    if (newRadNode) {
      newRadNode.isActive = true;
    }

    if (this.activeSatNode) {
      this.activeSatNode.isActive = false;
    }
    if (newSatNode) {
      newSatNode.isActive = true;
    }

    this.activeSensorNode = newSensorNode;
    this.activeMapNode = newMapNode;
    this.activeHydroNode = newHydroNode;
    this.activeRadarNode = newRadNode;
    this.activeSatNode = newSatNode;

    this.menuSelectedItemsChanged.emit([
      this.activeSensorNode,
      this.activeMapNode,
      this.activeHydroNode,
      this.activeSatNode,
      this.activeRadarNode,
    ]);
  };

  toggle = () => (this.open = !this.open);

  isSensorActive = (sensor: ISensor): boolean => {
    return sensor.code == this.selectedSensorCode;
  };

  getSensorNodeByCode = (sensorCode: string): LayerMenuNode | undefined => {
    return _.find<LayerMenuNode | undefined>(
      this.treeControl.dataNodes,
      (child) => {
        return child?.sensor?.code == sensorCode;
      }
    );
  };

  getHydroNodeByCode = (hydroCode: string): LayerMenuNode | undefined => {
    return _.find<LayerMenuNode | undefined>(
      this.treeControl.dataNodes,
      (child) => {
        return child?.hydro?.linkCode == hydroCode;
      }
    );
  };

  getRadNodeByCode = (radLinkCode: string): LayerMenuNode | undefined => {
    return _.find<LayerMenuNode | undefined>(
      this.treeControl.dataNodes,
      (child) => {
        return child?.radar?.linkCode == radLinkCode;
      }
    );
  };

  getSatNodeByCode = (satCode: string): LayerMenuNode | undefined => {
    return _.find<LayerMenuNode | undefined>(
      this.treeControl.dataNodes,
      (child) => {
        return child?.sat?.linkCode == satCode;
      }
    );
  };

  getMapNodeByLinkIdAndModifier = (
    mapLinkId: number,
    mapModifierId: string
  ): LayerMenuNode | undefined => {
    return _.find<LayerMenuNode | undefined>(
      this.treeControl.dataNodes,
      (child) => {
        return (
          child?.map?.linkId == mapLinkId &&
          child?.map?.layerIDModifier == mapModifierId
        );
      }
    );
  };

  getNodesAtLevel = (level: number): LayerMenuFlatNode[] => {
    return _.filter(this.treeControl.dataNodes, (dataNode) => {
      return dataNode.level == 0;
    });
  };
}
