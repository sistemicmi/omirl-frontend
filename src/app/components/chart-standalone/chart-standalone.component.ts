import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartService } from 'src/app/services/chart.service';
import { ConstantsService } from 'src/app/services/constants.service';

@Component({
  selector: 'app-chart-standalone',
  templateUrl: './chart-standalone.component.html',
  styleUrls: ['./chart-standalone.component.less']
})
export class ChartStandaloneComponent implements OnInit {

  chartData: any
  selectedSensorCode: string | null;
  selectedStationCode: string | null;

  constructor(
    private constantsService:ConstantsService, 
    private chartService:ChartService, 
    private route:ActivatedRoute) {
      
      const routeParams = this.route.snapshot.paramMap;
      this.selectedStationCode = routeParams.get('stationCode');
      this.selectedSensorCode = routeParams.get('sensorCode');
    }

  ngOnInit(): void {
    
    //get chart data from web service
    if (this.selectedSensorCode && this.selectedStationCode) {
      this.chartService.getStationChart(this.selectedStationCode, this.selectedSensorCode).subscribe(chartData => {

        this.chartData = chartData
      })
    }
  }

}
