import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import Atropos, { AtroposInstance } from 'atropos';
import { SharedModule } from 'src/app/shared.module';

@Component({
    selector: 'app-atropos',
    templateUrl: './atropos.component.html',
    styleUrls: ['./atropos.component.scss'],
    imports: [
        SharedModule
    ],
    standalone: true,
    encapsulation: ViewEncapsulation.None
})
export class AtroposComponent implements AfterViewInit, OnDestroy {
    @ViewChild("atropos", { static: true }) atroposRef: ElementRef
    private atropos: AtroposInstance;

    constructor() { }

    ngAfterViewInit() {
        this.atropos = Atropos({
            el: this.atroposRef.nativeElement
        });
    }
    ngOnDestroy() {
        this.atropos.destroy();
    }
}
