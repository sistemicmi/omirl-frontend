import { DatePipe, formatDate } from '@angular/common';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NativeDateAdapter } from '@angular/material/core/datetime';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import RenderFeature from 'ol/render/Feature';
import { FormatDateAdapterModule } from 'src/app/modules/format-date-adapter/format-date-adapter.module';

@Component({
  selector: 'date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.less']
})
export class DateTimePickerComponent implements OnInit {

  @Output() dateTimeChange = new EventEmitter<Date|null>()
  @Input() format: string = ''
  @Input() initialDateValue: Date | undefined | null

  dateControl = new FormControl(null)
  timeControl = new FormControl(null);

  constructor(@Inject( LOCALE_ID ) protected localeId: string) { 

  }

  ngOnInit(): void {

    this.dateControl.setValue(this.initialDateValue)
    
    if (this.initialDateValue) {
      
      this.timeControl.setValue(formatDate(this.initialDateValue, 'HH:mm', this.localeId))
    }

    this.dateControl.valueChanges.subscribe((e) => {

      this.onDateTimeChange();
    });

    this.timeControl.valueChanges.subscribe((e) => {

      this.onDateTimeChange();
    });
  }

  get selectedDateTime(): Date | undefined {

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
    if (this.dateControl.value && this.timeControl.value) {

      return new Date(this.dateControl.value && this.timeControl.value)
    }

    return undefined
  }

  cleanDate() {

    this.dateControl.setValue(null);
    this.timeControl.setValue(null);
  }
  cleanTime() {

    this.timeControl.setValue(null);
  }

  //emit date and time change event only if a valid date is selected
  onDateTimeChange() {
    
    let refDate = null
    if (this.dateControl.value) {

      refDate = this.dateControl.value
      console.log("Datetime changed in dttpicker component: ", formatDate(refDate, 'Z', this.localeId))

      let timeZoneString = formatDate(refDate, 'Z', this.localeId)

      if (this.timeControl.value) {

        let dateControlValueString = formatDate(refDate, 'yyyy-MM-dd', this.localeId)

        refDate = new Date(dateControlValueString + ' ' + this.timeControl.value + timeZoneString)
      }      
    }

    this.dateTimeChange.emit(refDate)
  }

}