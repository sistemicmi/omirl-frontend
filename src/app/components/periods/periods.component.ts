import { Component, OnInit } from '@angular/core';
import { ConstantsService } from '../../services/constants.service';
import { IPeriod, PeriodsService } from '../../services/periods.service';

@Component({
  selector: 'app-periods',
  templateUrl: './periods.component.html',
  styleUrls: ['./periods.component.less'],
})
export class PeriodsComponent implements OnInit {
  constructor(
    private constantsService: ConstantsService,
    private periodsService: PeriodsService
  ) {}

  ngOnInit(): void {
    this.periodsService.getPeriods().subscribe((periods) => {
      this.periods = periods;
    });
  }

  periods: IPeriod[] = [];

  isLogged(): boolean {
    if (this.constantsService.logged) return this.constantsService.logged;
    return false;
  }
}
