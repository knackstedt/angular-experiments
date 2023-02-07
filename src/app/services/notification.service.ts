import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { Fetch } from './fetch.service';
import meta from '../../../package.json';

const versionCheckInterval = 5 * 60 * 1000;

type AppNotification = {
    version: boolean
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService extends Subject<AppNotification> {

    private readonly interval = 3 * 60 * 1000;

    private versionHasShown = false;
    constructor(private fetch: Fetch) {
        super();

        setTimeout(() => {
            this.checkVersion()
        }, versionCheckInterval);
    }

    private checkVersion() {
        this.fetch.get<{ version: string; }>('/version.json')
        .then(v => {
            if (v != null && v['angular-experiments'] && meta.version != v['angular-experiments']) {
                this.next({
                    version: true
                })
                this.versionHasShown = true;

            }
        })
        .finally(() => {
            if (!this.versionHasShown) {
                setTimeout(() => {
                    this.checkVersion();
                }, this.interval)
            }
        })
    }
}
