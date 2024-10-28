import { NgModule } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { DateAdapter, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { Platform } from '@angular/cdk/platform';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: FormatDateAdapterModule,
      deps: [MAT_DATE_LOCALE, Platform]
    },
  ]
})
export class FormatDateAdapterModule extends NativeDateAdapter {

  dateFormat: string = 'dd/MM/YYYY'
  timezone: string = 'Europe/Rome'

  format(date: Date, displayFormat: any): string {
    return formatDate(date, this.dateFormat, this.locale, this.timezone)
  }
 }
