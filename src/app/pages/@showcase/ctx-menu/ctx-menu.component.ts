import { Component, OnInit } from '@angular/core';
import { ExampleViewerComponent } from 'src/app/components/example-viewer/example-viewer.component';

import BasicExample from "./examples/00-basic";
import StylingExample from "./examples/01-styling";
import ActionExample from "./examples/02-actions";
import ChildrenExample from "./examples/03-children";
import DynamicChildrenExample from "./examples/04-dynamic-children";
import EntryContextExample from "./examples/05-entry-context";


@Component({
    selector: 'app-ctx-menu',
    templateUrl: './ctx-menu.component.html',
    styleUrls: ['./ctx-menu.component.scss'],
    imports: [
        ExampleViewerComponent,
    ],
    standalone: true
})
export class CtxMenuComponent {
    BasicExample = BasicExample;
    StylingExample = StylingExample;
    ActionExample = ActionExample;
    ChildrenExample = ChildrenExample;
    DynamicChildrenExample = DynamicChildrenExample;
    EntryContextExample = EntryContextExample;


    constructor() { }

    ngOnInit() {
    }

}
