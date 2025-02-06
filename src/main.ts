import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LazyLoaderModule } from '@dotglitch/ngx-common';
import { RegisteredComponents } from 'src/app/component.registry';
import { RootComponent } from 'src/app/root.component';

bootstrapApplication(RootComponent, {
    providers: [
        provideAnimationsAsync(),
        importProvidersFrom(
            LazyLoaderModule.forRoot({
                entries: RegisteredComponents
            }),
        ),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideClientHydration(withEventReplay()),
        provideHttpClient(withInterceptorsFromDi())
    ]
})
    .catch((err) => console.error(err));
