import { Component, AfterViewInit, HostListener, ContentChild, TemplateRef, ElementRef, ViewChild, Input, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-popup-card',
    templateUrl: './popup-card.component.html',
    styleUrls: ['./popup-card.component.scss'],
    imports: [
        CommonModule
    ],
    standalone: true
})
export class PopupCardComponent implements AfterViewInit {
    @ContentChild("preview", { read: TemplateRef }) preview: TemplateRef<any>;
    @ContentChild("details", { read: TemplateRef }) details: TemplateRef<any>;

    @ViewChild('container') postRef: ElementRef;

    @Input() expandWidth = 920;
    @Input() expandHeight = 800;

    @Input() blurBackground = true;

    expand = false;

    constructor() {
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.onResize();
        }, 1000);
    }

    movePopupToCenter() {
        const areaElem = document.querySelector("body .main>.content");
        const bounds: DOMRect = areaElem.getBoundingClientRect();

        const width = this.expandWidth;
        const height = this.expandHeight;

        const targetX = ((bounds.width / 2)  - (width / 2)) + bounds.x;
        const targetY = ((bounds.height / 2) - (height / 2)) + (bounds.y);

        const translate = `translate3d(${targetX}px, ${targetY}px, 0px)`;

        setTimeout(() => {
            this.popupTransform = translate;
            this.popupWidth = width + "px";
            this.popupHeight = height + "px";
        }, 100);
    }

    popupWidth: string;
    popupHeight: string;
    popupTransform: string;
    movePopupToCard() {
        const areaElem = document.querySelector("body .main>.content");
        const bounds: DOMRect = areaElem.getBoundingClientRect();

        const cardBounds: DOMRect = this.postRef.nativeElement.getBoundingClientRect();

        const x = (cardBounds.x - bounds.x) + bounds.x;
        const y = (cardBounds.y - bounds.y) + bounds.y;

        this.popupWidth = cardBounds.width + 'px';
        this.popupHeight = cardBounds.height + 'px';
        this.popupTransform = `translate3d(${x}px, ${y}px, 0px)`;
    }

    open() {
        this.expand = true;
        this.movePopupToCard();
        this.movePopupToCenter();

        // setTimeout(() => {
        // }, 300);
    }

    animatingOut = false;
    close() {
        this.animatingOut = true;
        // this.cardRef.nativeElement.style['transform'] = 'translate3d(0px, 0px, 0px)';

        this.movePopupToCard();

        setTimeout(() => {
            this.animatingOut = false;
            this.expand = false;
        }, 300);
    }

    @HostListener("window:resize")
    onResize() {
        this.expand ? this.movePopupToCenter() : this.movePopupToCard();
    }
}
