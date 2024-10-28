import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TablesMenuNode } from '../tables-menu/tables-menu.component';
import { ConstantsService } from '../../services/constants.service';
import { Sort } from '@angular/material/sort';
import * as _ from 'lodash';

// custom imports -------------------------------------------------------- //
import {
  ISensorsRow,
  ISensorsResponse,
  IMaxRow,
  IMaxResponse,
  ISummaryResponse,
  ITempSummaryRow,
  IWindSummaryRow,
  IAlertzonesRow,
  IAlertzonesResponse,
  TablesService,
  IModelsResponse,
} from '../../services/tables.service';

import {
  displayedColumns as sensorstableDisplyedColumns,
  displayedNames as sensorstableDisplyedNames,
} from './data/sensorstable.data';

import {
  displayedColumns as maxtableDisplyedColumns,
  displayedNames as maxtableDisplyedNames,
} from './data/maxtable.data';

import {
  displayedColumns as summarytableDisplyedColumns,
  displayedNames as summarytableDisplyedNames,
} from './data/summarytable.data';

import {
  displayedColumns as alertzonestableDisplyedColumns,
  displayedNames as alertzonestableDisplyedNames,
} from './data/alertzonestable.data';

import {
  displayedColumns as modelstableDisplyedColumns,
  displayedNames as modelstableDisplyedNames,
} from './data/modelstable.data';
import { ChartPopupComponent } from '../chart-popup/chart-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { SessionService } from 'src/app/services/session.service';
import { IconService } from 'src/app/services/icon.service';
import { MatSliderChange } from '@angular/material/slider';
// ---------------------------------------------------------------------- //

@Component({
  selector: 'tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.less'],
})
export class TablesComponent implements OnInit {
  constructor(
    private tablesService: TablesService,
    private route: ActivatedRoute,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router,
    private constantsService: ConstantsService,
    private dialog: MatDialog,
    public session: SessionService,
    @Inject(LOCALE_ID) protected localeId: string,
    public icons: IconService
  ) {
    icons.registerSvgIcon('btn-arrow-left.svg');
    icons.registerSvgIcon('btn-arrow-right.svg');
    //this.router.routeReuseStrategy.shouldReuseRoute = () => true;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.selectedSensorCode = params['sensorCode'];
      if (this.constantsService.logged && params['reftime']) {
        this.reftime = params['reftime'];
        this.session.setSelectedDateTimeCookie(
          new Date(parseInt(params['reftime'] as string))
        );
      }
      this.initTables();
      this.resetForms();
      //this.setDateTimeFromCookie();
    });
    // this.dateControl.valueChanges.subscribe((e) => {
    //   this.onDateTimeChange();
    // });
    // this.timeControl.valueChanges.subscribe((e) => {
    //   this.onDateTimeChange();
    // });
  }

  // props ---------------------------------------------------------------------------------- //
  dataSource: any[][] = [];
  displayedColumns: string[][] = [];
  displayedNames: any[] = [];
  updateTime: string = '';

  areaControl = new FormControl();
  basinControl = new FormControl();
  codeControl = new FormControl();
  districtControl = new FormControl();
  municipalityControl = new FormControl();
  nameControl = new FormControl();
  underbasinControl = new FormControl();
  modelsBasinControl = new FormControl();
  modelsSectionControl = new FormControl();
  isFiltered = false;

  id: string = '';
  selectedSensorCode: string = '';

  // dateControl = new FormControl(null);
  // timeControl = new FormControl(null);

  isTablesMenuOpen: boolean = true;
  isTablesMenuRail: boolean = false;

  panelOpenState = false;
  panelA = false;
  panelB = false;
  panelC = false;
  panelD = false;
  panelE = false;
  panelCP = false;
  panelCL = false;
  panelM = false;

  menuStatus: number = 2;

  reftime: string = '';

  // ---------------------------------------------------------------------------------------- //

  isLogged(): boolean {
    if (this.constantsService.logged) return this.constantsService.logged;
    return false;
  }

  // methods -------------------------------------------------------------------------------- //

  onMenuStatusChange(e: MatSliderChange) {
    switch (e.value) {
      case 0: {
        this.isTablesMenuOpen = false;
        this.isTablesMenuRail = false;
        break;
      }
      case 1: {
        this.isTablesMenuOpen = true;
        this.isTablesMenuRail = true;
        break;
      }
      case 2: {
        this.isTablesMenuOpen = true;
        this.isTablesMenuRail = false;
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

  initTables() {
    this.getDisplayedColumns();
    this.getDisplayedNames();
    this.getDataSource();
  }

  getDataSource() {
    this.dataSource = [];
    this.updateTime = '-';

    switch (this.id) {
      case 'sensorstable': {
        this.tablesService
          .getSensorsTable(this.selectedSensorCode)
          .subscribe((el) => this.convertSensorsTableData(el));
        break;
      }
      case 'maxtable': {
        this.tablesService
          .getMaxTable()
          .subscribe((el) => this.convertMaxTableData(el));
        break;
      }
      case 'summarytable': {
        this.tablesService
          .getSummaryTable()
          .subscribe((el) => this.convertSummaryTableData(el));
        break;
      }
      case 'alertzonestable': {
        this.tablesService.getAlertzonesTable().subscribe((el) => {
          this.convertAlertzonesTableData(el);
        });
        break;
      }
      case 'modelstable': {
        this.tablesService
          .getModelsTable(this.selectedSensorCode)
          .subscribe((el) => {
            this.convertModelsTableData(el);
          });
        break;
      }
    }
  }

  getDisplayedColumns() {
    this.displayedColumns = [];

    switch (this.id) {
      case 'sensorstable': {
        this.displayedColumns.push(sensorstableDisplyedColumns);
        break;
      }
      case 'maxtable': {
        this.displayedColumns.push(maxtableDisplyedColumns);
        break;
      }
      case 'summarytable': {
        this.displayedColumns = summarytableDisplyedColumns;
        break;
      }
      case 'alertzonestable': {
        this.displayedColumns.push(alertzonestableDisplyedColumns);
        break;
      }
      case 'modelstable': {
        this.displayedColumns.push(modelstableDisplyedColumns);
        break;
      }
    }
  }

  getDisplayedNames() {
    this.displayedNames = [];

    switch (this.id) {
      case 'sensorstable': {
        this.displayedNames.push(sensorstableDisplyedNames);
        break;
      }
      case 'maxtable': {
        this.displayedNames.push(maxtableDisplyedNames);
        break;
      }
      case 'summarytable': {
        this.displayedNames = summarytableDisplyedNames;
        break;
      }
      case 'alertzonestable': {
        this.displayedNames.push(alertzonestableDisplyedNames);
        break;
      }
      case 'modelstable': {
        this.displayedNames.push(modelstableDisplyedNames);
        break;
      }
    }
  }

  // sorting --------------------------------------------------------------------- //

  compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  sortData(sort: Sort | any, index: number) {
    const data = this.dataSource[index].slice();

    if (!sort.active || sort.direction === '') {
      this.getDataSource();
      return;
    }

    this.dataSource[index] = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.compare(a[sort.active], b[sort.active], isAsc);
    });
  }
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
    // this.router.navigate(['/tabelle', params]);
  }

  // setDateTimeFromCookie() {
  //   if (this.session.getSelectedDateTimeCookie()) {
  //     this.dateControl.setValue(this.session.getSelectedDateTimeCookie())

  //     this.timeControl.setValue(
  //       formatDate(this.session.getSelectedDateTimeCookie(), 'HH:mm', this.localeId)
  //     );
  //   }
  // }
  // ----------------------------------------------------------------------------- //

  // download functions ---------------------------------------------------------- //

  downloadPath: string = 'download';

  exportSensorsTable() {
    location.href = this.tablesService.exportCSVSensorsTable(
      this.selectedSensorCode
    );
  }

  exportMaxTable() {
    location.href = this.tablesService.exportCSVMaxTable(this.selectedDateTime);
  }

  exportModelsTable() {
    location.href = this.tablesService.exportCSVModelsTable(
      this.selectedSensorCode,
      this.selectedDateTime
    );
  }

  // ----------------------------------------------------------------------------- //

  // aux-meths ------------------------------------------------------------------- //

  convertModelsTableData(el: IModelsResponse[]) {
    _.map(el, (basin) => {
      let res = _.orderBy(basin.sectionBasinsCodes, 'orderNumber', 'asc');
      basin.sectionBasinsCodes = res;
    });
    this.dataSource.push(el);
  }

  convertAlertzonesTableData(el: IAlertzonesResponse) {
    let alertzone: IAlertzonesRow[] = [];

    const setDataSource = () => {
      this.dataSource.push(alertzone);
      alertzone = [];
    };

    _.map(el.alertZonesA, (el) => {
      alertzone.push(this.convertAlertzonesRow(el));
    });
    setDataSource();

    _.map(el.alertZonesB, (el) => {
      alertzone.push(this.convertAlertzonesRow(el));
    });
    setDataSource();

    _.map(el.alertZonesC, (el) => {
      alertzone.push(this.convertAlertzonesRow(el));
    });
    setDataSource();

    _.map(el.alertZonesCLess, (el) => {
      alertzone.push(this.convertAlertzonesRow(el));
    });
    setDataSource();

    _.map(el.alertZonesCPlus, (el) => {
      alertzone.push(this.convertAlertzonesRow(el));
    });
    setDataSource();

    _.map(el.alertZonesD, (el) => {
      alertzone.push(this.convertAlertzonesRow(el));
    });
    setDataSource();

    _.map(el.alertZonesE, (el) => {
      alertzone.push(this.convertAlertzonesRow(el));
    });
    setDataSource();

    _.map(el.alertZonesM, (el) => {
      alertzone.push(this.convertAlertzonesRow(el));
    });
    setDataSource();

    this.updateTime = el.updateDateTime
      ? new Date(el.updateDateTime).toLocaleString()
      : '-';
  }

  convertAlertzonesRow(el: IAlertzonesRow): IAlertzonesRow {
    return {
      ...el,
      station: el.station + ' [' + el.code + ']',
      valueOnDate24HMax: parseFloat((el.valueOnDate24HMax / 10).toFixed(2)),
      date24HMax: this.formatDate(el.date24HMax, 'alertzonesTable'),
      valueOnDateRef: parseFloat((el.valueOnDateRef / 10).toFixed(2)),
      dateRef: this.formatDate(el.dateRef, 'alertzonesTable'),
    };
  }

  convertMaxTableData(el: IMaxResponse) {
    let alertZones: IMaxRow[] = [],
      districts: IMaxRow[] = [];

    _.map(el.alertZones, (el) => {
      alertZones.push(this.convertMaxRow(el));
    });

    _.map(el.districts, (el) => {
      districts.push(this.convertMaxRow(el));
    });
    this.dataSource.push(alertZones, districts);
    this.updateTime = el.updateDateTime
      ? new Date(el.updateDateTime).toLocaleString()
      : '-';
  }

  convertMaxRow(el: IMaxRow): IMaxRow {
    return {
      ...el,
      m5: el.m5val + ' ' + el.m5,
      m15: el.m15val + ' ' + el.m15,
      m30: el.m30val + ' ' + el.m30,
      h1: el.h1val + ' ' + el.h1,
      h3: el.h3val + ' ' + el.h3,
      h6: el.h6val + ' ' + el.h6,
      h12: el.h12val + ' ' + el.h12,
      h24: el.h24val + ' ' + el.h24,
    };
  }

  convertSummaryTableData(el: ISummaryResponse) {
    let alertInfo: any[] = [],
      districtsInfo: any[] = [],
      windInfo: any[] = [];

    _.map(el.alertInfo, (el: ITempSummaryRow) => {
      alertInfo.push(this.convertSummaryRow(el));
    });

    _.map(el.districtInfo, (el) => {
      districtsInfo.push(this.convertSummaryRow(el));
    });

    _.map(el.windInfo, (el) => {
      windInfo.push(this.convertSummaryRow(el));
    });
    this.dataSource.push(alertInfo, districtsInfo, windInfo);
    this.updateTime = el.updateDateTime
      ? new Date(el.updateDateTime).toLocaleString()
      : '-';
  }

  convertSummaryRow(el: any): ITempSummaryRow | IWindSummaryRow {
    if (!el.gust) {
      return {
        ...el,
        min: el.min + ' ' + this.formatDate(el.refDateMin, 'summaryTable'),
        max: el.max + ' ' + this.formatDate(el.refDateMax, 'summaryTable'),
      };
    }
    return {
      ...el,
      gust:
        (el.gust * 3.6).toFixed(1) +
        ' ' +
        this.formatDate(el.refDateGust, 'summaryTable'),
      max:
        (el.max * 3.6).toFixed(1) +
        ' ' +
        this.formatDate(el.refDateWind, 'summaryTable'),
    };
  }

  convertSensorsTableData(el: ISensorsResponse) {
    let dataSource: ISensorsRow[] = [];

    if (el.sensorTye == 'wind')
      _.map(el.tableRows, (el) => {
        dataSource.push(this.convertWindSensorRow(el));
      });
    else if (el.sensorTye == 'leafs')
      _.map(el.tableRows, (el) => {
        dataSource.push(this.convertLeafsSensorRow(el));
      });
    else
      _.map(el.tableRows, (el) => {
        dataSource.push(this.convertSensorsRow(el));
      });
    this.dataSource.push(dataSource);
    this.updateTime = el.updateDateTime
      ? new Date(el.updateDateTime).toLocaleString()
      : '-';
  }

  convertLeafsSensorRow(el: ISensorsRow): ISensorsRow {
    return {
      ...el,
      name: el.name + ' (' + el.code + ')',
      last: parseFloat(((el.last * 100) / 30).toFixed(1)),
      max: parseFloat(((el.max * 100) / 30).toFixed(1)),
      min: parseFloat(((el.min * 100) / 30).toFixed(1)),
    };
  }

  convertWindSensorRow(el: ISensorsRow): ISensorsRow {
    return {
      ...el,
      name: el.name + ' (' + el.code + ')',
      last: parseFloat(el.last.toFixed(1)),
      max: parseFloat(el.max.toFixed(1)),
      min: parseFloat(el.min.toFixed(1)),
    };
  }

  convertSensorsRow(el: ISensorsRow): ISensorsRow {
    return {
      ...el,
      name: el.name + ' (' + el.code + ')',
      last: parseFloat(el.last.toFixed(2)),
      max: parseFloat(el.max.toFixed(2)),
      min: parseFloat(el.min.toFixed(2)),
    };
  }

  formatDate(date: string, callee: string): string {
    let dateObject = new Date(date);

    if (callee == 'summaryTable') {
      // let HH =
      //   dateObject.getHours() < 10
      //     ? 0 + dateObject.getHours().toString()
      //     : dateObject.getHours().toString();
      // let mm =
      //   dateObject.getMinutes() < 10
      //     ? 0 + dateObject.getMinutes().toString()
      //     : dateObject.getMinutes().toString();

      // return '[' + HH + ':' + mm + ']';

      return formatDate(dateObject, '[HH:mm]', this.localeId);
    }

    if (callee == 'alertzonesTable') {
      // let DD =
      //   dateObject.getDay() < 10
      //     ? 0 + dateObject.getDay().toString()
      //     : dateObject.getDay().toString();

      // let MM =
      //   dateObject.getMonth() < 10
      //     ? 0 + dateObject.getMonth().toString()
      //     : dateObject.getMonth().toString();

      // let YYYY = dateObject.getFullYear().toString();

      // let HH =
      //   dateObject.getHours() + 2 < 10
      //     ? 0 + (dateObject.getHours() + 2).toString()
      //     : (dateObject.getHours() + 2).toString();
      // let mm =
      //   dateObject.getMinutes() < 10
      //     ? 0 + dateObject.getMinutes().toString()
      //     : dateObject.getMinutes().toString();

      // return DD + '/' + MM + '/' + YYYY + ' ' + HH + ':' + mm;
      return formatDate(dateObject, 'dd/MM/yyyy HH:mm', this.localeId);
    }
    return '';
  }

  resetForms() {
    this.areaControl.setValue(null);
    this.basinControl.setValue(null);
    this.codeControl.setValue(null);
    this.districtControl.setValue(null);
    this.municipalityControl.setValue(null);
    this.nameControl.setValue(null);
    this.underbasinControl.setValue(null);
    this.modelsBasinControl.setValue(null);
    this.modelsSectionControl.setValue(null);
    this.isFiltered = false;
  }

  // ----------------------------------------------------------------------------- //

  // filters on sensorstable ----------------------------------------------------- //
  filter() {
    if (
      !this.areaControl.value &&
      !this.basinControl.value &&
      !this.codeControl.value &&
      !this.districtControl.value &&
      !this.municipalityControl.value &&
      !this.nameControl.value &&
      !this.underbasinControl.value &&
      !this.modelsBasinControl.value &&
      !this.modelsSectionControl.value
    )
      return;

    let filterList: FormControl[] = [
      this.areaControl,
      this.basinControl,
      this.codeControl,
      this.districtControl,
      this.municipalityControl,
      this.nameControl,
      this.underbasinControl,
      this.modelsBasinControl,
      this.modelsSectionControl,
    ];

    let result: ISensorsRow[] | IModelsResponse[] = [];

    let filledFilters: FormControl[] = [];

    _.map(filterList, (filter) => {
      if (filter.value) filledFilters.push(filter);
    });

    _.filter(this.dataSource[0], (e) => {
      let isOkay: boolean[] = [];
      _.map(filledFilters, (filter) => {
        switch (filter) {
          case this.areaControl: {
            if (
              e.area &&
              e.area.toUpperCase().includes(filter.value.toUpperCase())
            )
              isOkay.push(true);
            else isOkay.push(false);
            break;
          }
          case this.basinControl: {
            if (
              e.basin &&
              e.basin.toUpperCase().includes(filter.value.toUpperCase())
            )
              isOkay.push(true);
            else isOkay.push(false);
            break;
          }
          case this.codeControl: {
            if (
              e.code &&
              e.code.toUpperCase().includes(filter.value.toUpperCase())
            )
              isOkay.push(true);
            else isOkay.push(false);
            break;
          }
          case this.districtControl: {
            if (
              e.district &&
              e.district.toUpperCase().includes(filter.value.toUpperCase())
            )
              isOkay.push(true);
            else isOkay.push(false);
            break;
          }
          case this.municipalityControl: {
            if (
              e.municipality &&
              e.municipality.toUpperCase().includes(filter.value.toUpperCase())
            )
              isOkay.push(true);
            else isOkay.push(false);
            break;
          }
          case this.nameControl: {
            if (
              e.name &&
              e.name.toUpperCase().includes(filter.value.toUpperCase())
            )
              isOkay.push(true);
            else isOkay.push(false);
            break;
          }
          case this.underbasinControl: {
            if (
              e.underbasin &&
              e.underbasin.toUpperCase().includes(filter.value.toUpperCase())
            )
              isOkay.push(true);
            else isOkay.push(false);
            break;
          }
          case this.modelsBasinControl: {
            if (
              e.basinName &&
              e.basinName.toUpperCase().includes(filter.value.toUpperCase())
            )
              isOkay.push(true);
            else isOkay.push(false);
            break;
          }
          case this.modelsSectionControl: {
            let isOkayTMP: boolean[] = [];
            _.forEach(e.sectionBasinsCodes, (el) => {
              if (el.sectionName)
                if (
                  el.sectionName
                    .toUpperCase()
                    .includes(filter.value.toUpperCase())
                )
                  isOkayTMP.push(true);
                else isOkayTMP.push(false);
            });
            if (isOkayTMP.includes(true)) isOkay.push(true);
            else isOkay.push(false);
            break;
          }
        }
      });
      if (!isOkay.includes(false)) result.push(e);
    });
    this.isFiltered = true;
    this.dataSource[0] = result;
  }

  async cleanFilters() {
    this.getDataSource();
    this.isFiltered = false;
  }
  // ----------------------------------------------------------------------------- //

  // click ----------------------------------------------------------------------- //
  stationCodeFromColumn(el: IMaxRow, col: string): string {
    switch (col) {
      case 'm5':
        return el.m5code;
      case 'm15':
        return el.m15code;
      case 'm30':
        return el.m30code;
      case 'h1':
        return el.h1code;
      case 'h3':
        return el.h3code;
      case 'h6':
        return el.h6code;
      case 'h12':
        return el.h12code;
      case 'h24':
        return el.h24code;
      default:
        return '';
    }
  }

  openChartByCode(
    code: string,
    sensor: string,
    municipality?: string,
    name?: string
  ) {
    if (sensor == '' && municipality && name) {
      let data = {
        sensorType: this.selectedSensorCode,
        municipality: municipality,
        shortCode: code,
        name: name,
      };
      this.dialog.open(ChartPopupComponent, {
        hasBackdrop: false,
        data: data,
      });
    } else
      this.tablesService.getStationISensorByCode(code).subscribe((data) => {
        data.sensorType = sensor;
        this.dialog.open(ChartPopupComponent, {
          hasBackdrop: false,
          data: data,
        });
      });
  }

  openChartByStation(station: string, sensor: string) {
    this.tablesService.getStationISensorByName(station).subscribe((data) => {
      data.sensorType = sensor;
      this.dialog.open(ChartPopupComponent, { hasBackdrop: false, data: data });
    });
  }
  // ----------------------------------------------------------------------------- //

  // menu ------------------------------------------------------------------------ //

  toggleRailTablesMenu = () => {
    this.isTablesMenuRail = !this.isTablesMenuRail;
    if (this.isTablesMenuRail) this.menuStatus = 1;
    else this.menuStatus = 2;
  };

  onTablesMenuItemClicked(node: TablesMenuNode) {
    console.log('caught layermenuitem clicked event on node: %o', node);
    let params = this.route.snapshot.params;

    let selectedTime = this.session.getSelectedDateTimeCookie();

    let refTime = '';
    if (selectedTime && selectedTime.getTime()) {
      refTime = selectedTime.getTime() + '';
    }

    this.router.navigateByUrl('/tabelle' + node.location + '/' + refTime);
  }

  // ----------------------------------------------------------------------------- //

  // layout ---------------------------------------------------------------------- //
  classFromColumn(el: IMaxRow, col: string): string {
    switch (col) {
      case 'm5':
        return el.m5BkColor;
      case 'm15':
        return el.m15BkColor;
      case 'm30':
        return el.m30BkColor;
      case 'h1':
        return el.h1BkColor;
      case 'h3':
        return el.h3BkColor;
      case 'h6':
        return el.h6BkColor;
      case 'h12':
        return el.h12BkColor;
      case 'h24':
        return el.h24BkColor;
      default:
        return '';
    }
  }

  classFromColor(color: number, table: string): string {
    if (table === 'modelstable')
      switch (color) {
        case 0:
          return 'modelstable bg0';
        case 1:
          return 'modelstable bg1';
        case 2:
          return 'modelstable bg2';
        case 3:
          return 'modelstable bg3';
        default:
          return 'modelstable';
      }
    return '';
  }
  // ----------------------------------------------------------------------------- //

  // dateTime -------------------------------------------------------------------- //
  // cleanDate() {
  //   this.dateControl.setValue(null);
  // }
  // cleanTime() {
  //   this.timeControl.setValue(null);
  // }
  // ----------------------------------------------------------------------------- //

  // ---------------------------------------------------------------------------------------- //

  // TODO : Remove, use service instead

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
