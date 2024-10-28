import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { filter, includes } from 'lodash';
import { ConstantsService } from 'src/app/services/constants.service';
import { IconService } from 'src/app/services/icon.service';
import { IHydro, ISensor, MapNavigatorService } from 'src/app/services/map-navigator.service';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'sensors-hydro-bar',
  templateUrl: './sensors-hydro-bar.component.html',
  styleUrls: ['./sensors-hydro-bar.component.less']
})
export class SensorsHydroBarComponent implements OnInit {

  @Input() chartList: string[] = [];
  @Input() sensorsData: IHydro[] = [];
  @Input() selectedSensorType: string = "";

  @Output() sensorClicked = new EventEmitter<string>();

  sensors: IHydro[] | null = [];

  constructor(
    public icons: IconService,
    private sanitizer: DomSanitizer,
    public constants: ConstantsService,
    public translate: TranslationService,
    private mapNavService: MapNavigatorService) {

    this.sensors = mapNavService.hydroSensors
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
      if (changes.chartList && changes.chartList.currentValue) {
        this.sensors = this.getSensorsListByNames(this.sensorsData, this.chartList);
      }
  }

  getSensorsListByNames(availableSensors: IHydro[], sensorsToFind: string[]) {
    return _.filter(availableSensors, sensor => {

        //if(this.chartList.indexOf(sensor)!=-1) {

        let foundSensor: string | undefined = _.find(sensorsToFind, (sensorToFind) => {
          return sensor.linkCode == sensorToFind
        })
        return foundSensor
    }) as IHydro[]
  }

  onSensorClick = (sensorCode: string) => {
    this.sensorClicked.emit(sensorCode)
  }

}



