import { Component, Input, OnDestroy, NgModule } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ngx-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
    imports: [ CommonModule, MatButtonModule ],
    standalone: true
})
export class NotFoundComponent implements OnDestroy {

    @Input() scope = "";
    @Input() error: Error;

    isNewVersion = false;
    visible = false;

    private _sub: Subscription;
    constructor(private navigator: NavigationService, notificationService: NotificationService) {
        this.visible = location.hash != "#/";

        if (this.visible) {
            // If a new version of the app is deployed, the JS files that correspond
            // to updated components will go missing, so indicating there is a new version
            // can mitigate cases where the webpage is missing critical JS files
            this._sub = notificationService.subscribe(v => {
                if (v.version)
                    this.isNewVersion = true;
            })
        }
    }

    ngOnDestroy() {
        this._sub?.unsubscribe();
    }

    onHomeClick() {
        this.navigator.loadHomepage();
    }
}
