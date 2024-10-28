import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.less'],
})
export class GuideComponent implements OnInit {
  src = 'assets/GUIDA_OMIRL.pdf';

  constructor() {}

  ngOnInit(): void {}

  zoom = 1.0;

  incrementZoom(amount: number) {
    this.zoom += amount;
  }
}
