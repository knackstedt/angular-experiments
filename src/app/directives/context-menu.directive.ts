import { Directive, Input, ViewContainerRef, ElementRef, HostListener, Inject, Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KeyCommand } from '../services/keyboard.service';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from '../components/@framework/context-menu/context-menu.component';

export type ContextMenuItem<T = any> = {
    /**
     * Label for the menu-item
     */
    label: string,
    /**
     * Callback method that is called when a user activates
     * a context-menu item.
     * Use the `contextMenuData` decorator for passing data.
     */
    action: (evt: MouseEvent, data: T) => any,

    /**
     * Set whether the menu item appear disabled.
     */
    disabled?: boolean,
    /**
     * If a shortcut is set, the text-label.
     */
    shortcutLabel?: string,
    /**
     * Keyboard shortcut to activate this item.
     */
    shortcut?: KeyCommand,
    /**
     * Path to an icon to render on the left side of the item.
     */
    icon?: string,


    seperator?: boolean;
} | "seperator";


@Directive({
    selector: '[contextMenu]',
    standalone: true
})
export class ContextMenuDirective {

    /**
     * The data representing the item the context-menu was opened for.
     */
    @Input("contextMenuData") data: any;

    /**
     * The items that will be bound to the context menu.
     */
    @Input("contextMenuItems") menuItems: ContextMenuItem[];

    constructor(
        private dialog: MatDialog
    ) { }

    private calcHeight() {
        return this.menuItems
            .map(i => typeof i == "string" ? 2 : 24)
            .reduce((a, b) => a + b, 0);
    }

    private calcWidth() {

        const items = this.menuItems
            .filter(i => i != "seperator");

        // TODO: this is probably not right.
        const lName = (items as any)
            .sort((a, b) => a.label.length - b.label.length)
            .filter(e => e)
            .pop().label;
        const lShort = (items as any)
            .sort((a, b) => a.label.length - b.label.length)
            .filter(e => e)
            .pop().label;

        // Create dummy div that will calculate the width for us.
        const div = document.createElement("div");
        div.style["font-size"] = "14px";
        div.style["position"] = "absolute";
        div.style["opacity"] = "0";
        div.style["pointer-events"] = "none";
        div.style["left"] = "-1000vw"; // The div lives in narnia

        div.innerText = lName + lShort;

        document.body.appendChild(div);

        // Get width
        const w = div.getBoundingClientRect().width;

        // Clear element out of DOM
        div.remove();

        return w;
    }

    // Needs to be public so we can manually open the dialog
    @HostListener('contextmenu', ['$event'])
    public onContextMenu(evt: MouseEvent) {
        evt.preventDefault();

        const h = this.calcHeight();
        const w = this.calcWidth();

        const cords = {
            top: null,
            left: null,
            bottom: null,
            right: null
        };

        if (evt.clientY + h > window.innerHeight)
            cords.bottom = (window.innerHeight - evt.clientY) + "px";
        if (evt.clientX + w > window.innerWidth)
            cords.right = (window.innerWidth - evt.clientX) + "px";

        if (!cords.bottom) cords.top = evt.clientY + "px";
        if (!cords.right) cords.left = evt.clientX + "px";

        const dialogRef = this.dialog.open(ContextMenuComponent, {
            data: {
                data: this.data,
                items: this.menuItems
            },
            panelClass: "context-menu",
            position: cords,
            backdropClass: "context-menu-backdrop"
        });

        // dialogRef.afterClosed().subscribe(result => {
        //     console.log('The dialog was closed');
        // });
    }
}


// Helper to open the context menu without using the directive.
export const openContextMenu = (dialog: MatDialog, menuItems: ContextMenuItem[], data: any, evt: PointerEvent) => {
    const ctx = new ContextMenuDirective(dialog);
    ctx.data = data;
    ctx.menuItems = menuItems;
    ctx.onContextMenu(evt);

    // TODO: is this disposed properly?
}
