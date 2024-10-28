import { Component, ViewChild, Input, AfterViewInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SideNavService } from '../../side-nav.service';
import { Router } from '@angular/router';

/** @title Drawer with explicit backdrop setting */
@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.less'],
  providers: [SideNavService],
})
export class SidenavComponent implements AfterViewInit {
  @ViewChild('sidenav')
  sidenav!: MatSidenav;
  isTables: boolean;

  @Input() sidenavLayout: any;
  constructor(private sideNavService: SideNavService, private router: Router) {
    this.isTables = this.router.url.startsWith('/tabelle');

    sideNavService.menuClicked$.subscribe((event) => {
      console.log('event handled in sidenav: %o', event);
      this.sidenav.toggle();
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {}
}
