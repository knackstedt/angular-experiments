import { Component } from '@angular/core';
import { SharedModule } from '../../../shared.module';

@Component({
    selector: 'app-info-dialog',
    templateUrl: './info-dialog.component.html',
    styleUrls: ['./info-dialog.component.scss'],
    imports: [ SharedModule ],
    standalone: true
})
export class InfoDialogComponent {
    constructor() { }
}
