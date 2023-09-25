import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { WellKnownComponent } from './.well-known/.well-known.component';
import { AcmeChallengeComponent } from './acme-challenge/acme-challenge.component';
import { AppCommonModule } from './common/appcommon.module';
import { PostsComponent } from './posts/posts.component';
import { WebComponentsComponent } from './posts/web-components/web-components.component';
import { MainContentComponent } from './common/main-content/main-content.component';
import { MynsweeprComponent } from './mynsweepr/mynsweepr.component';

const appRoutes: Routes = [
  { path: 'posts', component: PostsComponent },
  { path: 'web-components', component: WebComponentsComponent },
  { path: 'mynsweepr', component: MynsweeprComponent },
  { path: '', component: MainContentComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    WellKnownComponent,
    AcmeChallengeComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true, enableTracing: true }),
    BrowserModule,
    AppCommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
