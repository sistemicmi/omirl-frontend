import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';
import { filter, includes } from 'lodash';
import { ConstantsService } from 'src/app/services/constants.service';
import { IconService } from 'src/app/services/icon.service';
import { ISensor } from 'src/app/services/map-navigator.service';
import { TranslationService } from 'src/app/services/translation.service';


@Component({
  selector: 'sensors-bar',
  templateUrl: './sensors-bar.component.html',
  styleUrls: ['./sensors-bar.component.less']
})
export class SensorsBarComponent implements OnInit {

  @Input() chartList: string[] = [];
  @Input() sensorsData: ISensor[] = [];
  @Input() selectedSensorType: string = "";

  @Output() sensorClicked = new EventEmitter<string>();

  sensors: ISensor[] = [];

  constructor(public icons: IconService, private sanitizer: DomSanitizer, public constants: ConstantsService, public translate: TranslationService){
    // constants.sensors.subscribe((sensorList) => {
    //   this.sensors = sensorList
    // })
  }

  ngOnInit(): void {
    
  } 

  ngOnChanges(changes: SimpleChanges){
      if (changes.chartList && changes.chartList.currentValue) {
        this.sensors = this.getSensorsListByNames(this.sensorsData, this.chartList);
      }
  }

  getSensorsListByNames(availableSensors: ISensor[], sensorsToFind: string[]) {
    return _.filter(availableSensors, sensor => {

        //if(this.chartList.indexOf(sensor)!=-1) {

        let foundSensor: string | undefined = _.find(sensorsToFind, (sensorToFind) => {
          return sensor.code == sensorToFind
        })
        return foundSensor
    }) as ISensor[]
  }

  onSensorClick = (sensorCode: string) => {
    this.sensorClicked.emit(sensorCode)
  }

  // registerSvgIcon = (iconFileName:string, iconName?:string) : string => {
  //   if (!iconName) {
  //     //remove extension from filename
  //     iconName = iconFileName.replace(/\.[^/.]+$/, "")
  //   }
  //   this.iconRegistry.addSvgIcon(iconName, this.sanitizer.bypassSecurityTrustResourceUrl('../../assets/img/layout-menu-icons/' + iconName + ".svg"))
  //   return iconName
  // }
  }


