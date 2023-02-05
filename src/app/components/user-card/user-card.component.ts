import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { PopupCardComponent } from 'src/app/components/popup-card/popup-card.component';

export type UserCard = {
    name: string,
    role: string,
    tagline: string,
    bio: string,
    headshot: string,
    wallpaper?: string,
    specialties?: string,
    background?: string,
    dtStart?: Date,
    itStart?: Date
}

@Component({
    selector: 'app-user-card',
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.scss'],
    imports: [
        SharedModule,
        PopupCardComponent
    ],
    standalone: true
})
export class UserCardComponent {
    @Input() user: any;

    yearsWorked(start: Date) {
        const d = new Date();

        // Get the delta years/months
        const years = Math.floor((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));

        return {
            years,
            months
        }
    }

}
