import { Component } from '@angular/core';
import { ContextMenuItem } from 'src/app/directives/context-menu.directive';
import { SharedModule } from 'src/app/shared.module';
import { OverlayWrapperComponent } from '../../../components/overlay-wrapper/overlay-wrapper.component';
import { NgxLazyLoaderComponent } from '@dotglitch/ngx-lazy-loader';

@Component({
    selector: 'app-lazy-load-test',
    templateUrl: './lazy-load-test.component.html',
    styleUrls: ['./lazy-load-test.component.scss'],
    imports: [
        SharedModule,
        OverlayWrapperComponent,
        NgxLazyLoaderComponent
    ],
    standalone: true
})
export class LazyLoadTestComponent {

    constructor() {
        setInterval(() => {
            this.value1++;
        }, 500);

        setInterval(() => {
            this.value2 += 1000;
        }, 7000);
    }

    value1 = 4000;
    value2 = 270000;

    complicated = {
        a: 1,
        b: 2,
        "c": "lorem ipsum",
        0: false,
        1: [1,'2','a', 'b']
    }

    onOutputFire(e) {
        console.log("An output has fired", e);
    }

    cardContextMenu: ContextMenuItem<any>[] = [
        {
            label: "Edit",
            action: (evt, data) => {
            }
        },
        {
            label: "Delete",
            // shortcutLabel: "Del",
            action: (evt, data) => {
            },
        }
    ];

    onChildButtonClicked(evt: any) {
        console.log(this, evt);
    }
}
