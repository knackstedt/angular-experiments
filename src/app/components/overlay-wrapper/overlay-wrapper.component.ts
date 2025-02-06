
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-overlay-wrapper',
  templateUrl: './overlay-wrapper.component.html',
  styleUrls: ['./overlay-wrapper.component.scss'],
  imports: [],
  standalone: true
})
export class OverlayWrapperComponent implements AfterViewInit {
    @ViewChild("container") containerRef: ElementRef;

    constructor() { }

    ngAfterViewInit() {
        const el = this.containerRef.nativeElement;

        //OPEN TRIGGER
        let openTrigger = el.querySelector('.menu-trigger') as HTMLElement;
        let openTriggerTop = openTrigger.querySelector('.menu-trigger-bar.top') as HTMLElement;
        let openTriggerMiddle = openTrigger.querySelector('.menu-trigger-bar.middle') as HTMLElement;
        let openTriggerBottom = openTrigger.querySelector('.menu-trigger-bar.bottom') as HTMLElement;

        //CLOSE TRIGGER
        let closeTrigger = el.querySelector('.close-trigger') as HTMLElement;
        let closeTriggerLeft = closeTrigger.querySelector('.close-trigger-bar.left') as HTMLElement;
        let closeTriggerRight = closeTrigger.querySelector('.close-trigger-bar.right') as HTMLElement;

        //LOGO
        let logo = el.querySelector('.logo') as HTMLElement;

        //MENU
        let menu = el.querySelector('.menu') as HTMLElement;
        let menuTop = el.querySelector('.menu-bg.top') as HTMLElement;
        let menuMiddle = el.querySelector('.menu-bg.middle') as HTMLElement;
        let menuBottom = el.querySelector('.menu-bg.bottom') as HTMLElement;

        //TL
        let tlOpen = gsap.timeline({
            paused: true
        });
        let tlClose = gsap.timeline({
            paused: true
        });

        //OPEN TIMELINE
        tlOpen
            .add("preOpen")
            .to(logo, {
                duration: 0.4,
                scale: 0.8,
                opacity: 0,
                ease: "power2.easeOut"
            }, "preOpen")
            .to(openTriggerTop, {
                duration: 0.4,
                x: "+80px",
                y: "-80px",
                delay: 0.1,
                ease: "power4.easeIn",
                onComplete: function () {
                    closeTrigger.style['z-index'] = '25';
                }
            }, "preOpen")
            .to(openTriggerMiddle, {
                duration: 0.4,
                x: "+=80px",
                y: "-=80px",
                ease: "power4.easeIn",
                onComplete: function () {
                    openTrigger.style['visibility'] = 'hidden';
                }
            }, "preOpen")
            .to(openTriggerBottom, {
                duration: 0.4,
                x: "+=80px", y: "-=80px", delay: 0.2, ease: "power4.easeIn"
            }, "preOpen")

            .add("open", "-=0.4")
            .to(menuTop, {
                duration: 0.8,
                bottom: "25%",
                right: "25%",
                left: "-75%",
                top: "-75%",
                ease: "power4.inOut"
            }, "open")
            .to(menuMiddle, {
                duration: 0.8,
                scaleX: 1,
                ease: "power4.inOut"
            }, "open")
            .to(menuBottom, {
                duration: 0.8,
                top: "25%",
                left: "25%",
                right: "-75%",
                bottom: "-75%",
                ease: "power4.inOut"
            }, "open")
            .fromTo(menu, {
                duration: 0.6,
                y: 30,
                opacity: 0,
                visibility: 'hidden'
            },
                {
                    y: 0,
                    opacity: 1,
                    visibility: 'visible',
                    ease: "power4.out"
                },
                "-=0.2")

            .add("preClose", "-=0.8")
            .to(closeTriggerLeft, {
                duration: 0.8,
                x: "-=100px",
                y: "+=100px",
                ease: "power4.easeOut"
            }, "preClose")
            .to(closeTriggerRight, {
                duration: 0.8,
                x: "+=100px",
                y: "+=100px",
                delay: 0.2,
                ease: "power4.easeOut"
            }, "preClose");


        //CLOSE TIMELINE
        tlClose
            .add("close")
            .to(menuTop, {
                duration: 0.2,
                backgroundColor: "#6295ca",
                ease: "power4.inOut",
                onComplete: function () {
                    logo.style['z-index'] = '26';
                    closeTrigger.style['z-index'] = '5';
                    openTrigger.style['visibility'] = 'visible';
                }
            }, "close")
            .to(menuMiddle, {
                duration: 0.2,
                backgroundColor: "#6295ca",
                ease: "power4.inOut"
            }, "close")
            .to(menuBottom, {
                duration: 0.2,
                backgroundColor: "#6295ca",
                ease: "power4.inOut"
            }, "close")
            .to(menu, {
                duration: 0.6,
                y: 20,
                opacity: 0,
                ease: "power4.easeOut",
                onComplete: function () {
                    menu.style['visibility'] = 'hidden';
                }
            }, "close")
            .to(logo, {
                duration: 0.8,
                delay: "+=0.2",
                scale: 1,
                opacity: 1,
                ease: "power4.inOut",
            }, "close")
            .to(menuTop, {
                duration: 0.8,
                delay: "+=0.2",
                bottom: "100%",
                right: "100%",
                left: "-50%",
                top: "-50%",
                ease: "power4.inOut"
            }, "close")
            .to(menuMiddle, {
                duration: 0.8,
                delay: "+=0.2",
                scaleX: 0,
                ease: "power4.inOut"
            }, "close")
            .to(menuBottom, {
                duration: 0.8,
                delay: "+=0.2",
                bottom: "-50%",
                right: "-50%",
                left: "100%",
                top: "100%",
                ease: "power4.inOut",
                onComplete: function () {
                    menuTop.style['background-color'] = '#ffffff';
                    menuMiddle.style['background-color'] = '#ffffff';
                    menuBottom.style['background-color'] = '#ffffff';
                }
            }, "close")
            .to(closeTriggerLeft, {
                duration: 0.2,
                x: "+=100px",
                y: "-=100px",
                ease: "power4.easeIn"
            }, "close")
            .to(closeTriggerRight, {
                duration: 0.2,
                x: "-=100px",
                y: "-=100px",
                delay: 0.1,
                ease: "power4.easeIn"
            }, "close")
            .to(openTriggerTop, {
                duration: 1,
                x: "-=80px",
                y: "+=80px",
                delay: 0.2,
                ease: "power4.easeOut"
            }, "close")
            .to(openTriggerMiddle, {
                duration: 1,
                x: "-=80px",
                y: "+=80px",
                ease: "power4.easeOut"
            }, "close")
            .to(openTriggerBottom, {
                duration: 1,
                x: "-=80px",
                y: "+=80px",
                delay: 0.1,
                ease: "power4.easeOut"
            }, "close");


        //EVENTS
        openTrigger.onclick = function () {
            if (tlOpen.progress() < 1) {
                tlOpen.play();
            } else {
                tlOpen.restart();
            }
        };

        closeTrigger.onclick = function () {
            if (tlClose.progress() < 1) {
                tlClose.play();
            } else {
                tlClose.restart();
            }
        };
    }

}
