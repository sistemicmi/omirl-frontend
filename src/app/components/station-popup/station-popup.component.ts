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
import { ConstantsService } from 'src/app/services/constants.service';
import { IconService } from 'src/app/services/icon.service';
import { IStation } from 'src/app/services/station.service';
import { ChartPopupComponent } from '../chart-popup/chart-popup.component';
import { WebcamPopupComponent } from '../webcam-popup/webcam-popup.component';

@Component({
  selector: 'app-station-popup',
  templateUrl: './station-popup.component.html',
  styleUrls: ['./station-popup.component.less'],
})
export class StationPopupComponent implements OnInit {
  data: IStation;
  clockIcon: string;
  refDateUTC: string;
  refDateLocale: string;
  refDate: Date;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) data: IStation,
    @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) dataBottom: IStation,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    public constants: ConstantsService,
    private icons: IconService
  ) {
    let _data = data;

    if (dataBottom) {
      _data = dataBottom;
    }

    this.data = _data;
    this.data!.imageLinkOff = this.icons.registerSvgIcon(_data.imageLinkOff);
    this.clockIcon = this.icons.registerSvgIcon('clock.svg');
    this.refDateUTC = new Date(_data.referenceDate + 'Z').toUTCString();
    this.refDateLocale = new Date(_data.referenceDate + 'Z').toLocaleString();
    this.refDate = new Date(_data.referenceDate + 'Z');

    if (this.data.sensorType == 'Elio' || this.data.sensorType == 'Foglie') {
      this.data.measureUnit = '%';
    }
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

  openChart = ($event?: Event) => {
    if ($event) $event.stopImmediatePropagation();

    if (this.data.sensorType == 'Sfloc') {
      return;
    }

    if (this.data.sensorType == 'webcam') {
      this.dialog.open(WebcamPopupComponent, {
        maxWidth: '95vw',
        hasBackdrop: false,
        data: this.data,
      });
    } else {
      this.dialog.open(ChartPopupComponent, {
        maxWidth: '95vw',
        hasBackdrop: false,
        data: this.data,
      });
    }
  };
}
