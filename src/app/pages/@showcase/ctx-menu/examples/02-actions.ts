
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
            label: "Alert",
            icon: "notifications",
            action: () => alert("You clicked the 'Alert' item")
        },
        {
            label: "Console Message",
            icon: "terminal",
            action: () => console.log("You clicked the 'Console Message' item")
        },
    ];
}`
    },
    {
        label: "template.html",
        value: `
<button [ngx-ctx-menu]="ctxMenu"></button>
`
    }
]
