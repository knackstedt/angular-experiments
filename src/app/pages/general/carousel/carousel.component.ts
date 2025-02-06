
import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import SwiperCore, { Lazy, Pagination, Navigation, Virtual, Keyboard } from "swiper";
import { SwiperModule } from 'swiper/angular';

// Setup swiper providers
SwiperCore.use([Lazy, Pagination, Navigation, Virtual, Keyboard]);


const cardWidth = 400;


@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
    imports: [
    SwiperModule
],
    standalone: true,
    encapsulation: ViewEncapsulation.None
})
export class CarouselComponent {

    public images: {
        url: string,
        name: string
    }[] = [
        { url: "/assets/img/carousel/cyrillic1.png", name: "Precursor Symbol 1" },
        { url: "/assets/img/carousel/cyrillic2.png", name: "Precursor Symbol 2" },
        { url: "/assets/img/carousel/cyrillic3.png", name: "Precursor Symbol 3" },
        { url: "/assets/img/carousel/gateway.png", name: "Lava Gateway" },
        { url: "/assets/img/carousel/wallpaper.png", name: "Digital Landscape" },
    ];

    constructor() {
        this.onResize();
    }

    activeSlide = 0;
    onSlideChanged([swiper]) {
        document.querySelector("swiper").querySelectorAll(".fullscreen")
            .forEach(e => e.classList.remove('fullscreen'));
    }

    toggleFullscreen([swiper, evt]) {
        console.log(evt);
        const img = (evt.target as HTMLImageElement);

        if (img.nodeName == "IMG")
            img.parentElement.parentElement.classList.toggle("fullscreen");
        else if (img.classList.contains("cover"))
            img.parentElement.classList.toggle("fullscreen");
    }

    spaceBetween = 0;
    @HostListener("window:resize", ["$event"])
    onResize() {
        this.spaceBetween = cardWidth - (window.innerWidth - cardWidth*1.5);
    }
}
