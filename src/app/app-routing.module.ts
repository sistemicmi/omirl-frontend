import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ChartStandaloneComponent } from './components/chart-standalone/chart-standalone.component';
import { HomeComponent } from './components/home/home.component';
import { MapComponent } from './components/map/map.component';
import { OmirlsiteComponent } from './components/omirlsite/omirlsite.component';
//import { OmirlsiteComponent } from './components/omirlsite/omirlsite.component';
import { TablesComponent } from './components/tables/tables.component';
import { SatelliteRadarComponent } from './components/satellite-radar/satellite-radar.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ModelsGalleryComponent } from './components/models-gallery/models-gallery.component';
import { PeriodsComponent } from './components/periods/periods.component';
import { GuideComponent } from './components/guide/guide.component';

const routes: Routes = [
  //{path: 'home', component: HomeComponent },
  {
    path: 'chart',
    component: AppComponent,
    children: [
      { path: ':sensorCode/:stationCode', component: ChartStandaloneComponent },
    ],
  },
  //{ path: 'dati', component: MapComponent },
  {
    path: '',
    component: OmirlsiteComponent,
    children: [
      { path: 'dati', component: MapComponent },
      { path: 'dati/:sensorCode', component: MapComponent },
      //{ path: 'dati', redirectTo: 'dati/0' },
      { path: '', component: HomeComponent },
      { path: 'tabelle', component: TablesComponent },
      { path: 'tabelle/:id', component: TablesComponent },
      { path: 'tabelle/:id/:sensorCode', component: TablesComponent },
      { path: 'tabelle/:id/:sensorCode/:reftime', component: TablesComponent },
      {
        path: 'satellite-radar/:service/:area/:type/:format/:reftime',
        component: SatelliteRadarComponent,
      },
      {
        path: 'satellite-radar/:service/:area/:type/:format',
        component: SatelliteRadarComponent,
      },
      {
        path: 'satellite-radar',
        component: SatelliteRadarComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'models-gallery/:code/:reftime',
        component: ModelsGalleryComponent,
      },
      {
        path: 'models-gallery/:code',
        component: ModelsGalleryComponent,
      },
      {
        path: 'models-gallery',
        component: ModelsGalleryComponent,
      },
      {
        path: 'periods',
        component: PeriodsComponent,
      },
      {
        path: 'guide',
        component: GuideComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
