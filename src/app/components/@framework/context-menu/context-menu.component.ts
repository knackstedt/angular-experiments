import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContextMenuItem } from 'src/app/directives/context-menu.directive';
import { SharedModule } from '../../../shared.module';

@Component({
    selector: 'app-context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss'],
    imports: [
        SharedModule
    ],
    standalone: true,
    encapsulation: ViewEncapsulation.None
})
export class ContextMenuComponent {
    public data: any;
    public items: ContextMenuItem[];

    constructor(public dialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) private _data: any) {
        this.data = _data.data;
        this.items = _data.items;
    }

    /**
     *
     * @param item
     * @param evt
     * @returns
     */
    onMenuItemClick(item: ContextMenuItem, evt: MouseEvent) {
        if (typeof item == 'string') return;
        item.action(evt, this.data);
        this.close();
    }

    /**
     *
     * @param label
     * @returns
     */
    formatLabel(label: string): string {
        return label.replace(/_([a-z0-9])_/i, (match, group) => `<u>${group}</u>`);
    }

    /**
     * Close the context menu under these circumstances
     */
    @HostListener("window:resize", ['event'])
    @HostListener("window:blur", ['event'])
    close() {
        this.dialogRef.close();
    }
}
