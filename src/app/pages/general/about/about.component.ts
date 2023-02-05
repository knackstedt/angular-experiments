import { Component, NgModule } from '@angular/core';
import { UserCard, UserCardComponent } from '../../../components/user-card/user-card.component';
import { SharedModule } from '../../../shared.module';
import { Team } from './team';


@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    imports: [
        SharedModule,
        UserCardComponent
    ],
    standalone: true
})
export class AboutComponent{

    team: UserCard[] = Team;
}
