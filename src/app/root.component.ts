import { Component, HostListener, OnInit } from '@angular/core';

import { ThemeLoaderService } from 'src/app/services/theme-loader.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { DialogService } from 'src/app/services/dialog.service';
import { NotificationService } from './services/notification.service';

import { Fetch } from './services/fetch.service';
import { ToasterService } from './services/toaster.service';
import { KeyboardService } from './services/keyboard.service';
import { RegisteredComponents } from './component.registry';

@Component({
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss']
})
export class RootComponent {
    isMobile = false;
    fatalError = false;

    constructor(
        private toaster: ToasterService,
        private fetch: Fetch,
        private themeLoader: ThemeLoaderService,
        public navigator: NavigationService,
        public dialog: DialogService,
        private notification: NotificationService,
        private keyboard: KeyboardService
        ) {

        // This application should _never_ be loaded within an iframe.
        if (window != window.top) {
            document.body.classList.add("fatal-error");
            this.fatalError = true;
            return;
        }

        notification.subscribe(v => {
            if (v.version)
                this.toaster.information("New version", "Thank you for using my Angular Experiment. I just published a new version that you can get by refreshing your webpage.");
        });

        this.onResize();
        // Is this necessary?
        setInterval(() => this.onResize(), 5000);
    }

    @HostListener('window:resize', ['$event'])
    private onResize(event?) {
        this.isMobile = (window.innerHeight / window.innerWidth > 1.5) || window.innerWidth < 900;

        document.body.classList.remove("mobile");
        document.body.classList.remove("desktop");

        this.isMobile  && document.body.classList.add("mobile");
        !this.isMobile && document.body.classList.add("desktop");
    }
}
