import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import Timeout = NodeJS.Timeout;
import { TablesMenuNode } from '../tables-menu/tables-menu.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantsService } from '../../services/constants.service';
import { MatDialog } from '@angular/material/dialog';
import { ModelsGalleryService } from '../../services/models-gallery.service';
import { ModelsGalleryMenuNode } from '../models-gallery-menu/models-gallery-menu.component';
import { MatSliderChange } from '@angular/material/slider';
import { IconService } from 'src/app/services/icon.service';
import { SessionService } from '../../services/session.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-models-gallery',
  templateUrl: './models-gallery.component.html',
  styleUrls: ['./models-gallery.component.less'],
})
export class ModelsGalleryComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  interval: Timeout | null = null;

  isModelsGalleryMenuOpen: boolean = true;
  isModelsGalleryMenuRail: boolean = false;
  animationButtonClicked: boolean = false;
  menuStatus: number = 2;

  reftime: string = '';

  code: string = '';

  exception: string = '';

  currentPage: string = '';
  currentPageIcon: string | undefined = '';

  openPreview: boolean = false;

  constructor(
    private modelsGalleryService: ModelsGalleryService,
    private route: ActivatedRoute,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router,
    private constantsService: ConstantsService,
    private dialog: MatDialog,
    private icons: IconService,
    public session: SessionService
  ) {
    icons.registerSvgIcon('btn-arrow-left.svg');
    icons.registerSvgIcon('btn-arrow-right.svg');
    icons.registerSvgIcon('video.svg');
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.code = params['code'];

      if (this.constantsService.logged && params['reftime']) {
        this.reftime = params['reftime'];
        this.session.setSelectedDateTimeCookie(
          new Date(parseInt(params['reftime'] as string))
        );
      }

      if (this.code && this.code != '') this.getImages();
      else this.exception = 'homepage';

      // some cleaning-stuff ------------------------- //
      this.animationButtonClicked = false;
      if (this.interval) clearInterval(this.interval);
    });

    if (this.constantsService.isMobile)
      this.galleryOptions = [
        {
          width: '90vw',
          // height: '50vh',
          thumbnailsColumns: 4,
          arrowPrevIcon: 'fa fa-chevron-left',
          arrowNextIcon: 'fa fa-chevron-right',
          imageAnimation: NgxGalleryAnimation.Slide,
          imageInfinityMove: true,
        },
      ];
    else
      this.galleryOptions = [
        {
          //          height: '560px',
          width: '800px',
          height: '800px',
          thumbnailsColumns: 4,
          arrowPrevIcon: 'fa fa-chevron-left',
          arrowNextIcon: 'fa fa-chevron-right',
          imageAnimation: NgxGalleryAnimation.Slide,
          imageInfinityMove: true,
        },
      ];
  }

  onMenuStatusChange(e: MatSliderChange) {
    switch (e.value) {
      case 0: {
        this.isModelsGalleryMenuOpen = false;
        this.isModelsGalleryMenuRail = false;
        break;
      }
      case 1: {
        this.isModelsGalleryMenuOpen = true;
        this.isModelsGalleryMenuRail = true;
        break;
      }
      case 2: {
        this.isModelsGalleryMenuOpen = true;
        this.isModelsGalleryMenuRail = false;
        break;
      }
    }
  }

  formatLabel(value: number) {
    let label = '';
    switch (value) {
      case 0: {
        label = 'Nascosto';
        break;
      }
      case 1: {
        label = 'Icone';
        break;
      }
      case 2: {
        label = 'Ampio';
        break;
      }
    }
    return label;
  }

  setPreviewOpen(bool: boolean) {
    this.openPreview = bool;
  }

  animationToggle(carousel: any) {
    this.animationButtonClicked = !this.animationButtonClicked;

    if (this.animationButtonClicked)
      this.interval = setInterval(() => {
        carousel.showNext();
      }, 1000);
    else if (this.interval) clearInterval(this.interval);
  }

  isLogged(): boolean {
    if (this.constantsService.logged) return this.constantsService.logged;
    return false;
  }

  onDateTimeChanged(date: Date | null) {
    // if (this.selectedDateTime != '')
    //   this.session.setSelectedDateTimeCookie(this.selectedDateTime);
    // else this.session.deleteSelectedDateTimeCookie();

    if (date) {
      this.session.setSelectedDateTimeCookie(date);
    } else {
      this.session.deleteSelectedDateTimeCookie();
    }

    let params = this.route.snapshot.params;

    let selectedTime = this.session.getSelectedDateTimeCookie();

    let refTime = '';
    if (selectedTime && selectedTime.getTime()) {
      refTime = selectedTime.getTime() + '';
    }

    params = {
      ...params,
      reftime: refTime,
    };

    const currentParamsArray = this.router.url.split('/'),
      lastValue = _.last(currentParamsArray);

    currentParamsArray.pop();

    const url =
      lastValue == this.reftime
        ? currentParamsArray.join('/')
        : this.router.url;

    this.router.navigateByUrl(url + '/' + params.reftime);
    // this.router.navigate(['/models-gallery', params]);
  }

  // data ----------------------------------------------------------------------- //
  getImages() {
    this.modelsGalleryService.getImages(this.code).subscribe((response) => {
      if (response?.images?.length == 0) this.exception = 'noImages';
      else {
        this.exception = '';

        // sort by name
        response?.images?.sort((a, b) =>
          a?.imageLink?.localeCompare(b?.imageLink)
        );

        this.galleryImages = response?.images?.map((el) => ({
          small: 'https://omirl.regione.liguria.it/' + el.imageLink,
          medium: 'https://omirl.regione.liguria.it/' + el.imageLink,
          big: 'https://omirl.regione.liguria.it/' + el.imageLink,
        }));
      }
    });
  }
  // ---------------------------------------------------------------------------- //

  // menu ----------------------------------------------------------------------- //

  toggleRailModelsGalleryMenu = () => {
    this.isModelsGalleryMenuRail = !this.isModelsGalleryMenuRail;
    if (this.isModelsGalleryMenuRail) this.menuStatus = 1;
    else this.menuStatus = 2;
  };

  onModelsGalleryMenuItemClicked(node: ModelsGalleryMenuNode) {
    console.log('caught layermenuitem clicked event on node: %o', node);

    let selectedTime = this.session.getSelectedDateTimeCookie();

    let refTime = '';
    if (selectedTime && selectedTime.getTime()) {
      refTime = selectedTime.getTime() + '';
    }

    this.router.navigateByUrl(
      '/models-gallery/' + node.location + '/' + refTime
    );
    this.preselectPath(node);
  }

  preselectPath(node: ModelsGalleryMenuNode | null) {
    console.log(node);
    if (node?.ancestorName && node?.ancestorIcon) {
      this.currentPage = node.ancestorName + ' | ' + node.name;
      this.currentPageIcon = node.ancestorIcon;
    }
  }
  // ---------------------------------------------------------------------------- //

  // icons ---------------------------------------------------------------------- //
  // registerSvgIcon = (iconFileName: string, iconName?: string): string => {
  //   if (!iconName) {
  //     //remove extension from filename
  //     iconName = iconFileName.replace(/\.[^/.]+$/, '');
  //   }
  //   this.iconRegistry.addSvgIcon(
  //     iconName,
  //     this.sanitizer.bypassSecurityTrustResourceUrl(
  //       '../../assets/img/layout-menu-icons/' + iconName + '.svg'
  //     )
  //   );
  //   return iconName;
  // };
  // ---------------------------------------------------------------------------- //
}
