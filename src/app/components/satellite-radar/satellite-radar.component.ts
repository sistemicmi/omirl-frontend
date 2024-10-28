import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ConstantsService } from '../../services/constants.service';
import { FormControl } from '@angular/forms';
import { TablesService } from '../../services/tables.service';
import { TablesMenuNode } from '../tables-menu/tables-menu.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SatelliteRadarService } from '../../services/satellite-radar.service';
import { SessionService } from 'src/app/services/session.service';
import { formatDate } from '@angular/common';
import { IconService } from 'src/app/services/icon.service';
import { MatSliderChange } from '@angular/material/slider';
import * as _ from 'lodash';

@Component({
  selector: 'app-satellite-radar',
  templateUrl: './satellite-radar.component.html',
  styleUrls: ['./satellite-radar.component.less'],
})
export class SatelliteRadarComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private constantsService: ConstantsService,
    private tablesService: TablesService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public session: SessionService,
    private satelliteRadarService: SatelliteRadarService,
    @Inject(LOCALE_ID) protected localeId: string,
    private icons: IconService
  ) {
    icons.registerSvgIcon('btn-arrow-left.svg');
    icons.registerSvgIcon('btn-arrow-right.svg');
    icons.registerSvgIcon('photo.svg');
    icons.registerSvgIcon('video.svg');
  }

  service: string = '';
  area: string = '';
  type: string = '';
  format: string = '';

  isSatelliteRadarMenuOpen: boolean = true;
  isSatelliteRadarMenuRail: boolean = false;

  dateControl = new FormControl(null);
  timeControl = new FormControl(null);

  src = '';
  pageDescription = '';

  radarHomeButtonClicked = false;
  satelliteHomeButtonClicked = false;

  fullscreen: boolean = false;

  menuStatus: number = 2;

  reftime: string = '';

  onMenuStatusChange(e: MatSliderChange) {
    switch (e.value) {
      case 0: {
        this.isSatelliteRadarMenuOpen = false;
        this.isSatelliteRadarMenuRail = false;
        break;
      }
      case 1: {
        this.isSatelliteRadarMenuOpen = true;
        this.isSatelliteRadarMenuRail = true;
        break;
      }
      case 2: {
        this.isSatelliteRadarMenuOpen = true;
        this.isSatelliteRadarMenuRail = false;
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

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.service = params['service'];
      this.area = params['area'];
      this.type = params['type'];
      this.format = params['format'];

      if (this.constantsService.logged && params['reftime']) {
        this.reftime = params['reftime'];
        this.session.setSelectedDateTimeCookie(
          new Date(parseInt(params['reftime'] as string))
        );
      }

      //this.setDateTimeFromCookie();
      this.getSelectedSensorFromURL();
    });
    // this.dateControl.valueChanges.subscribe((e) => {
    //   this.onDateTimeChange();
    // });
    // this.timeControl.valueChanges.subscribe((e) => {
    //   this.onDateTimeChange();
    // });
  }

  isLogged(): boolean {
    if (this.constantsService.logged) return this.constantsService.logged;
    return false;
  }

  isHomePage(): boolean {
    if (
      (this.service == undefined || this.service == '') &&
      (this.area == undefined || this.area == '') &&
      (this.type == undefined || this.type == '') &&
      (this.format == undefined || this.format == '')
    )
      return true;
    else return false;
  }

  isMobile(): boolean {
    return this.constantsService.isMobile;
  }

  navigateByUrl(url: string) {
    this.router.navigateByUrl(url);
  }

  onRadarHomeButtonClick() {
    this.satelliteHomeButtonClicked = false;
    this.radarHomeButtonClicked = !this.radarHomeButtonClicked;
  }

  onSatelliteHomeButtonClick() {
    this.radarHomeButtonClicked = false;
    this.satelliteHomeButtonClicked = !this.satelliteHomeButtonClicked;
  }

  onImageButtonClick() {
    if (this.format != 'Immagine')
      this.router.navigateByUrl(
        '/satellite-radar/' +
          this.service +
          '/' +
          this.area +
          '/' +
          this.type +
          '/' +
          'Immagine'
      );
  }

  onAnimationButtonClick() {
    if (this.format != 'Animazione')
      this.router.navigateByUrl(
        '/satellite-radar/' +
          this.service +
          '/' +
          this.area +
          '/' +
          this.type +
          '/' +
          'Animazione'
      );
  }

  getSelectedSensorFromURL() {
    if (this.isHomePage()) return;
    let id = '';
    switch (this.service) {
      case 'radar': {
        switch (this.area) {
          case 'Liguria': {
            switch (this.type) {
              case 'Rain5m': {
                switch (this.format) {
                  case 'Immagine': {
                    id = 'radarRainInt5m';
                    this.pageDescription = 'Intensità oraria pioggia';
                    break;
                  }
                  case 'Animazione': {
                    id = 'radarRainInt5m';
                    this.pageDescription = 'Intensità oraria pioggia';
                    break;
                  }
                }
                break;
              }
              case 'Rain10m': {
                switch (this.format) {
                  case 'Immagine': {
                    id = 'radarRain10m';
                    this.pageDescription = "Pioggia cumulata 10'";
                    break;
                  }
                  case 'Animazione': {
                    id = 'radarRain10m';
                    this.pageDescription = "Pioggia cumulata 10'";
                    break;
                  }
                }
                break;
              }
              case 'Rain1h': {
                switch (this.format) {
                  case 'Immagine': {
                    id = 'radarRain1h';
                    this.pageDescription = 'Cumulata oraria pioggia';
                    break;
                  }
                  case 'Animazione': {
                    id = 'radarRain1h';
                    this.pageDescription = 'Cumulata oraria pioggia';
                    break;
                  }
                }
                break;
              }
              case 'Rain1hPluvio': {
                switch (this.format) {
                  case 'Immagine': {
                    id = 'radarRainStation1h';
                    this.pageDescription = 'Pioggia 1h Radar + Pluviometri';
                    break;
                  }
                  case 'Animazione': {
                    id = 'radarRainStation1h';
                    this.pageDescription = 'Pioggia 1h Radar + Pluviometri';
                    break;
                  }
                }
                break;
              }
            }
            break;
          }
          case 'Piemonte':
            {
              switch (this.type) {
                case 'Rain5m': {
                  switch (this.format) {
                    case 'Immagine': {
                      id = 'PIEMradarRain10m';
                      this.pageDescription = 'Intensità oraria pioggia';
                      break;
                    }
                    case 'Animazione': {
                      id = 'PIEMradarRain10m';
                      this.pageDescription = 'Intensità oraria pioggia';
                      break;
                    }
                  }
                  break;
                }
                case 'Rain1h': {
                  switch (this.format) {
                    case 'Immagine': {
                      id = 'PIEMradarRain1h';
                      this.pageDescription = 'Cumulata oraria pioggia';
                      break;
                    }
                    case 'Animazione': {
                      id = 'PIEMradarRain1h';
                      this.pageDescription = 'Cumulata oraria pioggia';
                      break;
                    }
                  }
                  break;
                }
                case 'Riflet': {
                  switch (this.format) {
                    case 'Immagine': {
                      id = 'PIEMradarCappi';
                      this.pageDescription = 'Riflettività';
                      break;
                    }
                    case 'Animazione': {
                      id = 'PIEMradarCappi';
                      this.pageDescription = 'Riflettività';
                      break;
                    }
                  }
                  break;
                }
              }
              break;
            }
            break;
        }
        break;
      }
      case 'satellite': {
        switch (this.area) {
          case 'Nord-Italia': {
            switch (this.type) {
              case 'Vis': {
                switch (this.format) {
                  case 'Immagine': {
                    id = 'VisNItaly';
                    this.pageDescription = 'Visibile';
                    break;
                  }
                  case 'Animazione': {
                    id = 'VisNItaly';
                    this.pageDescription = 'Visibile';
                    break;
                  }
                }
                break;
              }
              case 'Ir': {
                switch (this.format) {
                  case 'Immagine': {
                    id = 'IrNItaly';
                    this.pageDescription = 'IR 10.8';
                    break;
                  }
                  case 'Animazione': {
                    id = 'IrNItaly';
                    this.pageDescription = 'IR 10.8';
                    break;
                  }
                }
                break;
              }
              case 'Fulm': {
                switch (this.format) {
                  case 'Immagine': {
                    id = 'IrRadarLamps';
                    this.pageDescription = 'Radar + Fulmini + IR 10.8';
                    break;
                  }
                  case 'Animazione': {
                    id = 'IrRadarLamps';
                    this.pageDescription = 'Radar + Fulmini + IR 10.8';
                    break;
                  }
                }
                break;
              }
            }
            break;
          }
          case 'Mediterraneo': {
            switch (this.type) {
              case 'Vis': {
                switch (this.format) {
                  case 'Immagine': {
                    id = 'VisEurope';
                    this.pageDescription = 'Visibile';
                    break;
                  }
                  case 'Animazione': {
                    id = 'VisEurope';
                    this.pageDescription = 'Visibile';
                    break;
                  }
                }
                break;
              }
              case 'Ir': {
                switch (this.format) {
                  case 'Immagine': {
                    id = 'IrEurope';
                    this.pageDescription = 'IR 10.8';
                    break;
                  }
                  case 'Animazione': {
                    id = 'IrEurope';
                    this.pageDescription = 'IR 10.8';
                    break;
                  }
                }
                break;
              }
            }
            break;
          }
          case 'Rapid-Scan': {
            switch (this.type) {
              case 'Vis': {
                switch (this.format) {
                  case 'Immagine': {
                    id = 'VisRSSNItaly';
                    this.pageDescription = 'Visibile';
                    break;
                  }
                  case 'Animazione': {
                    id = 'VisRSSNItaly';
                    this.pageDescription = 'Visibile';
                    break;
                  }
                }
                break;
              }
              case 'Ir': {
                switch (this.format) {
                  case 'Immagine': {
                    id = 'IrRSSNItaly';
                    this.pageDescription = 'IR 10.8';
                    break;
                  }
                  case 'Animazione': {
                    id = 'IrRSSNItaly';
                    this.pageDescription = 'IR 10.8';
                    break;
                  }
                }
                break;
              }
            }
            break;
          }
        }
        break;
      }
    }

    switch (this.format) {
      case 'Immagine': {
        this.satelliteRadarService.getImage(id).subscribe((src) => {
          if (src && src != '')
            this.src = 'https://omirl.regione.liguria.it/' + src;
          else this.src = 'https://omirl.regione.liguria.it/img/nodata.jpg';
        });
        break;
      }
      case 'Animazione': {
        this.satelliteRadarService.getAnimation(id).subscribe((src) => {
          if (src && src != '')
            this.src = 'https://omirl.regione.liguria.it/' + src;
          else this.src = 'https://omirl.regione.liguria.it/img/nodata.jpg';
        });
        break;
      }
    }
  }

  // dateTime -------------------------------------------------------------------- //
  // cleanDate() {
  //   this.dateControl.setValue(null);
  // }
  // cleanTime() {
  //   this.timeControl.setValue(null);
  // }
  // ----------------------------------------------------------------------------- //

  // time ------------------------------------------------------------------------ //

  get selectedDateTime(): string {
    // if (this.dateControl.value) {
    //   let date = this.dateControl.value;
    //   if (this.timeControl.value)
    //     date.setHours(
    //       parseInt(this.timeControl.value.split(':')[0]) + 2,
    //       parseInt(this.timeControl.value.split(':')[1])
    //     );
    //   else return '';
    //   return this.dateControl.value.toJSON().replace('Z', '+0200');
    // }
    // return '';

    let selectedDate = this.session.getSelectedDateTimeCookie();
    let selectedDateString = '';
    if (selectedDate) {
      selectedDateString = formatDate(
        selectedDate,
        'dd/MM/yyyy HH:mm',
        this.localeId
      );
    }

    return selectedDateString;
  }

  onDateTimeChanged(date: Date | null) {
    // if (this.selectedDateTime != '')
    //   this.session.setSelectedDateTimeCookie(this.selectedDateTime);
    // else this.session.deleteSelectedDateTimeCookie();

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

    const currentParamsArray = this.router.url.split('/'),
      lastValue = _.last(currentParamsArray);

    currentParamsArray.pop();

    const url =
      lastValue == this.reftime
        ? currentParamsArray.join('/')
        : this.router.url;

    this.router.navigateByUrl(url + '/' + params.reftime);
    // this.router.navigate(['/satellite-radar', params]);
  }

  // setDateTimeFromCookie() {
  //   if (this.tablesService.getSelectedDateTimeCookie() != '') {
  //     this.dateControl.setValue(
  //       new Date(this.tablesService.getSelectedDateTimeCookie())
  //     );

  //     this.timeControl.setValue(
  //       this.tablesService.getSelectedDateTimeCookie().substr(11, 5)
  //     );
  //   }
  // }
  // ----------------------------------------------------------------------------- //

  // menu ------------------------------------------------------------------------ //

  toggleRailSatelliteRadarMenu = () => {
    this.isSatelliteRadarMenuRail = !this.isSatelliteRadarMenuRail;
    if (this.isSatelliteRadarMenuRail) this.menuStatus = 1;
    else this.menuStatus = 2;
  };

  onSatelliteRadarMenuItemClicked(node: TablesMenuNode) {
    console.log('caught layermenuitem clicked event on node: %o', node);

    let selectedTime = this.session.getSelectedDateTimeCookie();

    let refTime = '';
    if (selectedTime && selectedTime.getTime()) {
      refTime = selectedTime.getTime() + '';
    }

    this.router.navigateByUrl(node.location + '/' + refTime);
  }
  // ----------------------------------------------------------------------------- //

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
}
