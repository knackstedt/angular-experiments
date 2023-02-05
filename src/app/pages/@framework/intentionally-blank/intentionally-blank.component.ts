import { Component, NgModule } from '@angular/core';
import { SharedModule } from '../../../shared.module';


/**
 * This component exists so when a user clicks a button that navigates them to an angular screen, we can always trigger
 * initialization of that component/screen.
 */

@Component({
    selector: 'app-intentionally-blank',
    templateUrl: './intentionally-blank.component.html',
    styleUrls: ['./intentionally-blank.component.scss'],
    imports: [ SharedModule ],
    standalone: true
})
export class IntentionallyBlankComponent {
    constructor() { }
}
