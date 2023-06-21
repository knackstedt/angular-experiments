import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-test-child',
    templateUrl: './test-child.component.html',
    styleUrls: ['./test-child.component.scss'],
    imports: [
    ],
    standalone: true
})
export class TestChildComponent {

    private _prop1;
    get prop1() { return this._prop1 };
    @Input() set prop1(val: number) {
        this._prop1 = val;
    };

    private _prop2;
    get prop2() { return this._prop2; };
    @Input() set prop2(val: number) {
        this._prop2 = val;

        // Automatically fire-back to parent.
        this.prop3.next(Math.random());
    };

    @Input("myExposedKey") myInternalKey: string;

    @Input() complex: Object;


    @Output() prop3 = new EventEmitter();

    @Output() buttonClicked = new EventEmitter();


    @Input() value: string;
    @Output() valueChange = new EventEmitter<string>();

    constructor() { }

    renderComplex(data) {
        // console.log(this.prop5);
        return JSON.stringify(data, null, 4);
    }
}
