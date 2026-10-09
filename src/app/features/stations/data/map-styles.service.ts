import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { MAP_CONFIG } from '../config/map.config';

@Injectable({ providedIn: 'root' })
export class MapStylesService {
  private readonly document = inject(DOCUMENT);
  private pending?: Promise<void>;

  load(): Promise<void> {
    if (this.pending) return this.pending;
    const link = this.document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL(MAP_CONFIG.stylesPath, this.document.baseURI).href;
    this.pending = new Promise<void>((resolve, reject) => {
      link.onload = () => resolve();
      link.onerror = () => {
        link.remove();
        this.pending = undefined;
        reject(new Error(MAP_CONFIG.stylesError));
      };
    });
    this.document.head.appendChild(link);
    return this.pending;
  }
}
