import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import interact from 'interactjs';
import { Logger } from '../utils';
import { LazyLoaderComponent, LazyLoaderService } from '@dotglitch/ngx-common';

const { log, warn, err } = Logger("DialogService", "#607d8b");

export type DialogOptions = Partial<Omit<MatDialogConfig<any>, 'data'> & {
    isResizable: boolean,
    icon: string,
    title: string,
    inputs: {[key: string]: any},
    outputs: {[key: string]: Function}
}>;

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    private dialogRef: MatDialogRef<unknown, any>;

    constructor(
        private dialog: MatDialog,
        private lazyLoader: LazyLoaderService
    ) { }

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

            if (!this.lazyLoader.isComponentRegistered(name)) return;

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
            const opts = {
                ...defaults,
                ...data,
                data: {
                    id: name,
                    inputs: data.inputs,
                    outputs: data.outputs
                }
            };

            this.dialogRef = this.dialog.open(LazyLoaderComponent, opts);

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
            // this.dialogRef = this.dialog.open(ConfirmationComponent, {
            //     maxHeight: "90vh",
            //     maxWidth: "90vw",
            //     panelClass: ["dialog-" + name],
            //     closeOnNavigation: true,
            //     restoreFocus: true,
            //     data: {title, message}
            // });

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
