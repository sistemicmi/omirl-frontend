import { FlatTreeControl } from '@angular/cdk/tree';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeNode,
} from '@angular/material/tree';
import { DomSanitizer } from '@angular/platform-browser';
import { ConstantsService } from 'src/app/services/constants.service';
import { ITableLink, TablesService } from 'src/app/services/tables.service';
import * as _ from 'lodash';
import { CookieService } from 'ngx-cookie-service';
import {
  IModelsGalleryLink,
  ModelsGalleryService,
} from '../../services/models-gallery.service';
import { IconService } from 'src/app/services/icon.service';

export interface ModelsGalleryMenuNode {
  name: string;
  children?: ModelsGalleryMenuNode[] | null;
  icon?: string;
  location?: string;
  isActive: boolean;
  ancestorName?: string;
  ancestorIcon?: string;
  ancestorId?: string;
}

/** Flat node with expandable and level information */
interface LayerMenuFlatNode extends ModelsGalleryMenuNode {
  expandable: boolean;
  level: number;
}
@Component({
  selector: 'app-models-gallery-menu',
  templateUrl: './models-gallery-menu.component.html',
  styleUrls: ['./models-gallery-menu.component.less'],
})
export class ModelsGalleryMenuComponent {
  @Output() menuItemClicked = new EventEmitter<ModelsGalleryMenuNode>();
  @Input() open: boolean = true;
  @Input() path: string = '';
  @Output() nodeFromPath = new EventEmitter<ModelsGalleryMenuNode | null>();

  private _transformer = (
    node: ModelsGalleryMenuNode,
    level: number
  ): LayerMenuFlatNode => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      icon: node.icon,
      level: level,
      location: node.location,
      isActive: node.isActive,
      ancestorName: node.ancestorName,
      ancestorIcon: node.ancestorIcon,
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
  treeData: ModelsGalleryMenuNode[] = [];
  iconRegistry: MatIconRegistry;
  sanitizer: DomSanitizer;
  menuTranslations: { [key: string]: string } = {};
  isMobile: boolean;
  activeSensorNode: ModelsGalleryMenuNode | null; //currently selected station sensors layer node
  activeMapNode: ModelsGalleryMenuNode | null; //currently selected WMS layer node
  isLayerMenuOpen: boolean = false;
  selectedTableNode: ModelsGalleryMenuNode | null = null;
  isLogged: boolean = false;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    constants: ConstantsService,
    private modelsGalleryService: ModelsGalleryService,
    cookieService: CookieService,
    private icons: IconService
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

    //MERGE-REMINDER: STILL TO ADD IN SERVICE
    // -- all btns
    this.menuTranslations[
      'TLC_BOLAM_EU'
    ] = $localize`:@@TLC_BOLAM_EU:Bolam Europa`;
    this.menuTranslations[
      'TLC_BOLAM_IT'
    ] = $localize`:@@TLC_BOLAM_IT:Bolam Italia`;
    this.menuTranslations['TLC_MOLOCH'] = $localize`:@@TLC_MOLOCH:Moloch`;
    this.menuTranslations['TLC_WW3LIG'] = $localize`:@@TLC_WW3LIG:WW3 Liguria`;
    this.menuTranslations[
      'TLC_WW3MED'
    ] = $localize`:@@TLC_WW3MED:WW3 Mediterraneo`;

    // -- fst btn
    this.menuTranslations[
      'TLC_BOLAMPREC12EUROPE'
    ] = $localize`:@@TLC_BOLAMPREC12EUROPE:Precipitazione totale cumulata su 12 ore`;
    this.menuTranslations[
      'TLC_BOLAMMSLPEUROPE'
    ] = $localize`:@@TLC_BOLAMMSLPEUROPE:Pressione ridotta al livello medio del mare`;
    this.menuTranslations[
      'TLC_BOLAMRTCLOUDCEUROPE'
    ] = $localize`:@@TLC_BOLAMRTCLOUDCEUROPE:Copertura nuvolosa totale`;
    this.menuTranslations[
      'TLC_BOLAMZEROTEUROPE'
    ] = $localize`:@@TLC_BOLAMZEROTEUROPE:Quota dello zero termico`;
    this.menuTranslations[
      'TLC_BOLAMKINDEXEUROPE'
    ] = $localize`:@@TLC_BOLAMKINDEXEUROPE:Indice temporalesco K`;
    this.menuTranslations[
      'TLC_BOLAMTHETA850EUROPE'
    ] = $localize`:@@TLC_BOLAMTHETA850EUROPE:Temperatura potenziale equivalente a 850 hPa`;
    this.menuTranslations[
      'TLC_BOLAMHMA850EUROPE'
    ] = $localize`:@@TLC_BOLAMHMA850EUROPE:Temperatura, umidita' e vento a 850 hPa`;
    this.menuTranslations[
      'TLC_BOLAMHMA700EUROPE'
    ] = $localize`:@@TLC_BOLAMHMA700EUROPE:Temperatura, umidita' e vento a 700 hPa`;
    this.menuTranslations[
      'TLC_BOLAMRVORT800GHEUROPE'
    ] = $localize`:@@TLC_BOLAMRVORT800GHEUROPE:Vorticita' relativa a 500 hPa`;
    this.menuTranslations[
      'TLC_BOLAMTEMO500GHEUROPE'
    ] = $localize`:@@TLC_BOLAMTEMO500GHEUROPE:Temperatura a 500 hPa`;
    this.menuTranslations[
      'TLC_BOLAMDIVERGENCEJETEUROPE'
    ] = $localize`:@@TLC_BOLAMDIVERGENCEJETEUROPE:Divergenza a 300 hPa`;

    // -- snd btn
    this.menuTranslations[
      'TLC_BOLAMPREC12ITALY'
    ] = $localize`:@@TLC_BOLAMPREC12ITALY:Precipitazione totale cumulata su 12 ore`;
    this.menuTranslations[
      'TLC_BOLAMPREC3ITALY'
    ] = $localize`:@@TLC_BOLAMPREC3ITALY:Precipitazione totale cumulata su 3 ore`;
    this.menuTranslations[
      'TLC_BOLAMSNOW3NITALY'
    ] = $localize`:@@TLC_BOLAMSNOW3NITALY:Equivalente in acqua della precipitazione nevosa cumulata su 3 ore`;
    this.menuTranslations[
      'TLC_BOLAMTEMP2WINDSITALY'
    ] = $localize`:@@TLC_BOLAMTEMP2WINDSITALY:Temperatura a 2m`;
    this.menuTranslations[
      'TLC_BOLAMWINDS10ITALY'
    ] = $localize`:@@TLC_BOLAMWINDS10ITALY:Vento a 10 m`;
    this.menuTranslations[
      'TLC_BOLAMTCLOUDCITALY'
    ] = $localize`:@@TLC_BOLAMTCLOUDCITALY:Copertura nuvolosa totale`;
    this.menuTranslations[
      'TLC_BOLAMHMA850ITALY'
    ] = $localize`:@@TLC_BOLAMHMA850ITALY:Temperatura, umidita' e vento a 850 hPa`;
    this.menuTranslations[
      'TLC_BOLAMHMA700ITALY'
    ] = $localize`:@@TLC_BOLAMHMA700ITALY:Temperatura, umidita' e vento a 700 hPa`;

    // trd btn
    this.menuTranslations[
      'TLC_MOLOCHTPREC3NITALY'
    ] = $localize`:@@TLC_MOLOCHTPREC3NITALY:Precipitazione totale cumulata su 3 ore`;
    this.menuTranslations[
      'TLC_MOLOCHSNOW3NITALY'
    ] = $localize`:@@TLC_MOLOCHSNOW3NITALY:Equivalente in acqua della precipitazione nevosa cumulata su 3 ore`;
    this.menuTranslations[
      'TLC_MOLOCHTEMP2NITALY'
    ] = $localize`:@@TLC_MOLOCHTEMP2NITALY:Temperatura a 2m`;
    this.menuTranslations[
      'TLC_MOLOCHWINDS10NITALY'
    ] = $localize`:@@TLC_MOLOCHWINDS10NITALY:Vento a 10 m`;
    this.menuTranslations[
      'TLC_MOLOCHTCLOUDNITALY'
    ] = $localize`:@@TLC_MOLOCHTCLOUDNITALY:Copertura nuvolosa totale`;
    this.menuTranslations[
      'TLC_MOLOCHHMA850NITALY'
    ] = $localize`:@@TLC_MOLOCHHMA850NITALY:Temperatura, umidita' e vento a 850 hPa`;
    this.menuTranslations[
      'TLC_MOLOCHHMA700NITALY'
    ] = $localize`:@@TLC_MOLOCHHMA700NITALY:Temperatura, umidita' e vento a 700 hPa`;

    // frt btn
    this.menuTranslations[
      'TLC_WW3LIG_SWH'
    ] = $localize`:@@TLC_WW3LIG_SWH:Altezza significativa`;
    this.menuTranslations[
      'TLC_WW3LIG_MWP'
    ] = $localize`:@@TLC_WW3LIG_MWP:Periodo medio`;
    this.menuTranslations[
      'TLC_WW3LIG_WIND'
    ] = $localize`:@@TLC_WW3LIG_WIND:Vento`;

    // fft btn
    this.menuTranslations[
      'TLC_WW3MED_SWH'
    ] = $localize`:@@TLC_WW3MED_SWH:Altezza significativa`;
    this.menuTranslations[
      'TLC_WW3MED_MWP'
    ] = $localize`:@@TLC_WW3MED_MWP:Periodo medio`;
    this.menuTranslations[
      'TLC_WW3MED_WIND'
    ] = $localize`:@@TLC_WW3MED_WIND:Vento`;

    this.loadMenu();
  }

  loadMenu() {
    let menuLinks = this.modelsGalleryService.getMenuLinks();

    //wait for all menu links to be loaded before filling the menu tree
    menuLinks.subscribe((modelsGalleryMenuData: IModelsGalleryLink[]) => {
      console.log('Tables menu data: %o', modelsGalleryMenuData);

      for (const [menuIndex, menuLink] of modelsGalleryMenuData.entries()) {
        let treeMenuItem: ModelsGalleryMenuNode = {
          name: this.menuTranslations[menuLink.description],
          children: menuLink.sublevelGalleryLink?.map((el) => ({
            name: this.menuTranslations[el.description],
            children: [],
            icon: '',
            location: el.codeParent + el.codeVariable + el.code,
            isActive: el.isActive,
            ancestorName: this.menuTranslations[menuLink.description],
            ancestorIcon: this.icons.registerSvgIcon(menuLink.imageLinkOff),
            ancestorId: menuLink.code,
          })),
          icon: this.icons.registerSvgIcon(menuLink.imageLinkOff),
          location: menuLink.code,
          isActive: menuLink.active,
        };

        this.treeData.push(treeMenuItem);
      }

      this.dataSource.data = this.treeData;
      this.selectNodeByPath();
      this.expandNodeAncestors();
      this.nodeFromPath.emit(this.getTableNodeById(this.path));
    });
  }

  getTableNodeById = (id: string): ModelsGalleryMenuNode | null => {
    let result = _.find<ModelsGalleryMenuNode | undefined>(
      this.treeControl.dataNodes,
      (child) => {
        return child?.location == id;
      }
    );
    if (result) return result;
    return null;
  };

  layerMenuItemClicked = (node: ModelsGalleryMenuNode) => {
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
    let newSelectedTableNode = this.getTableNodeById(
      node.location ? node.location : ''
    );

    if (this.selectedTableNode)
      this.selectedTableNode.isActive = !this.selectedTableNode.isActive;
    node.isActive = !node.isActive;
    this.selectedTableNode = newSelectedTableNode;

    this.menuItemClicked.emit(node);
  };

  expandNodeAncestors = () => {
    let ancestorId = '',
      ancestorName = '';

    if (this.selectedTableNode) {
      ancestorId = this.selectedTableNode.ancestorId || '';
      ancestorName = this.selectedTableNode.ancestorName || '';
    }

    while (
      ancestorId &&
      ancestorId != '' &&
      ancestorName &&
      ancestorName != ''
    ) {
      const flattenedNode = _.find(
        this.treeControl.dataNodes,
        (node) => node.location == ancestorId && node.name == ancestorName
      );

      if (flattenedNode && flattenedNode.expandable) {
        ancestorId = flattenedNode.ancestorId || '';
        ancestorName = flattenedNode.ancestorName || '';
        this.treeControl.expand(flattenedNode);
      }
    }
  };

  selectNodeByPath = () => {
    if (this.selectedTableNode)
      this.selectedTableNode.isActive = !this.selectedTableNode.isActive;

    this.selectedTableNode = this.getTableNodeById(this.path);

    if (this.selectedTableNode)
      this.selectedTableNode.isActive = !this.selectedTableNode.isActive;
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
