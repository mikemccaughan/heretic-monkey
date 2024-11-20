import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { withHashLocation, withDebugTracing, provideRouter, Routes } from '@angular/router';
import { PostsComponent } from './app/posts/posts.component';
import { WebComponentsComponent } from './app/posts/web-components/web-components.component';
import { MynsweeprComponent } from './app/mynsweepr/mynsweepr.component';
import { MainContentComponent } from './app/common/main-content/main-content.component';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

export const appRoutes: Routes = [
  { path: 'posts', component: PostsComponent },
  { path: 'web-components', component: WebComponentsComponent },
  { path: 'mynsweepr', component: MynsweeprComponent },
  { path: '', component: MainContentComponent },
];



if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule),
        provideRouter(appRoutes, withHashLocation(), withDebugTracing())
    ]
})
  .catch(err => console.error(err));
