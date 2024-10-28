import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  constructor(private iconRegistry: MatIconRegistry, private sanitizer:DomSanitizer) { }
 
  registerSvgIcon = (iconFileName:string, iconName?:string) : string => {
    if (!iconName) {
      //remove extension from filename
      iconName = this.getFileNameWithoutExtension(iconFileName)
    }

    try {
      this.iconRegistry.addSvgIcon(iconName, this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/layout-menu-icons/' + iconName + ".svg"))
    } catch (ex) {
      console.log('Error loading icon ', iconFileName)
    }

    return iconName
  }

  registerSvgIconFromAssetsImg = (iconFileName:string, iconName?:string) : string => {
    if (!iconName) {
      //remove extension from filename
      iconName = this.getFileNameWithoutExtension(iconFileName)
    }
    //this.iconRegistry.addSvgIcon(iconName, this.sanitizer.bypassSecurityTrustResourceUrl('../../assets/img/' + iconName + ".svg"))
    this.iconRegistry.addSvgIcon(iconName, this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/' + iconName + ".svg"))
    return iconName
  }

  getFileNameWithoutExtension = (filePath: string) : string => {
    return filePath.replace(/\.[^/.]+$/, "")
  } 
}
