
import { Component, Input, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { VscodeComponent } from 'src/app/pages/general/vscode/vscode.component';

@Component({
    selector: 'app-example-viewer',
    templateUrl: './example-viewer.component.html',
    styleUrls: ['./example-viewer.component.scss'],
    imports: [
    MatTabsModule,
    VscodeComponent
]
})
export class ExampleViewerComponent implements OnInit {

    @Input() example: {
        label: string,
        value: string
    }[] = [];

    constructor() { }

    ngOnInit() {
    }

}
