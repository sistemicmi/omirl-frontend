import { Component, Inject, OnInit, Optional, Sanitizer } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { ConstantsService } from 'src/app/services/constants.service';
import { IconService } from 'src/app/services/icon.service';
import { IHydroStation } from 'src/app/services/station.service';
import { TranslationService } from 'src/app/services/translation.service';
import { ChartHydroPopupComponent } from '../chart-hydro-popup/chart-hydro-popup.component';

@Component({
  selector: 'app-stationhydro-popup',
  templateUrl: './stationhydro-popup.component.html',
  styleUrls: ['./stationhydro-popup.component.less'],
})
export class StationhydroPopupComponent implements OnInit {
  data: IHydroStation;
  clockIcon: string;
  refDateUTC: string;
  refDateLocale: string;
  imgUrl: string;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) data: IHydroStation,
    @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) dataBottom: IHydroStation,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    public constants: ConstantsService,
    public translate: TranslationService,
    private icons: IconService
  ) {
    let _data = data;

    if (dataBottom) {
      _data = dataBottom;
    }

    this.imgUrl = '';
    this.data = _data;

    if (
      this.data!.imageLinkOff &&
      _.endsWith('.svg', this.data!.imageLinkOff)
    ) {
      this.data!.imageLinkOff = this.icons.registerSvgIcon(
        _data.imageLinkOff ?? ''
      );
    } else {
      this.imgUrl =
        'https://' + this.constants.baseURL + '/' + this.data!.imageLinkOff;
    }
    this.clockIcon = this.icons.registerSvgIcon('clock.svg');
    this.refDateUTC = new Date(_data.referenceDate + 'Z').toUTCString();
    this.refDateLocale = new Date(_data.referenceDate + 'Z').toLocaleString();
  }

  close = ($event: Event) => {
    $event.stopImmediatePropagation();
    this.bottomSheet.dismiss();
  };

  ngOnInit(): void {}

  // registerSvgIcon = (iconFileName:string, iconName?:string) : string => {
  //   if (!iconName) {
  //     //remove extension from filename
  //     iconName = iconFileName.replace(/\.[^/.]+$/, "")
  //   }
  //   this.iconRegistry.addSvgIcon(iconName, this.sanitizer.bypassSecurityTrustResourceUrl('../../assets/img/layout-menu-icons/' + iconName + ".svg"))
  //   return iconName
  // }

  openChart = ($event: Event) => {
    $event.stopImmediatePropagation();
    this.dialog.open(ChartHydroPopupComponent, {
      maxWidth: '95vw',
      hasBackdrop: false,
      data: this.data,
    });
  };
}
