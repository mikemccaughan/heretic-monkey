import { Injectable } from '@angular/core';
import { MynsweeprSignalsDialogComponent } from './components';

@Injectable({
  providedIn: 'root'
})
export class MynsweeprSignalsDialogService {
  public components: { [key: string]: MynsweeprSignalsDialogComponent } = {};

  constructor() { }

  public register(id: string, component: MynsweeprSignalsDialogComponent): void {
    this.components[id] = component;
    this.components[id].closed.subscribe((closedId: string) => {

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
