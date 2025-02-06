import { Component, HostListener, OnInit } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';
import { NotificationService } from './services/notification.service';

import { Fetch } from './services/fetch.service';
import { ToasterService } from './services/toaster.service';
import { KeyboardService } from './services/keyboard.service';
import { LazyLoaderModule, NavigationService } from '@dotglitch/ngx-common';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { BackdropComponent } from 'src/app/components/backdrop/backdrop.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss'],
    imports: [
        ToastComponent,
        BackdropComponent,
        MatIconModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        LazyLoaderModule,
        NavbarComponent
    ],
    standalone: true
})
export class RootComponent {
    isMobile = false;
    fatalError = false;

    constructor(
        private toaster: ToasterService,
        private fetch: Fetch,
        public navigator: NavigationService,
        public dialog: DialogService,
        private notification: NotificationService,
        private keyboard: KeyboardService
    ) {

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
