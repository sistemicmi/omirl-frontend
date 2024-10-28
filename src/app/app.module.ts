import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { HeaderHomeComponent } from './components/header-home/header-home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MaterialModule } from './material/material.module';
import { MainmenuComponent } from './components/mainmenu/mainmenu.component';
import { FooterHomeComponent } from './components/footer-home/footer-home.component';
import { MapComponent } from './components/map/map.component';
import { LayerMenuComponent } from './components/layer-menu/layer-menu.component';
import { MatTreeModule } from '@angular/material/tree';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { StationPopupComponent } from './components/station-popup/station-popup.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChartPopupComponent } from './components/chart-popup/chart-popup.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { TablesComponent } from './components/tables/tables.component';
import { MatTableModule } from '@angular/material/table';
import { TablesMenuComponent } from './components/tables-menu/tables-menu.component';
import { ChartComponent } from './components/chart/chart.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { SensorsBarComponent } from './components/sensors-bar/sensors-bar.component';
import { OmirlsiteComponent } from './components/omirlsite/omirlsite.component';
import { ChartStandaloneComponent } from './components/chart-standalone/chart-standalone.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { SatelliteRadarComponent } from './components/satellite-radar/satellite-radar.component';
import { SatelliteRadarMenuComponent } from './components/satellite-radar-menu/satellite-radar-menu.component';
import { VisualizationMenuComponent } from './components/visualization-menu/visualization-menu.component';
import { MatMenuTriggerForDirective } from './directives/mat-menu-trigger-for.directive';
import { BottomVisualizationMenuComponent } from './components/bottom-visualization-menu/bottom-visualization-menu.component';
import { DateTimePickerComponent } from './components/date-time-picker/date-time-picker.component';
import { Platform } from '@angular/cdk/platform';
import { FormatDateAdapterModule } from './modules/format-date-adapter/format-date-adapter.module';
import { SettingsComponent } from './components/settings/settings.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ModelsGalleryComponent } from './components/models-gallery/models-gallery.component';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { ModelsGalleryMenuComponent } from './components/models-gallery-menu/models-gallery-menu.component';
import { StationhydroPopupComponent } from './components/stationhydro-popup/stationhydro-popup.component';
import { ChartHydroPopupComponent } from './components/chart-hydro-popup/chart-hydro-popup.component';
import { AngularImageViewerModule } from '@hreimer/angular-image-viewer';
import { PeriodsComponent } from './components/periods/periods.component';
import { GuideComponent } from './components/guide/guide.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SensorsHydroBarComponent } from './components/sensors-hydro-bar/sensors-hydro-bar.component';
import { WebcamPopupComponent } from './components/webcam-popup/webcam-popup.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SessionService } from './services/session.service';

export function sessionServiceFactory(
  sessionService: SessionService
): Function {
  return () => {
    return sessionService.checkSession();
  }; // => required, otherwise `this` won't work inside SessionService::load
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderHomeComponent,
    SidenavComponent,
    MainmenuComponent,
    FooterHomeComponent,
    MapComponent,
    LayerMenuComponent,
    StationPopupComponent,
    ChartPopupComponent,
    ErrorDialogComponent,
    TablesComponent,
    TablesMenuComponent,
    ChartComponent,
    SensorsBarComponent,
    OmirlsiteComponent,
    ChartStandaloneComponent,
    SatelliteRadarComponent,
    SatelliteRadarMenuComponent,
    VisualizationMenuComponent,
    MatMenuTriggerForDirective,
    BottomVisualizationMenuComponent,
    DateTimePickerComponent,
    SettingsComponent,
    ModelsGalleryComponent,
    ModelsGalleryMenuComponent,
    StationhydroPopupComponent,
    ChartHydroPopupComponent,
    PeriodsComponent,
    GuideComponent,
    SensorsHydroBarComponent,
    WebcamPopupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    MatTreeModule,
    HttpClientModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    DragDropModule,
    MatTableModule,
    HighchartsChartModule,
    NgxMaterialTimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatBottomSheetModule,
    MatSortModule,
    MatExpansionModule,
    MatSlideToggleModule,
    NgxGalleryModule,
    FormsModule,
    AngularImageViewerModule,
    PdfViewerModule,
    MatSelectModule,
    MatSliderModule,
    MatTooltipModule,
  ],
  exports: [DragDropModule, MatMenuTriggerForDirective],
  providers: [
    {
      provide: DateAdapter,
      useClass: FormatDateAdapterModule,
      deps: [MAT_DATE_LOCALE, Platform],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: sessionServiceFactory,
      deps: [SessionService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
