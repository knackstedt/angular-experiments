import { Component } from '@angular/core';
import { RegisteredComponents } from 'src/app/component.registry';
import { NavigationService } from '../../services/navigation.service';
import { NgForOf, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    imports: [
        NgIf,
        NgForOf,
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
