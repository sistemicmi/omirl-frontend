import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ConstantsService } from '../../services/constants.service';
import { TablesService } from '../../services/tables.service';
import { CookieService } from 'ngx-cookie-service';
import * as _ from 'lodash';
import { IconService } from 'src/app/services/icon.service';
import { ModelsGalleryMenuNode } from '../models-gallery-menu/models-gallery-menu.component';

export interface SatelliteRadarMenuNode {
  name: string;
  children?: SatelliteRadarMenuNode[] | null;
  icon?: string;
  location?: string;
  isActive: boolean;
  ancestorId?: string;
}

/** Flat node with expandable and level information */
interface SatelliteRadarMenuFlatNode extends SatelliteRadarMenuNode {
  expandable: boolean;
  level: number;
}

@Component({
  selector: 'app-satellite-radar-menu',
  templateUrl: './satellite-radar-menu.component.html',
  styleUrls: ['./satellite-radar-menu.component.less'],
})
export class SatelliteRadarMenuComponent implements OnInit {
  @Output() menuItemClicked = new EventEmitter<SatelliteRadarMenuNode>();
  @Input() open: boolean = true;
  @Input() path: string = '';

  private _transformer = (
    node: SatelliteRadarMenuNode,
    level: number
  ): SatelliteRadarMenuFlatNode => {
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

  treeControl = new FlatTreeControl<SatelliteRadarMenuFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  getLevel = (node: SatelliteRadarMenuFlatNode) => node.level;

  hasChild = (_: number, node: SatelliteRadarMenuFlatNode) => node.expandable;

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  treeData: SatelliteRadarMenuNode[] = [];
  iconRegistry: MatIconRegistry;
  sanitizer: DomSanitizer;
  menuTranslations: { [key: string]: string } = {};
  isMobile: boolean;
  activeSensorNode: SatelliteRadarMenuNode | null; //currently selected station sensors layer node
  activeMapNode: SatelliteRadarMenuNode | null; //currently selected WMS layer node
  isSatelliteRadarMenuOpen: boolean = false;
  selectedSatelliteRadarMenuNode: SatelliteRadarMenuNode | null = null;
  isLogged: boolean = false;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    constants: ConstantsService,
    private tablesService: TablesService,
    cookieService: CookieService,
    private icons: IconService
  ) {
    this.iconRegistry = iconRegistry;
    this.sanitizer = sanitizer;
    this.isMobile = constants.isMobile;
    this.activeSensorNode = null;
    this.activeMapNode = null;
    this.isLogged = cookieService.get('sessionId') != '' ? true : false;

    //MERGE-REMINDER: STILL TO ADD IN SERVICE
    this.menuTranslations[
      'OMIRLCONFIG_RADAR_INTRAIN5M'
    ] = $localize`:@@OMIRLCONFIG_RADAR_INTRAIN5M:Intensità oraria pioggia`;
    this.menuTranslations[
      'OMIRLCONFIG_RADAR_RAIN10'
    ] = $localize`:@@OMIRLCONFIG_RADAR_RAIN10:Pioggia cumulata 10'`;
    this.menuTranslations[
      'OMIRLCONFIG_RADAR_RAIN1H'
    ] = $localize`:@@OMIRLCONFIG_RADAR_RAIN1H:Cumulata oraria pioggia`;
    this.menuTranslations[
      'OMIRLCONFIG_RADAR_RAIN1HPLUVIO'
    ] = $localize`:@@OMIRLCONFIG_RADAR_RAIN1HPLUVIO:Pioggia 1h Radar + Pluviometri`;
    this.menuTranslations[
      'OMIRLCONFIG_RADAR_RIFLET'
    ] = $localize`:@@OMIRLCONFIG_RADAR_RIFLET:Riflettività`;
    this.menuTranslations[
      'OMIRLCONFIG_SAT_VIS'
    ] = $localize`:@@OMIRLCONFIG_SAT_VIS:Visibile`;
    this.menuTranslations[
      'OMIRLCONFIG_SAT_IR10'
    ] = $localize`:@@OMIRLCONFIG_SAT_IR10:IR 10.8`;
    this.menuTranslations[
      'OMIRLCONFIG_SAT_RADARFULM+IR'
    ] = $localize`:@@OMIRLCONFIG_SAT_RADARFULM+IR:Radar + Fulmini + IR 10.8`;
  }

  ngOnInit(): void {
    let TREE_DATA_DESKTOP: SatelliteRadarMenuNode[] = [
      {
        name: 'Radar',
        isActive: true,
        location: 'radar',
        icon: this.icons.registerSvgIcon('radar'),
        children: [
          {
            name: 'Seleziona una regione',
            isActive: false,
          },
          {
            name: 'Liguria',
            isActive: true,
            location: 'radarLiguria',
            ancestorId: 'radar',
            children: [
              {
                name: this.menuTranslations['OMIRLCONFIG_RADAR_INTRAIN5M'],
                isActive: false,
                location: '/satellite-radar/radar/Liguria/Rain5m/Immagine',
                ancestorId: 'radarLiguria',
              },
              {
                name: this.menuTranslations['OMIRLCONFIG_RADAR_RAIN10'],
                isActive: false,
                location: '/satellite-radar/radar/Liguria/Rain10m/Immagine',
                ancestorId: 'radarLiguria',
              },
              {
                name: this.menuTranslations['OMIRLCONFIG_RADAR_RAIN1H'],
                isActive: false,
                location: '/satellite-radar/radar/Liguria/Rain1h/Immagine',
                ancestorId: 'radarLiguria',
              },
              {
                name: this.menuTranslations['OMIRLCONFIG_RADAR_RAIN1HPLUVIO'],
                isActive: false,
                location:
                  '/satellite-radar/radar/Liguria/Rain1hPluvio/Immagine',
                ancestorId: 'radarLiguria',
              },
            ],
          },
          {
            name: 'Piemonte',
            isActive: true,
            location: 'radarPiemonte',
            ancestorId: 'radar',
            children: [
              {
                name: this.menuTranslations['OMIRLCONFIG_RADAR_INTRAIN5M'],
                isActive: false,
                location: '/satellite-radar/radar/Piemonte/Rain5m/Immagine',
                ancestorId: 'radarPiemonte',
              },
              {
                name: this.menuTranslations['OMIRLCONFIG_RADAR_RAIN1H'],
                isActive: false,
                location: '/satellite-radar/radar/Piemonte/Rain1h/Immagine',
                ancestorId: 'radarPiemonte',
              },
              {
                name: this.menuTranslations['OMIRLCONFIG_RADAR_RIFLET'],
                isActive: false,
                location: '/satellite-radar/radar/Piemonte/Riflet/Immagine',
                ancestorId: 'radarPiemonte',
              },
            ],
          },
        ],
      },
      {
        name: 'Satellite',
        isActive: true,
        location: 'satellite',
        icon: this.icons.registerSvgIcon('satellite'),
        children: [
          {
            name: "Seleziona un'area",
            isActive: false,
          },
          {
            name: 'Nord Italia',
            isActive: true,
            ancestorId: 'satellite',
            location: 'satelliteNordItalia',
            children: [
              {
                name: this.menuTranslations['OMIRLCONFIG_SAT_VIS'],
                isActive: false,
                location: '/satellite-radar/satellite/Nord-Italia/Vis/Immagine',
                ancestorId: 'satelliteNordItalia',
              },
              {
                name: this.menuTranslations['OMIRLCONFIG_SAT_IR10'],
                isActive: false,
                location: '/satellite-radar/satellite/Nord-Italia/Ir/Immagine',
                ancestorId: 'satelliteNordItalia',
              },
              {
                name: this.menuTranslations['OMIRLCONFIG_SAT_RADARFULM+IR'],
                isActive: false,
                location:
                  '/satellite-radar/satellite/Nord-Italia/Fulm/Immagine',
                ancestorId: 'satelliteNordItalia',
              },
            ],
          },
          {
            name: 'Mediterraneo',
            isActive: true,
            location: 'satelliteMediterraneo',
            ancestorId: 'satellite',
            children: [
              {
                name: this.menuTranslations['OMIRLCONFIG_SAT_VIS'],
                isActive: false,
                location:
                  '/satellite-radar/satellite/Mediterraneo/Vis/Immagine',
                ancestorId: 'satelliteMediterraneo',
              },
              {
                name: this.menuTranslations['OMIRLCONFIG_SAT_IR10'],
                isActive: false,
                location: '/satellite-radar/satellite/Mediterraneo/Ir/Immagine',
                ancestorId: 'satelliteMediterraneo',
              },
            ],
          },
          {
            name: 'Rapid Scan',
            isActive: true,
            location: 'satelliteRapidScan',
            ancestorId: 'satellite',
            children: [
              {
                name: this.menuTranslations['OMIRLCONFIG_SAT_VIS'],
                isActive: false,
                location: '/satellite-radar/satellite/Rapid-Scan/Vis/Immagine',
                ancestorId: 'satelliteRapidScan',
              },
              {
                name: this.menuTranslations['OMIRLCONFIG_SAT_IR10'],
                isActive: false,
                location: '/satellite-radar/satellite/Rapid-Scan/Ir/Immagine',
                ancestorId: 'satelliteRapidScan',
              },
            ],
          },
        ],
      },
    ];

    let TREE_DATA_MOBILE: SatelliteRadarMenuNode[] = [
      {
        name: 'Radar',
        isActive: true,
        location: 'radar',
        icon: this.icons.registerSvgIcon('radar'),
        children: [
          {
            name: 'Seleziona una regione',
            isActive: false,
          },
          {
            name: 'Liguria',
            isActive: true,
            location: 'radarLiguria',
            ancestorId: 'radar',
            children: [
              {
                name: this.menuTranslations['OMIRLCONFIG_RADAR_INTRAIN5M'],
                isActive: false,
                location: '/satellite-radar/radar/Liguria/Rain5m/Immagine',
                ancestorId: 'radarLiguria',
              },
              {
                name: this.menuTranslations['OMIRLCONFIG_RADAR_RAIN10'],
                isActive: false,
                location: '/satellite-radar/radar/Liguria/Rain10m/Immagine',
                ancestorId: 'radarLiguria',
              },
              {
                name: this.menuTranslations['OMIRLCONFIG_RADAR_RAIN1H'],
                isActive: false,
                location: '/satellite-radar/radar/Liguria/Rain1h/Immagine',
                ancestorId: 'radarLiguria',
              },
            ],
          },
          {
            name: 'Piemonte',
            isActive: true,
            location: 'radarPiemonte',
            ancestorId: 'radar',
            children: [
              {
                name: this.menuTranslations['OMIRLCONFIG_RADAR_INTRAIN5M'],
                isActive: false,
                location: '/satellite-radar/radar/Piemonte/Rain5m/Immagine',
                ancestorId: 'radarPiemonte',
              },
              {
                name: this.menuTranslations['OMIRLCONFIG_RADAR_RAIN1H'],
                isActive: false,
                location: '/satellite-radar/radar/Piemonte/Rain1h/Immagine',
                ancestorId: 'radarPiemonte',
              },
            ],
          },
        ],
      },
      {
        name: 'Satellite',
        isActive: true,
        location: 'satellite',
        icon: this.icons.registerSvgIcon('satellite'),
        children: [
          {
            name: "Seleziona un'area",
            isActive: false,
          },
          {
            name: 'Nord Italia',
            isActive: true,
            location: 'satelliteNordItalia',
            ancestorId: 'satellite',
            children: [
              {
                name: this.menuTranslations['OMIRLCONFIG_SAT_VIS'],
                isActive: false,
                location: '/satellite-radar/satellite/Nord-Italia/Vis/Immagine',
                ancestorId: 'satelliteNordItalia',
              },
              {
                name: this.menuTranslations['OMIRLCONFIG_SAT_IR10'],
                isActive: false,
                location: '/satellite-radar/satellite/Nord-Italia/Ir/Immagine',
                ancestorId: 'satelliteNordItalia',
              },
            ],
          },
          {
            name: 'Mediterraneo',
            isActive: true,
            location: 'satelliteMediterraneo',
            ancestorId: 'satellite',
            children: [
              {
                name: this.menuTranslations['OMIRLCONFIG_SAT_VIS'],
                isActive: false,
                location:
                  '/satellite-radar/satellite/Mediterraneo/Vis/Immagine',
                ancestorId: 'satelliteMediterraneo',
              },
              {
                name: this.menuTranslations['OMIRLCONFIG_SAT_IR10'],
                isActive: false,
                location: '/satellite-radar/satellite/Mediterraneo/Ir/Immagine',
                ancestorId: 'satelliteMediterraneo',
              },
            ],
          },
        ],
      },
    ];

    this.treeData = this.isMobile ? TREE_DATA_MOBILE : TREE_DATA_DESKTOP;
    this.dataSource.data = this.treeData;

    this.selectNodeByPath();
    this.expandNodeAncestors();
  }

  satelliteRadarMenuItemClicked(node: SatelliteRadarMenuNode) {
    if (node.location && node.location != '') {
      if (this.selectedSatelliteRadarMenuNode)
        this.selectedSatelliteRadarMenuNode.isActive =
          !this.selectedSatelliteRadarMenuNode.isActive;
      node.isActive = !node.isActive;
      this.selectedSatelliteRadarMenuNode = node;

      this.menuItemClicked.emit(node);
    }
  }

  getSatelliteRadarNodeById = (id: string): SatelliteRadarMenuNode | null => {
    let result = _.find<ModelsGalleryMenuNode | undefined>(
      this.treeControl.dataNodes,
      (child) => {
        return child?.location == id;
      }
    );
    if (result) return result;
    return null;
  };

  expandNodeAncestors = () => {
    let ancestorId = '';

    if (this.selectedSatelliteRadarMenuNode) {
      ancestorId = this.selectedSatelliteRadarMenuNode.ancestorId || '';
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

  selectNodeByPath = () => {
    if (this.selectedSatelliteRadarMenuNode)
      this.selectedSatelliteRadarMenuNode.isActive =
        !this.selectedSatelliteRadarMenuNode.isActive;

    this.selectedSatelliteRadarMenuNode = this.getSatelliteRadarNodeById(
      this.path
    );

    if (this.selectedSatelliteRadarMenuNode)
      this.selectedSatelliteRadarMenuNode.isActive =
        !this.selectedSatelliteRadarMenuNode.isActive;
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
