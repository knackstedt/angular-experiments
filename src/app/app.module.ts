import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

import { RootComponent } from './root.component';
import { BackdropComponent } from './components/backdrop/backdrop.component';
import { LoaderInterceptor } from './utils/http.interceptor';
import { ToastComponent } from './components/toast/toast.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environment';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { UrlSanitizer } from './pipes/url-sanitizer.pipe';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';
import { ComponentResolveStrategy, NgxLazyLoaderModule } from '@dotglitch/ngx-lazy-loader';
import { RegisteredComponents } from 'src/app/component.registry';
import { NotFoundComponent } from 'src/app/components/@framework/not-found/not-found.component';
import { LazyProgressDistractorComponent } from './components/@framework/lazy-progress-distractor/lazy-progress-distractor.component';


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
        MatButtonModule,
        MatSidenavModule,
        UrlSanitizer,
        BackdropComponent,
        NavbarComponent,
        HttpClientModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        NgxLazyLoaderModule.forRoot({
            entries: RegisteredComponents,
            componentResolveStrategy: ComponentResolveStrategy.PickFirst,
            notFoundComponent: NotFoundComponent,
            loaderDistractorComponent: LazyProgressDistractorComponent
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
