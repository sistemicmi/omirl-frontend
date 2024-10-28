import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SessionService } from './services/session.service';
import { interval } from 'rxjs';
import { MapService } from './services/map.service';
import { ConstantsService } from './services/constants.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  title = 'omirl';

  @Output() sidenavLayoutToggle = new EventEmitter<boolean>();
  constructor(
    private sessionService: SessionService,
    private mapService: MapService,
    private constantsService: ConstantsService
  ) {
    interval(2000 * 60).subscribe((x) => {
      this.sessionService.checkSession();
      console.log('did it');
    });
  }

  ngOnInit() {
    if (this.constantsService.logged) this.mapService.applyUserConfig();
  }
  openMenu = false;
  clickMenu() {
    this.openMenu = !this.openMenu;
    this.sidenavLayoutToggle.emit(this.openMenu);
  }
}
