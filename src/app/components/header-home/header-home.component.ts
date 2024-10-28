import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { IconService } from 'src/app/services/icon.service';
import { SideNavService } from '../../side-nav.service';
@Component({
  selector: 'header-home',
  templateUrl: './header-home.component.html',
  styleUrls: ['./header-home.component.less']
})
export class HeaderHomeComponent implements OnInit {

  //@Output() public sidenavToggle = new EventEmitter();

  subscription!: Subscription;

  constructor(private sideNavService: SideNavService, public icons: IconService) {
    // this.subscription = sideNavService.menuClicked$.subscribe(event => {

    // })
    icons.registerSvgIconFromAssetsImg("menu.svg")
  }

  ngOnInit(): void {
  }

  public onToggleSidenav = () => { 
    this.sideNavService.toggleMenu(this);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    // this.subscription.unsubscribe();
  }

}
