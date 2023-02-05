import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, isDevMode } from '@angular/core';

// What key does the theme get stored under on the 'localstorage' object.
const THEME_KEY = "es-theme";

// TODO: validate interface

@Injectable({
    providedIn: 'root'
})
export class ThemeLoaderService {
    readonly themes = [
        "light",
        "dark",
        "glassy"
    ];

    readonly defaultTheme = "light";
    // readonly defaultTheme = "dark";

    private currentTheme: string = localStorage[THEME_KEY] || this.defaultTheme;

    constructor(@Inject(DOCUMENT) private document: Document) {
        this.loadTheme(this.currentTheme);
    }

    public loadTheme(theme: string) {
        this.currentTheme = theme;

        const link = isDevMode() ? `/${theme}.css` : `/ui/${theme}.css`;

        this.loadStylesheet("theme", link);
    }

    private loadStylesheet(id: string, href: string) {
        let themeLink = this.document.getElementById(id) as HTMLLinkElement;
        if (themeLink) {
            themeLink.href = href;
        }
        else {
            const style = this.document.createElement('link');
            style.id = id;
            style.rel = 'stylesheet';
            style.href = href;

            const head = this.document.getElementsByTagName('head')[0];

            head.appendChild(style);
        }
    }
}
