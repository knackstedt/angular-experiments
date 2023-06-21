import { Injectable } from '@angular/core';

import { Logger } from '../utils';
import { BehaviorSubject, startWith } from 'rxjs';
import { NgxLazyLoaderService } from '@dotglitch/ngx-lazy-loader';

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
        private readonly lazyLoader: NgxLazyLoaderService
    ) {
        // Cannot use hostlistener for some reason
        window.onhashchange = this.restoreNavigation.bind(this);
        window.onpopstate = this.restoreNavigation.bind(this);

        this.restoreNavigation();
    }

    private restoreNavigation(evt?: PopStateEvent | HashChangeEvent) {
        const hash = location.hash.split("?")[0];

        if (
            [null, "", "#", '/#', '/#/', '/#?'].includes(location.hash) ||
            !hash ||
            hash.length < 4 ||
            !location.hash.startsWith("#") ||
            !this.lazyLoader.isComponentRegistered(hash)
        )
            return this.loadRootPage("#/Landing");

        return this.loadRootPage(hash)
    }

    /**
     * Helper to update the page URL.
     * @param hash component page ID to load.
     * @param data string or JSON data for query params.
     */
    private updateUrl(hash: string, data: string | string[][] | Record<string, string | number> | URLSearchParams, replace = false) {
        const oldHash = location.hash.split('?')[0];

        if (!hash)
            hash = oldHash.split('/')[1];

        // const hash = `#/${hash}`;

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
}
