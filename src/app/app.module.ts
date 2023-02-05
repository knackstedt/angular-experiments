import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { RootComponent } from './root.component';
import { BackdropComponent } from './components/backdrop/backdrop.component';
import { LoaderInterceptor } from './utils/http.interceptor';
import { ToastComponent } from './components/toast/toast.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environment';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { UrlSanitizer } from './pipes/url-sanitizer.pipe';
import { LazyLoaderDirective } from './directives/loader.directive';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
    declarations: [
        RootComponent,
        ToastComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatDialogModule,
        MatIconModule,
        UrlSanitizer,
        BackdropComponent,
        NavbarComponent,
        HttpClientModule,
        LazyLoaderDirective,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        })
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptor,
            multi: true
        }
    ],
    bootstrap: [RootComponent]
})
export class AppModule {
}
