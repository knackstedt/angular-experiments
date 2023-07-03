
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
        },
        "separator",
        {
            label: "DNS Tools",
            children: [
                {
                    label: "DNS Propagation",
                    link: "https://dnspropagation.net/",
                    linkTarget: "_blank"
                },
                {
                    label: "DNS Visualization",
                    link: "https://dnsviz.net/",
                    linkTarget: "_blank"
                }
            ]
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
