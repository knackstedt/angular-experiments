import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { RegisteredComponents } from 'src/app/component.registry';
import { NavigationService } from '../../services/navigation.service';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    imports: [
        SharedModule
    ],
    standalone: true
})
export class NavbarComponent {

    readonly pages = RegisteredComponents
        .filter(c => !c.hidden)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    constructor(public navigator: NavigationService) { }

    ngOnInit() {
    }
}
