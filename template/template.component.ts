// @ts-nocheck
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/pages/shared.module';

@Component({
    selector: 'app-filetemplate',
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.scss'],
    imports: [
        SharedModule
    ],
    standalone: true
})
export class TemplateComponent {

    constructor() { }

}
