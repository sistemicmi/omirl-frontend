import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { computeDecimalDigest } from '@angular/compiler/src/i18n/digest';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { toStringHDMS } from 'ol/coordinate';
import { ChartService } from 'src/app/services/chart.service';
import { ConstantsService } from 'src/app/services/constants.service';
import {
  ISensor,
  MapNavigatorService,
} from 'src/app/services/map-navigator.service';
import { IHydroStation, IStation } from 'src/app/services/station.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'chart-popup',
  templateUrl: './chart-popup.component.html',
  styleUrls: ['./chart-popup.component.less'],
})
export class ChartPopupComponent implements OnInit {
  // props ------------------------- //
  sensorsData: any;
  chartList: any;
  chartData: any;
  selectedSensorType: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: IStation,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private constantsService: ConstantsService,
    private chartService: ChartService,
    private dialogRef: MatDialogRef<ChartPopupComponent>,
    private dialog: MatDialog,
    private mapNavService: MapNavigatorService
  ) {
    mapNavService.sensors.subscribe((sensorsData) => {
      console.log('sensors in chart: ', sensorsData);
      this.sensorsData = sensorsData;
    });
  }

  async ngOnInit(): Promise<void> {
    //get chart data from web service
    const chartData: any = await this.chartService
      .getStationChart(this.data.shortCode, this.data.sensorType)
      .toPromise();

    if (!chartData) alert('Dati non disponibili');

    this.chartData = chartData;
    this.chartList = chartData.otherChart;
    this.selectedSensorType = this.data.sensorType;
    this.chartData.sensorType = this.data.sensorType;
    console.log('Chartdata from WS: ', chartData);
  }

  bringOnTop(): void {
    //console.log("opendialogs before: %o %o", this.dialog.openDialogs[0].id, this.dialog.openDialogs[1].id)
    //console.log("container: ", this.dialogRef._containerInstance._id)

    if (this.dialogRef.id != this.dialog.openDialogs[0].id) {
      //if this dialog is not on top, find its position in the stack
      let currentDialogPositionInStack = this.dialog.openDialogs.indexOf(
        this.dialogRef
      );
      //get the dialog on top level (the currently visible dialog)
      let topDialogInStack = this.dialog.openDialogs[0];
      //bring current dialog to top (last index of stack)
      this.dialog.openDialogs[0] = this.dialogRef;
      //set z-index to top
      document.querySelector(
        '#' + this.dialogRef.id
      )!.parentElement!.parentElement!.style.zIndex = '1001';
      //send previously active dialog backwards
      this.dialog.openDialogs[currentDialogPositionInStack] = topDialogInStack;
      //set z-index to back
      document.querySelector(
        '#' + topDialogInStack.id
      )!.parentElement!.parentElement!.style.zIndex = '1000';

      //console.log("opendialogs after: %o %o", this.dialog.openDialogs[0].id, this.dialog.openDialogs[1].id)
    }
  }

  dragEnd($event: CdkDragEnd) {
    return;
    console.log($event);
    console.log('freeDragPosition: ', $event.source.getFreeDragPosition());
    console.log('rootElement: ', $event.source.getRootElement());
    let deltaPosition = $event.source.getFreeDragPosition();
    let rootElement = $event.source.getRootElement();
    rootElement.style.transform = 'translate3d(100px, -20px, 0px)';
    //this.dialogRef.updatePosition({ top: '25px', left: '25px' })
  }

  onSensorClick = async (sensorCode: string) => {
    //get chart data from web service
    const chartData: any = await this.chartService
      .getStationChart(this.data.shortCode, sensorCode)
      .toPromise();

    this.chartData = chartData;
    this.chartList = chartData.otherChart;
    this.selectedSensorType = sensorCode;
    this.chartData.sensorType = sensorCode;
    console.log('HAndling click on sensorbar - Chartdata from WS: ', chartData);
  };
}
