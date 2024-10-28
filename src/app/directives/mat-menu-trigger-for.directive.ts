import { Directive, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatButtonToggle, MatButtonToggleChange } from '@angular/material/button-toggle';

@Directive({
  selector: '[visMenuTriggerFor]'
})
/**
 * 
 */
export class MatMenuTriggerForDirective implements OnInit, OnChanges {

  @Input() visMenuTriggerFor: any
  prevCheckedStatus: boolean = false
  constructor(private el: MatButtonToggle) {
      console.log('trigger element: ', this.visMenuTriggerFor)
      console.log('native element: ', el)
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('button change: ', this.el.name, ' changes: ', changes)
  }

  ngOnInit(): void {
    console.log('trigger element in init: ', this.visMenuTriggerFor)

    this.prevCheckedStatus = this.el.checked

    if (this.visMenuTriggerFor) {
      this.visMenuTriggerFor.style.display = 'none'
    }
    //console.log('component: ', this.component)
    console.log('native element: ', this.el)

    this.el.buttonToggleGroup.change.subscribe(change => {
      console.log('changed. this.el: ', this.el.id, " triggerfor: ", this.visMenuTriggerFor)

      //if (this.el.checked) {
      if (!this.prevCheckedStatus && this.el.checked) {
          console.log('is checked: ', this.el.checked)
          this.visMenuTriggerFor.style.display = "block"
      } else if (this.prevCheckedStatus && !this.el.checked) {
          console.log('is not checked: ', this.el.checked)
          this.visMenuTriggerFor.style.display = "none"
          this.prevCheckedStatus = false    
      }
    })

  } 

  @HostListener('click') onMouseClick() {
    console.log('click')
    if (!this.prevCheckedStatus) {
      this.visMenuTriggerFor.style.display = "block"
      this.prevCheckedStatus = true
    } else {
      this.visMenuTriggerFor.style.display = "none"
      this.prevCheckedStatus = false
      this.el.checked = false
    }

  }

}
