import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { interval } from 'rxjs';
import { SessionService } from '../../services/session.service';
import { ConstantsService } from '../../services/constants.service';
import { SideNavService } from 'src/app/side-nav.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.less'],
})
@Injectable({
  providedIn: 'root',
})
export class MainmenuComponent implements OnInit {
  // class-methods ---------------------------------------------------------- //
  constructor(
    private sessionService: SessionService,
    public constantsService: ConstantsService,
    public  sideNavService: SideNavService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {}
  // ----------------------------------------------------------------------- //

  // props ---------------------------------------------------------------------------------- //
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  hide = true;
  // ---------------------------------------------------------------------------------------- //

  // methods -------------------------------------------------------------------------------- //
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getUserName(): string {
    if (this.constantsService.sessionData)
      return this.constantsService.sessionData.name;
    return '';
  }

  isLogged(): boolean {
    if (this.constantsService.logged) return this.constantsService.logged;
    return false;
  }

  login() {
    if (
      (!this.email && !this.password) ||
      this.email.value === '' ||
      this.password.value === ''
    )
      return;

    let credentials = {
      userId: this.email.value,
      userPassword: this.password.value,
    };

    this.sessionService
      .login(credentials)
      .subscribe((logged) => {
        
        this.constantsService.logged = logged
      });
  }

  logout() {
    this.sessionService.logout();
    this.constantsService.logged = false;
  }
  // ---------------------------------------------------------------------------------------- //
}
