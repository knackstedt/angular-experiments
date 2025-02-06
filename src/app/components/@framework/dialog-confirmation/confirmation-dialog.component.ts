import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss'],
    standalone: false
})
export class ConfirmationComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: {title, message}, public dialogRef: MatDialogRef<any>) { }

    confirmAction() {
        this.dialogRef.close(true);
    }
    cancelAction() {
        this.dialogRef.close(false);
    }
}
