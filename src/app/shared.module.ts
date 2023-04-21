import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { NgPipesModule } from 'ngx-pipes';

import { UrlSanitizer } from './pipes/url-sanitizer.pipe';
import { ErrorPanelComponent } from './components/error-panel/error-panel.component';
import { ContextMenuDirective } from './directives/context-menu.directive';
import { NgxLazyLoaderComponent } from '@dotglitch/ngx-lazy-loader';

@NgModule({
    declarations: [
        ErrorPanelComponent
    ],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatIconModule,
        UrlSanitizer,
        NgxLazyLoaderComponent,
        ContextMenuDirective
    ],
    exports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatIconModule,
        NgPipesModule,
        ErrorPanelComponent,
        ContextMenuDirective
    ],
})
export class SharedModule { }
