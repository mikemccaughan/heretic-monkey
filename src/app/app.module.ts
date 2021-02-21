import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { WellKnownComponent } from './.well-known/.well-known.component';
import { AcmeChallengeComponent } from './acme-challenge/acme-challenge.component';

const appRoutes: Routes = [];

@NgModule({
  declarations: [
    AppComponent,
    WellKnownComponent,
    AcmeChallengeComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true, relativeLinkResolution: 'legacy' }),
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
