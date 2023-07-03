
export default [
    {
        label: "template.ts",
        value: `
import { Component } from '@angular/core';
import { ContextMenuItem, NgxCtxMenuDirective } from '@dotglitch/ngx-ctx-menu';

@Component({
    selector: 'app-example',
    templateUrl: './example.html',
    styleUrls: ['./example.scss'],
    imports: [ NgxCtxMenuDirective ],
    standalone: true
})
export class ExampleViewerComponent {

    readonly ctxMenu: ContextMenuItem[] = [
        {
            label: "Google",
            link: "www.google.com"
        },
        {
            label: "Bing",
            link: "www.bing.com"
        }
    ];
}
`
    },
    {
        label: "template.html",
        value: `
<button [ngx-ctx-menu]="ctxMenu"></button>
`
    }
]
