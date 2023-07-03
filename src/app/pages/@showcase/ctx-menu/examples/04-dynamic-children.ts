
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
            label: "Free Use Assets",
            childrenResolver: (data) => new Promise((res) => {
                setTimeout(()=> {
                    return [
                        {
                            label: "Material Icons",
                            link: "https://fonts.google.com/icons?icon.set=Material+Icons&icon.query=dashboard"
                        },
                        {
                            label: "Background Music",
                            link: "https://www.joystock.org/royalty-free-music/cinematic"
                        },
                        {
                            label: "Pattern Monster",
                            link: "https://pattern.monster/"
                        },
                        {
                            label: "Hero Patterns",
                            link: "https://heropatterns.com/"
                        }
                    ]
                }, 5000)
            }),
        }
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
