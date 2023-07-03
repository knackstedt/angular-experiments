
export default [
    {
        label: "template.ts",
        value: `
import { Component, NgForOf } from '@angular/core';
import { ContextMenuItem, NgxCtxMenuDirective } from '@dotglitch/ngx-ctx-menu';

type Entry = {
    name: string,
    value: number,
    color: string
}

@Component({
    selector: 'app-example',
    templateUrl: './example.html',
    styleUrls: ['./example.scss'],
    imports: [ NgForOf, NgxCtxMenuDirective ],
    standalone: true
})
export class ExampleViewerComponent {

    readonly entries: Entry[] = [
        {
            name: "Apple",
            value: 55,
            color: "red"
        }
        {
            name: "Banana",
            value: 72,
            color: "yellow"
        }
        {
            name: "Lemon",
            value: 485,
            color: "yellow"
        }
        {
            name: "Coconut",
            value: 37,
            color: "brown"
        }
        {
            name: "Kiwi",
            value: 0,
            color: "green"
        }
    ]

    readonly ctxMenu: ContextMenuItem<Entry>[] = [
        {
            labelTemplate: item => "Edit " + item.name,
            action: item => alert("Editing item\m" + JSON.stringify(item, null, 4))
        },
        {
            label: "Delete",
            action: async item => {
                console.log(item);
            }
        }
    ];
}`
    },
    {
        label: "template.html",
        value: `
<button *ngFor="let entry of entries" [ngx-ctx-menu]="ctxMenu" [ngx-ctx-menu-context]="entry">Item {{entry.name}}</button>
`
    }
]
