import { Component, OnInit } from '@angular/core';
import { ConstantsService } from 'src/app/services/constants.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'footer-home',
  templateUrl: './footer-home.component.html',
  styleUrls: ['./footer-home.component.less'],
})
export class FooterHomeComponent implements OnInit {
  constructor(public constants: ConstantsService, private router: Router) {}

  public visible = true;

  ngOnInit(): void {
    this.visible = !this.router.url.startsWith('/dati');
  }
}
