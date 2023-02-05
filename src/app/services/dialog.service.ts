import { Component, Injectable, Inject, ViewEncapsulation, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { checkIfLazyComponentExists, LazyLoaderDirective } from '../directives/loader.directive';
import { DialogRef } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationComponent } from '../components/@framework/dialog-confirmation/confirmation-dialog.component';

import interact from 'interactjs';
import { Logger } from '../utils';
import { LazyDialogWrapperComponent } from '../components/@framework/lazy-dialog-wrapper/lazy-dialog-wrapper.component';

const { log, warn, err } = Logger("DialogService", "#607d8b");

export type DialogOptions = Partial<MatDialogConfig<any> & {
    isResizable: boolean,
    icon: string,
    title: string
}>;

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    private dialogRef: MatDialogRef<unknown, any>;

    constructor(
        private dialog: MatDialog,
    ) {
    }

    /**
     * Open a dialog item.
     *
     * Returns a promise that resolves when the dialog is closed.
     * If the dialog is closed with MatDialog.close(result),
     * the result passed to .close() will be returned from the promise.
     *
     * @param name Which dialog to open
     * @returns promise<result>
     */
    open(name: string, data: DialogOptions = {}): Promise<any> {
        log("Open dialog " + name, data);

        return new Promise((resolve, reject) => {
            let component;

            // Inject a lazy component data and args
            if (checkIfLazyComponentExists(name)) {
                component = LazyDialogWrapperComponent;
                data.data = {
                    id: name,
                    data: data
                }
            }

            if (component == null) {
                const err = new Error("Tried to open missing dialog " + name);
                console.error(err);
                reject(err);
                return;
            }

            // default options. can be overridden.
            const defaults: any = {
                maxHeight: "90vh",
                maxWidth: "90vw",
                minWidth: "450px",
                minHeight: "520px",
                closeOnNavigation: true,
                restoreFocus: true,
            }

            // Apply defaults
            const opts = {...defaults, ...data};


            this.dialogRef = this.dialog.open(component as any, opts);

            this.dialogRef.afterClosed().subscribe(result => {
                log("Dialog closed " + name, result);
                resolve(result);
            });
        })
    }

    /**
     * Method to close the open dialog.
     * Should be used sparingly.
     */
    clearDialog() {
        this.dialogRef?.close();
    }

    /**
     * Open a confirmation dialog. Will reject if a cancel occurs.
     * @param title title of the dialog
     * @param message main question that a user needs to confirm/deny
     * @returns
     */
    confirmAction(title: string, message: string): Promise<void> {
        return new Promise((res, rej) => {
            this.dialogRef = this.dialog.open(ConfirmationComponent, {
                maxHeight: "90vh",
                maxWidth: "90vw",
                panelClass: ["dialog-" + name],
                closeOnNavigation: true,
                restoreFocus: true,
                data: {title, message}
            });

            this.dialogRef.afterClosed().subscribe(result => {
                result == true ? res() : rej();
            });
        });
    }
}

const draggable = interact('.dialog-draggable');
draggable.styleCursor(false);

draggable.draggable({
    allowFrom: '.titlebar',
    onmove: evt => {

        const el = evt.currentTarget as HTMLElement;

        const chunks = el.style.transform.split("(");
        const points = (chunks[1] ? chunks[1].split(',') : []);

        if (!points[0]) {
            const bounds = el.getBoundingClientRect();
            points[0] = (window.innerWidth / 2) - (bounds.width / 2) + "px";
            points[1] = (window.innerHeight / 2) - (bounds.height / 2) + "px";
        }

        let ls = points[0] || "0px";
        let ts = points[1] || "0px";

        let ox = parseInt(ls.split("px")[0]);
        let oy = parseInt(ts.split("px")[0]);
        const x = ox + evt.dx;
        const y = oy + evt.dy;

        const tx = x + "px";
        const ty = y + "px";
        el.style.transform = `translate3D(${tx},${ty},0)`;
    }
});
