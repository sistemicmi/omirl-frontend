import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Config } from '../../omirl-config';
import { Observable } from 'rxjs';
import { ConstantsService } from './constants.service';
import { SessionService } from './session.service';

export interface IModelsGalleryLink {
  active: boolean;
  code: string;
  codeParent: string;
  codeVariable: string;
  description: string;
  imageLinkOff: string;
  isActive: boolean;
  location: string;
  sublevelGalleryLink: IModelsGalleryLink[];
}

export interface IModelsGalleryImage {
  images: IModelsGalleryImageObj[];
  model: string;
  refDateMin: string;
  subVarialbe: string;
  variable: string;
}

export interface IModelsGalleryImageObj {
  description: string;
  imageLink: string;
}

@Injectable({
  providedIn: 'root',
})
export class ModelsGalleryService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private constantsService: ConstantsService,
    private sessionService: SessionService
  ) {
    this.APIURL = this.constantsService.apiURL;
  }

  // props ---------------------------------------------------------------------------------- //
  APIURL: string;
  // ---------------------------------------------------------------------------------------- //

  // methods -------------------------------------------------------------------------------- //
  getMenuLinks(): Observable<IModelsGalleryLink[]> {
    return this.http.get<IModelsGalleryLink[]>(
      this.APIURL + '/gallery/gallerylinks',
      {
        headers: this.sessionService.prepareHeaders(),
      }
    );
  }

  getImages(code: string): Observable<IModelsGalleryImage> {
    return this.http.get<IModelsGalleryImage>(
      this.APIURL + '/gallery/' + code,
      {
        headers: this.sessionService.prepareHeaders(),
      }
    );
  }
  // ---------------------------------------------------------------------------------------- //
}
