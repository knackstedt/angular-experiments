// @ts-nocheck
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';

@Component({
    selector: 'app-filetemplate',
    templateUrl: './filetemplate.component.html',
    styleUrls: ['./filetemplate.component.scss'],
    imports: [
        SharedModule
    ],
    standalone: true
})
export class TemplateComponent {

    constructor() { }

}
