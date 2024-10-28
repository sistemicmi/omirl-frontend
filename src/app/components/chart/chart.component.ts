import {
  Component,
  Inject,
  Input,
  LOCALE_ID,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import HC_windbarb from 'highcharts/modules/windbarb';
// import HC_datagrouping from 'highcharts/modules/datagrouping';
import * as _ from 'lodash';
import { TranslationService } from 'src/app/services/translation.service';
import { SessionService } from 'src/app/services/session.service';
import { DatePipe, formatDate } from '@angular/common';

@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.less'],
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() chartData!: any;
  highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  chartType: string = 'stockChart';

  chartUpdateFlag: boolean = false;

  constructor(
    private translation: TranslationService,
    private session: SessionService,
    @Inject(LOCALE_ID) protected localeId: string
  ) {}

  ngOnInit(): void {
    HC_windbarb(this.highcharts);
    //HC_datagrouping(this.highcharts)
  }

  ngOnChanges(changes: SimpleChanges): void {
    const that = this;
    this.chartOptions = {};

    this.chartOptions.legend = {
      enabled: true,
    };

    if (this.chartOptions.series) {
      this.chartOptions.series.length = 0;
    }

    this.chartOptions.chart = {
      alignThresholds: true as any,
    };

    //get timezone offset of current reference date (may be different based on period of year, due to daylight saving offset)
    const timezone = new Date(this.getReferenceDate()).getTimezoneOffset();

    const getNormalizedDirection = (val: number) => {
      return val && val < 0 ? val + 360 : val;
    };

    this.highcharts.setOptions({
      time: { timezoneOffset: timezone },
      lang: {
        months: [
          'Gennaio',
          'Febbraio',
          'Marzo',
          'Aprile',
          'Maggio',
          'Giugno',
          'Luglio',
          'Agosto',
          'Settembre',
          'Ottobre',
          'Novembre',
          'Dicembre',
        ],
        shortMonths: [
          'Gen',
          'Feb',
          'Mar',
          'Apr',
          'Mag',
          'Giu',
          'Lug',
          'Ago',
          'Set',
          'Ott',
          'Nov',
          'Dic',
        ],
        weekdays: [
          'Domenica',
          'Lunedì',
          'Martedì',
          'Mercoledì',
          'Giovedì',
          'Venerdì',
          'Sabato',
        ],
      },
    });

    //#region chartoptions

    this.chartOptions.navigator = {
      enabled: !this.isRainChart(),
    };

    this.chartOptions.rangeSelector = {
      enabled: !this.isRainChart(),
      buttons: [
        {
          type: 'day',
          count: 1,
          text: '1g',
        },
        {
          type: 'day',
          count: 3,
          text: '3gg',
        },
        {
          type: 'day',
          count: 7,
          text: '7gg',
        },
        {
          type: 'day',
          count: 14,
          text: '14gg',
        },
        {
          type: 'day',
          count: 30,
          text: '30gg',
        },
      ],
    };

    this.chartOptions.tooltip = {
      split: false, //since highstock v6, split is true by default and overrides shared.
      shared: true,
    };

    if (this.chartData && this.chartData.tooltipValueSuffix) {
      const that = this;

      this.chartOptions.tooltip = {
        ...this.chartOptions.tooltip,

        formatter: function () {
          if (
            that.chartData.sensorType == 'Vento' &&
            this.points &&
            this.points.length >= 1 &&
            this.points.length < 3 &&
            !_.map(this.points, 'series.name').includes('Wind Direction')
          ) {
            // keep in order to deep copy (otherwise a pointer will be pushed)
            this.points.push(_.cloneDeep(this.points[0]));

            // set correct infos
            this.points[this.points.length - 1].series.name = 'Wind Direction';
            this.points[this.points.length - 1].color = '';
            this.points[this.points.length - 1].series.options.tooltip = {
              valueSuffix: ' °',
            } as any;

            // add wind direction
            (this.points[this.points.length - 1].point as any).direction =
              // if there's a non-0-value between "velocità" or "raffica" we add also wind direction
              this.points[0].y && this.points[0].y > 0
                ? _.get(
                    _.findLast(
                      that.chartData.dataSeries[
                        that.chartData.dataSeries.length - 1
                      ].data,
                      (pt) =>
                        this.points && pt[0] <= this.points[0].point.x && pt[1]
                    ),
                    1
                  )
                : // else we add nullish value
                  null;
          }

          return this.points?.reduce(function (acc, point) {
            let value;
            if (point.series.name == 'Wind Direction')
              value =
                // if there's a valid value we normalize it bu calling "getNormalizedDirection"
                (point.point as any).direction
                  ? getNormalizedDirection((point.point as any).direction) || 0
                  : // else we keep a nullish value in order to propagate error
                    null;
            else value = point.y || 0;

            const valueDecimals = that.chartOptions.tooltip?.valueDecimals,
              valueSuffix =
                point.series?.options?.tooltip?.valueSuffix ||
                that.chartOptions.tooltip?.valueSuffix;

            return (
              acc +
              '<br/>' +
              '<span style="color:' +
              point.color +
              '"' +
              '>' +
              (point.series.name != 'Wind Direction'
                ? point.series.name
                : 'Direzione del Vento') +
              '</span>' +
              ': ' +
              (value
                ? value.toFixed(valueDecimals) + valueSuffix
                : // if value is nullish & we are in Wind direction's serie we show 'calma'
                !value && point.series.name == 'Wind Direction'
                ? 'calma'
                : '0' + valueSuffix)
            );
          }, '<b>' +
            formatDate(
              this.x ? this.x : '',
              'dd/MM/yyyy HH:mm',
              that.localeId
            ) +
            '</b>');
        },
        /*
        pointFormat:
          '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}{point.direction}</b> ',
        */
        valueDecimals: this.chartData.sensorType == 'Vento' ? 1 : 2,
        valueSuffix: this.chartData.tooltipValueSuffix,
      };
    }

    this.chartOptions.yAxis = {
      id: '0',
      alternateGridColor: 'rgba(0, 144, 201, 0.1)',
      gridLineColor: '#c0c0c0',
      gridLineWidth: 2,
      minorGridLineColor: '#c0c0c0',
      minorGridLineWidth: 1,
      startOnTick: true,
    };

    this.chartOptions.xAxis = {
      gridLineColor: '#c0c0c0',
      gridLineWidth: 2,
      minorGridLineColor: '#c0c0c0',
      minorGridLineWidth: 1,
      minorTickInterval: 'auto',
      labels: {
        formatter: function () {
          //console.log("value: ", this.value)
          var oDate = new Date(this.value);
          let label = '';
          if (oDate.getHours() == 0 && oDate.getMinutes() == 0) {
            label =
              '<b>' + Highcharts.dateFormat('%d %b', oDate.getTime()) + '</b>';
          } else {
            label = Highcharts.dateFormat('%H:%M', oDate.getTime());
          }

          //console.log('label value: ', this.value, ' text: ', label, ' formatted: ', formatDate(oDate, 'd MMM', that.localeId), ' pos: ', this.pos)
          return label;
        },
      },
      type: 'datetime',
    };

    this.chartOptions.chart = {
      zoomType: 'xy',
      pinchType: 'xy',
    };

    //#end region chart options
    let lastValueTime = 0; //time of last data in series

    if (this.chartData) {
      this.chartType = 'stockChart';

      //modify thickness of horizontal lines
      for (const line of this.chartData.horizontalLines) {
        line.zIndex = 2;
        line.width = 3;
      }

      if (this.chartData.sensorType == 'Elio') {
        this.chartData.axisYMaxValue = 100;
      }

      // const tickPositions = [];
      // for (
      //   let i = -1, range = 0;
      //   range < this.chartData.axisYMaxValue + this.chartData.axisYTickInterval;
      //   i++
      // ) {
      //   range = i * this.chartData.axisYTickInterval;
      //   tickPositions.push(range);
      // }

      const getMaxWindValue = () => {
        let valuesToCompare = [] as number[];

        [0, 1].forEach((index) => {
          if (this.chartData.dataSeries[index])
            valuesToCompare = valuesToCompare.concat(
              _.map(this.chartData.dataSeries[index].data, '1')
            );
        });

        return Math.max(...valuesToCompare);
      };

      this.chartOptions.yAxis = [
        {
          ...this.chartOptions.yAxis,
          min:
            this.chartData.axisYMinValue -
            (this.chartData.sensorType == 'Elio'
              ? 10
              : this.chartData.axisYTickInterval) /
              2,
          max:
            (this.chartData.sensorType == 'Vento'
              ? Math.max(getMaxWindValue(), this.chartData.axisYMaxValue)
              : this.chartData.axisYMaxValue) +
            this.chartData.axisYTickInterval / 2,
          plotLines: this.chartData.horizontalLines,
          tickInterval: this.chartData.axisYTickInterval,
          // COMMENT tickPositions in order to let component zoom on y-axis
          //tickPositions: tickPositions,
          //tickPositioner allows zoom y even with custom tick positions
          /*tickPositioner: function () {
            var positions = [],
              tick = /!*Math.floor*!/ this.min || 0,
              increment = !['Elio'].includes(that.chartData.sensorType)
                ? that.chartData.axisYTickInterval
                : 10;

            if (this.max !== null && this.min !== null) {
              // positions.push(that.chartData.axisYMinValue - increment / 2);
              // positions.push(0);
              for (tick; tick - increment < this.max; tick += increment) {
                positions.push(tick);
                if (tick < 0 && tick + increment > 0) positions.push(0);
              }
              positions.push(tick + increment / 2);
            }
            return positions;
          },*/
          title: {
            text: this.translation.menuTranslations[this.chartData.axisYTitle],
            rotation: 270,
            margin: 0,
            //offset: 20
          },
          //offset:15,
          opposite: this.chartData.axisIsOpposite,
          startOnTick: false,
        },
      ];

      //#region additional y axis

      var iAxis = 0;

      // Add Additional Axes
      for (iAxis = 0; iAxis < this.chartData.verticalAxes.length; iAxis++) {
        var oAdditionalAxis = this.chartData.verticalAxes[iAxis];

        // const tickPositions = [];
        // for (
        //   let i = -1, range = 0;
        //   range <
        //   oAdditionalAxis.axisYMaxValue + oAdditionalAxis.axisYTickInterval;
        //   i++
        // ) {
        //   range = i * oAdditionalAxis.axisYTickInterval;
        //   tickPositions.push(range);
        // }

        (this.chartOptions.yAxis as Highcharts.YAxisOptions[]).push({
          id: iAxis + 1 + '',
          title: {
            text: this.translation.menuTranslations[oAdditionalAxis.axisYTitle],
            rotation: 270,
            //margin: 0
          },
          opposite: oAdditionalAxis.isOpposite,
          min:
            oAdditionalAxis.axisYMinValue -
            oAdditionalAxis.axisYTickInterval / 2,
          max:
            oAdditionalAxis.axisYMaxValue +
            oAdditionalAxis.axisYTickInterval / 2,
          tickInterval: oAdditionalAxis.axisYTickInterval,
          //tickPositions: tickPositions,
          /*tickPositioner: function () {
            var positions = [],
              tick = /!*Math.floor*!/ this.min || 0,
              increment = !that.isRainChart()
                ? that.chartData.axisYTickInterval
                : 40;

            if (this.max !== null && this.min !== null) {
              //positions.push(oAdditionalAxis.axisYMinValue - increment / 2);
              //positions.push(0);
              for (tick; tick - increment <= this.max; tick += increment) {
                positions.push(tick);
                if (tick < 0 && tick + increment > 0) positions.push(0);
              }
              positions.push(tick + increment / 2);
            }
            console.log(positions);
            return positions;
          },*/
          //minPadding: 0,
          startOnTick: false,
        });

        //this.chartData.yAxis[iAxis+1].setExtremes(oAdditionalAxis.axisYMinValue,oAdditionalAxis.axisYMaxValue);
      }

      //#endregion additional y axes

      const colors = ['#3399ff', '#0000ff', '#ff3333', '#000000'];

      // this.chartOptions.title = {text: this.chartData.title}
      // this.chartOptions.subtitle = {text: this.chartData.subTitle}
      for (const [index, serie] of this.chartData.dataSeries.entries()) {
        const date = new Date().getTime();

        // serie.data = [[serie.data[0][0] - 3600000, -5], ...serie.data];
        serie.threshold = 0;

        serie.id = date + index;

        serie.color = colors[index];

        if (
          _.isArray(this.chartOptions.yAxis) &&
          this.chartOptions.yAxis.length > 1
        ) {
          serie.yAxis = index + '';
        }

        serie.dataGrouping = {
          ...serie.dataGrouping,
          enabled: false,
        };

        if (serie.name == 'Wind Direction') {
          //this.chartType = 'chart'
          serie.color = '#000000';
          this.chartType = 'stockChart';
          this.chartOptions = {
            ...this.chartOptions,
            chart: {
              ...this.chartOptions.chart,
              //type: 'chart'
              type: 'stockChart',
            },
          };

          this.chartOptions.xAxis = {
            ...this.chartOptions.xAxis,
            type: 'datetime',
            offset: 40,
          };

          (this.chartOptions.yAxis as Highcharts.YAxisOptions[])[0] = {
            ...(this.chartOptions.yAxis as Highcharts.YAxisOptions[])[0],
            labels: {
              x: -15,
            },
          };

          serie.type = 'windbarb';
          serie.keys = ['x', 'direction', 'value'];
          serie.dataGrouping = {
            ...serie.dataGrouping,
            //enabled: true,
          };
          serie.tooltip = {
            valueSuffix: ' °',
          };

          //convert km/h to m/s
          //clone to prevent affecting the original series data
          let cloneOfSpeedSeries = _.cloneDeep(
            this.chartData.dataSeries[0].data
          );

          let windSpeed = _.map(cloneOfSpeedSeries, (sample) => {
            sample[1] = (sample[1] * 1000) / 3600;
            return sample;
          });

          // for (var cntDir=0, dirLen=serie.data.length, cntSpeed=0, speedLen=windSpeed.length; cntDir < dirLen; cntDir++ ) {

          //   while (windSpeed[cntSpeed][0] < serie.data[cntDir][0] && cntSpeed<speedLen) {
          //     windSpeed[cntSpeed][2] = serie.data[cntDir][1]
          //     windSpeed[cntSpeed][1] = windSpeed[cntSpeed][1]*0.539957  //km/h to knots
          //     cntSpeed++
          //   }
          // }

          // serie.data = windSpeed

          //populate wind direction seris with average speed data.
          //for each direction sample, the average speed is the average of speed samples in time between previous and current direction sample.
          for (
            var cntDir = 0,
              dirLen = serie.data.length,
              cntSpeed = 0,
              speedLen = windSpeed.length;
            cntDir < dirLen;
            cntDir++
          ) {
            let samplesCount = 0;
            let speedsSum = 0;
            let lastSpeedValue = 0;
            //calculate average speed between two direction samples
            while (
              windSpeed[cntSpeed][0] < serie.data[cntDir][0] &&
              cntSpeed < speedLen
            ) {
              speedsSum += windSpeed[cntSpeed][1];
              lastSpeedValue = windSpeed[cntSpeed][1];
              samplesCount++;
              cntSpeed++;
            }

            //set calculated average speed for current direction sample /* NO! unit is m/s */ and convert to knots
            //serie.data[cntDir][2] = speedsSum /* * 0.539957 */ / samplesCount;

            //use exact value instead of average wind speed
            serie.data[cntDir][2] = lastSpeedValue;
            //console.log('setting speed value of sample ' + cntDir + ' at ' + serie.data[cntDir][0] + ':' + lastSpeedValue)
          }

          // _.each(serie.data, directionEntry => {

          //   let speedValues = _.find(windSpeed, speedEntry => { return speedEntry[0] == directionEntry[0]})

          //   if (speedValues) {
          //     directionEntry[2] = _.clone(speedValues[1])
          //   }

          // })
        } else {
          if (serie.name == 'Eliofania') {
            serie.tooltip = {
              valueSuffix: '%',
            };
          }

          if (serie.type == null) {
            serie.type = 'line';
            serie.keys = ['x', 'y'];
          } else {
            serie.keys = ['x', 'y'];
          }
        }

        if (this.chartData.sensorType == 'Elio') {
          if (this.chartOptions && this.chartOptions.yAxis) {
            (this.chartOptions.yAxis as Highcharts.YAxisOptions[])[0] = {
              ...(this.chartOptions.yAxis as Highcharts.YAxisOptions[])[0],
              max: 105,
              tickInterval: 10,
            };
          }

          serie.data = _.map(serie.data, (dataItem) => {
            return [dataItem[0], (dataItem[1] * 100) / 30];
          });
        }

        if (this.chartData.sensorType == 'Foglie') {
          serie.data = _.map(serie.data, (dataItem) => {
            return [dataItem[0], (dataItem[1] * 100) / 30];
          });
        }

        if (this.chartData.sensorType == 'Pluvio' || serie.type == 'column') {
          this.chartOptions.plotOptions = {
            ...this.chartOptions.plotOptions,
            column: {
              pointPadding: 0,
              pointPlacement: -0.5,
              groupPadding: 0,
              borderWidth: 0,
              shadow: false,
            },
          };
        }

        //search last value != null
        for (
          var iCount = this.chartData.dataSeries[0].data.length - 1;
          iCount >= 0;
          iCount--
        ) {
          if (this.chartData.dataSeries[0].data[iCount][1] != null) {
            lastValueTime = this.chartData.dataSeries[0].data[iCount][0];
            break;
          }
        }
        // X AXIS
        this.chartOptions.xAxis = {
          ...this.chartOptions.xAxis,
          plotBands: [
            {
              color: 'rgba(255, 208, 0, 0.3)', // Color value
              from: this.getReferenceDate().getTime(), // Start of the plot band
              to: lastValueTime, // End of the plot band
              zIndex: 4,
            },
          ],
          plotLines: [
            {
              color: 'rgba(69, 163, 202, 1)', // Color value
              dashStyle: 'Solid', // Style of the plot line. Default to solid
              value: this.getReferenceDate().getTime(), // Value of where the line will appear
              width: 2, // Width of the line
              zIndex: 4,
            },
          ],
        };

        //console.log('serie ', serie.name, ': ', serie);
      }

      //set chart selected range
      let maxDate = this.getReferenceDate().getTime() + 12 * 60 * 60 * 1000;

      //set a default for start of dates range
      // let minDate = Math.max(maxDate - (3*24)*60*60*1000, this.chartData.dataSeries[0].data[0][0])

      let minDate = this.chartData.dataSeries[0].data[0][0];

      //set specific range for some sensor types
      if (
        this.chartData.sensorType == 'Pluvio' ||
        this.chartData.sensorType == 'PluvioNative'
      ) {
        //this.chartOptions.rangeSelector!.enabled = false
        maxDate = this.getReferenceDate().getTime() + 2 * 60 * 60 * 1000;
        //minDate = maxDate - (3*24)*60*60*1000
      }

      this.chartOptions.series = this.chartData.dataSeries;

      this.chartOptions.xAxis = [
        {
          ...this.chartOptions.xAxis,
          min: minDate,
          max: maxDate,
          endOnTick: true,
          ordinal: false,
          range: this.calculateRange(),
        },
      ];

      //tells the highcharts component to redraw

      this.chartUpdateFlag = true;
    }
  }

  getReferenceDate = (): Date => {
    if (!this.session.getSelectedDateTimeCookie()) {
      return new Date();
    } else {
      //result is never null here
      return this.session.getSelectedDateTimeCookie()!;
    }
  };

  calculateRange = (): number => {
    switch (this.chartData.sensorType) {
      case 'PluvioNative':
        return 24 * 60 * 60 * 1000;
      case 'Pluvio7':
        return 7 * 24 * 60 * 60 * 1000;
      case 'Pluvio30':
        return 30 * 24 * 60 * 60 * 1000;
      default:
        return 3 * 24 * 60 * 60 * 1000;
    }
  };

  isRainChart = (): boolean => {
    return ['Pluvio', 'PluvioNative', 'Pluvio7', 'Pluvio30'].includes(
      this.chartData?.sensorType
    );
  };
}
