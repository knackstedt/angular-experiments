import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from '../../../shared.module';

@Component({
    selector: 'ngx-lazy-dialog-wrapper',
    templateUrl: './lazy-dialog-wrapper.component.html',
    standalone: true,
    imports: [
        SharedModule
    ]
})
export class LazyDialogWrapperComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public args,
        public dialog: DialogRef
    ) { }
}
