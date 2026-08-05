import { Injectable } from '@angular/core';
import { MynsweeprSignalsDialogComponent } from './components';

@Injectable({
  providedIn: 'root'
})
export class MynsweeprSignalsDialogService {
  public components: Record<string, MynsweeprSignalsDialogComponent> = {};


  public register(id: string, component: MynsweeprSignalsDialogComponent): void {
    this.components[id] = component;
    this.components[id].closed.subscribe((closedId: string) => {
      if (Object.hasOwn(this.components, closedId) && !this.components[closedId].closed) {
        this.components[closedId].close();
      }
    });
  }

  public open(id: string) {
    // close all dialogs
    Object.keys(this.components).forEach(key => this.close(key));
    // open this one
    this.components[id].open();
  }
  public close(id: string) {
    this.components[id].close();
  }
}
