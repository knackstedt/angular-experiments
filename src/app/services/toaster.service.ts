import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastMessage } from '../types/toast-message';

@Injectable({
    providedIn: 'root'
})
export class ToasterService {
    toaster$ = new Subject<ToastMessage>();

    constructor() { window['toaster'] = this; }

    private beforeInitItems = [];
    private isListenerAttached = false;
    bindListener() {
        this.beforeInitItems.forEach(args => this.toaster$.next(args));
        this.isListenerAttached = true;
    }

    private parseMessage(severity, title, message, data) {

        try { throw new Error(); }
        catch(ex) {
            // Cut off the first three lines in the stack
            // These are the error message, and two closures in
            // this toaster object.
            const stack =
                (ex.message || ex.name) + '\n' +
                ex.stack.split('\n').slice(3).join('\n');

            this.isListenerAttached
                ? this.toaster$.next({ severity, title, message, stack, data })
                : this.beforeInitItems.push({ severity, title, message, stack, data });
        }
    }



    // Public interface.
    public error(title, message, data = {}) {
        this.parseMessage("error", title, message, data);
    }
    public err = this.error;

    public warning(title, message, data = {}) {
        this.parseMessage("warn", title, message, data);
    }
    public warn = this.warning;

    public info(title, message, data = {}) {
        this.parseMessage("info", title, message, data);
    }
    public information = this.info;

    public success(title, message, data = {}) {
        this.parseMessage("success", title, message, data);
    }
}
