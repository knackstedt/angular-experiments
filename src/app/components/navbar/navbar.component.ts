import { Component } from '@angular/core';
import { RegisteredComponents } from 'src/app/component.registry';

import { MatIconModule } from '@angular/material/icon';
import { NavigationService } from '@dotglitch/ngx-common';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    imports: [
        MatIconModule
    ],
    standalone: true
})
export class NavbarComponent {

    readonly pages = RegisteredComponents
        .filter(c => !c['hidden'])
        .sort((a, b) => (a['order'] || 0) - (b['order'] || 0));

    constructor(public navigator: NavigationService) { }

}
