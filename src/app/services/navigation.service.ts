import { Injectable } from '@angular/core';

import { Fetch } from './fetch.service';
import { ToasterService } from './toaster.service';
import { Logger } from '../utils';
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
        window.onpopstate = this.restoreNavigation.bind(this);

        this.restoreNavigation();
    }

    private restoreNavigation(evt?: PopStateEvent | HashChangeEvent) {
        if ([null, "", "#", '/#', '/#/'].includes(location.hash))
            return this.loadHomepage();

        if (evt?.type == "popstate") {
            // window.history.pushState(location.hash, null, location.hash);
            const event = evt as PopStateEvent;
            event.preventDefault();
            const hash = location.hash.split("?")[0];
            this.loadRootPage(hash);

            return;
        }
        // else {

        // }



        const hash = location.hash.split("?")[0];
        this.loadRootPage(hash);
    }

    /**
     * Helper to update the page URL.
     * @param page component page ID to load.
     * @param data string or JSON data for query params.
     */
    private updateUrl(page: string, data: string | string[][] | Record<string, string | number> | URLSearchParams, replace = false) {
        const oldHash = location.hash.split('?')[0];

        if (!page)
            page = oldHash.split('/')[1];

        const hash = `#/${page}`;

        const qstring = location.hash.split('?')[1];

        const query = new URLSearchParams(data as any);
        const prevParams = new URLSearchParams(qstring);

        // If the hash is the same, retain params.
        if (hash == oldHash) {
            // @ts-ignore
            for (const [key, value] of prevParams.entries()) {
                if (!query.has(key))
                    query.set(key, prevParams.get(key));
            }
        }

        // @ts-ignore
        for (const [key, val] of query.entries()) {
            if (
                val == null ||
                val == undefined ||
                val == '' ||
                val == 'null' ||
                Number.isNaN(val) ||
                val == 'NaN'
            )
                query.delete(key);
        }

        // console.log(hash);
        if (!(hash.toLowerCase() == "#/frame" || hash.toLowerCase() == "#/powerbi") || data['id'] == -1)
            query.delete('id');

        if (replace) {
            window.history.replaceState(data, '', hash + '?' + query.toString());
        }
        else {
            window.history.pushState(data, '', hash + '?' + query.toString());
        }
    }

    // Directly triggers a page load for the root area
    public async loadRootPage(page: string): Promise<void> {
        if (/^\#/.test(page))
            page = "#" + page;

        let next = page.slice(1);

        if (next.startsWith('/'))
            next = next.slice(1);

        // Wipe out stray space symbols
        next = next.replace(/[ ]/g, '-').replace(/|#\//g, '');

        this.updateUrl(next, {
            data: JSON.stringify({})
        });

        console.trace(next);
        this.activePage$.next({
            id: next,
            args: {}
        });

        return new Promise<void>((res, rej) => {
            // Interim change to the intentionally blank component
            // to force re-initialization of the loaded component.
            setTimeout(() => {
                // Rip off leading slashes

            }, 10);
        })
    }

    /*
    * In the case where we have internal links on the application, we want
    * a reliable way to load the correct page regardless where we trigger the action from.
    * This prevents minor typos and bad links from existing in obscure places/pages.
    */

    // Trigger loading of the homepage.
    public loadHomepage() {
        this.loadRootPage("#/Landing");
    }

    public loadAboutUs() {
        this.loadRootPage("#/About");
    }
}
