import { Injectable } from '@angular/core';

import { Fetch } from './fetch.service';
import { ToasterService } from './toaster.service';
import { Logger, updateUrl } from '../utils';
import { BehaviorSubject, startWith } from 'rxjs';

const { log, warn, err } = Logger("NavigationService", "#ff9800");

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    activePage$ = new BehaviorSubject<{
        id: string,
        args: any
    }>(null);


    constructor(
        private fetch: Fetch,
        private toaster: ToasterService
    ) {
        // Cannot use hostlistener for some reason
        window.onhashchange = this.restoreNavigation.bind(this);

        this.restoreNavigation();
    }

    private restoreNavigation() {
        if ([null, "", "#", '/#', '/#/'].includes(location.hash))
            return this.loadHomepage();

        const hash = location.hash.split("?")[0];
        this.onMenuItemNavigate(hash);
    }

    public async onMenuItemNavigate(page: string, navigate = true): Promise<void> {
        // We just wanted to update the selected menu item.
        if (navigate == false)
            return;

        let url: URL;
        // The "new URL" constructor explodes if the url isn't valid.
        try { url = new URL(page) } catch (ex) { }

        // Angular Page
        if (/^\#/.test(page)) {
            // Check if we need to load a local Angular component. (begins with #)
            const next = page.slice(1);

            this.loadAngularPage({
                target: next,
                query: {}
            });
        }
        // Fatal: Unknown page type
        else {
            err("Unknown navigation type: " + JSON.stringify(page));

            // The URL is not valid. (we don't know what to do with it)
            this.toaster.warn("Failed navigation", "The provided navigation action failed to activate.");
        }
    }

    private loadAngularPage({target, query = {}}) {
        return new Promise<void>((res, rej) => {
            // Interim change to the intentionally blank component
            // to force re-initialization of the loaded component.
            setTimeout(() => {
                // Rip off leading slashes
                if (target.startsWith('/'))
                    target = target.slice(1);

                // Wipe out stray space symbols
                target = target.replace(/[ ]/g, '');

                updateUrl(target, query);

                this.activePage$.next({
                    id: target,
                    args: query
                });
            }, 10)
        })
    }

    /*
    * In the case where we have internal links on the application, we want
    * a reliable way to load the correct page regardless where we trigger the action from.
    * This prevents minor typos and bad links from existing in obscure places/pages.
    */

    // Trigger loading of the homepage.
    public loadHomepage() {
        this.onMenuItemNavigate("#/Landing");
    }

    public loadAboutUs() {
        this.onMenuItemNavigate("#/About");
    }
}
