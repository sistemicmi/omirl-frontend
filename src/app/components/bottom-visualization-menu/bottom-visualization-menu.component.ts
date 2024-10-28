import { Component, OnInit } from '@angular/core';

export type BottomVisMenuState = 'open' | 'closed'

@Component({
  selector: 'bottom-visualization-menu',
  templateUrl: './bottom-visualization-menu.component.html',
  styleUrls: ['./bottom-visualization-menu.component.less']
})
export class BottomVisualizationMenuComponent implements OnInit {

  state: BottomVisMenuState
  constructor() {
    this.state = 'closed'
  }

  ngOnInit(): void {
  }

  onHandleClick = (event: any) => {
    this.state = 'open'
  }

  closeBottomSheet = () => {
    this.state = 'closed'
  }

}
