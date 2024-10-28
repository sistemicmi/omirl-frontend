import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { computeDecimalDigest } from '@angular/compiler/src/i18n/digest';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
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

@Component({
  selector: 'app-chart-hydro-popup',
  templateUrl: './chart-hydro-popup.component.html',
  styleUrls: [
    '../chart-popup/chart-popup.component.less',
    './chart-hydro-popup.component.less',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ChartHydroPopupComponent implements OnInit {
  // props ------------------------- //
  sensorsData: any;
  chartList: any;
  chartData: any;
  chartImages: string[] = [];
  selectedSensorType: string = '';
  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IHydroStation,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private constantsService: ConstantsService,
    private chartService: ChartService,
    private dialogRef: MatDialogRef<ChartHydroPopupComponent>,
    private dialog: MatDialog,
    private mapNavService: MapNavigatorService
  ) {
    console.log('hydro chart sensors: ', this.mapNavService.hydroSensors);
    this.sensorsData = this.mapNavService.hydroSensors;
  }

  ngOnInit(): void {
    //get chart data from web service
    this.chartService
      .getSectionChart(this.data.shortCode ?? '', this.data.sensorType)
      .subscribe((chartData: any) => {
        this.chartData = chartData;
        this.chartList = chartData.otherChart;
        this.parseImageServiceResponse(chartData);
        this.selectedSensorType = this.data.sensorType;
        console.log('Chartdata from WS: ', chartData);
      });
  }

  parseImageServiceResponse(chartData: any) {
    this.chartImages = [];
    if (chartData.imageLink) {
      this.chartImages = [
        this.constantsService.siteURL + '/Omirl/' + chartData.imageLink,
      ];
    }
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

  onSensorClick = (sensorCode: string) => {
    //get chart data from web service
    this.chartService
      .getSectionChart(this.data.shortCode ?? '', sensorCode)
      .subscribe((chartData: any) => {
        this.chartData = chartData;
        this.chartList = chartData.otherChart;
        this.parseImageServiceResponse(chartData);
        this.selectedSensorType = sensorCode;
        console.log(
          'HAndling click on sensorbar - Chartdata from WS: ',
          chartData
        );
      });
  };

  zoomIn = () => {
    if (this.imageElement) {
      const oldHeight = parseInt(this.imageElement.nativeElement.style.height);

      this.imageElement.nativeElement.style.height =
        Math.min(oldHeight + 5, 79) + 'vh';
    }
  };

  zoomOut = () => {
    if (this.imageElement) {
      const oldHeight = parseInt(this.imageElement.nativeElement.style.height);
      this.imageElement.nativeElement.style.height =
        Math.max(oldHeight - 5, 5) + 'vh';
    }
  };
}
