import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { NgPipesModule } from 'ngx-pipes';

import { UrlSanitizer } from './pipes/url-sanitizer.pipe';
import { ErrorPanelComponent } from './components/error-panel/error-panel.component';
import { LazyLoaderDirective } from './directives/loader.directive';

@NgModule({
    declarations: [
        ErrorPanelComponent
    ],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatIconModule,
        UrlSanitizer,
        LazyLoaderDirective
    ],
    exports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatIconModule,
        NgPipesModule,
        ErrorPanelComponent,
        LazyLoaderDirective,
    ],
})
export class SharedModule { }
