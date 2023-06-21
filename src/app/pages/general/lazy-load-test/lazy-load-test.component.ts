import { Component } from '@angular/core';
import { OverlayWrapperComponent } from '../../../components/overlay-wrapper/overlay-wrapper.component';
import { NgxLazyLoaderComponent } from '@dotglitch/ngx-lazy-loader';
import { ContextMenuItem } from '@dotglitch/ngx-ctx-menu';

@Component({
    selector: 'app-lazy-load-test',
    templateUrl: './lazy-load-test.component.html',
    styleUrls: ['./lazy-load-test.component.scss'],
    imports: [
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
            action: (data) => {
            }
        },
        {
            label: "Delete",
            // shortcutLabel: "Del",
            action: (data) => {
            },
        }
    ];

    onChildButtonClicked(evt: any) {
        console.log(this, evt);
    }
}
