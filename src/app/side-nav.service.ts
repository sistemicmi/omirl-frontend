import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { MatSidenav } from '@angular/material/sidenav'

@Injectable({
  providedIn: 'root'
})
export class SideNavService {

  constructor() {}

  private menuClickedSource = new Subject<string>()

  menuClicked$ = this.menuClickedSource.asObservable()

  toggleMenu(event: any) {
    this.menuClickedSource.next(event);
  }

}
