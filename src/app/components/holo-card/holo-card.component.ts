import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Spring } from './spring';


const round = (num: number, fix = 3) => parseFloat(num.toFixed(fix));
const clamp = (num: number, min = 0, max = 100) => Math.min(Math.max(num, min), max);
const adjust = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) => {
    return round(toMin + (toMax - toMin) * (value - fromMin) / (fromMax - fromMin));
};

const altArts = [
    "swsh12pt5gg-GG35",
    "swsh12pt5gg-GG36",
    "swsh12pt5gg-GG37",
    "swsh12pt5gg-GG38",
    "swsh12pt5gg-GG39",
    "swsh12pt5gg-GG40",
    "swsh12pt5gg-GG41",
    "swsh12pt5gg-GG42",
    "swsh12pt5gg-GG43",
    "swsh12pt5gg-GG44",
    "swsh12pt5gg-GG45",
    "swsh12pt5gg-GG46",
    "swsh12pt5gg-GG47",
    "swsh12pt5gg-GG48",
    "swsh12pt5gg-GG49",
    "swsh12pt5gg-GG50",
    "swsh12pt5gg-GG51",
    "swsh12pt5gg-GG52",
    "swsh12pt5gg-GG53",
    "swsh12pt5gg-GG54",
    "swsh12pt5gg-GG55",
    "swsh12pt5gg-GG56",
    "swsh12-177",
    "swsh12-181",
    "swsh12-184",
    "swsh12-186",
    "swsh12tg-TG12",
    "swsh12tg-TG13",
    "swsh12tg-TG14",
    "swsh12tg-TG15",
    "swsh12tg-TG16",
    "swsh12tg-TG17",
    "swsh12tg-TG18",
    "swsh12tg-TG19",
    "swsh12tg-TG20",
    "swsh12tg-TG21",
    "swsh12tg-TG22",
    "swsh11-177",
    "swsh11-180",
    "swsh11-186",
    "swsh11tg-TG12",
    "swsh11tg-TG13",
    "swsh11tg-TG14",
    "swsh11tg-TG15",
    "swsh11tg-TG16",
    "swsh11tg-TG17",
    "swsh11tg-TG18",
    "swsh11tg-TG19",
    "swsh11tg-TG20",
    "swsh11tg-TG21",
    "swsh11tg-TG22",
    "pgo-72",
    "pgo-74",
    "swsh10-161",
    "swsh10-163",
    "swsh10-167",
    "swsh10-172",
    "swsh10-175",
    "swsh10-177",
    "swsh10tg-TG13",
    "swsh10tg-TG14",
    "swsh10tg-TG15",
    "swsh10tg-TG16",
    "swsh10tg-TG17",
    "swsh10tg-TG18",
    "swsh10tg-TG19",
    "swsh10tg-TG20",
    "swsh10tg-TG21",
    "swsh10tg-TG22",
    "swsh10tg-TG23",
    "swsh9-154",
    "swsh9-156",
    "swsh9-162",
    "swsh9-166",
    "swsh9tg-TG13",
    "swsh9tg-TG14",
    "swsh9tg-TG15",
    "swsh9tg-TG16",
    "swsh9tg-TG17",
    "swsh9tg-TG18",
    "swsh9tg-TG19",
    "swsh9tg-TG20",
    "swsh9tg-TG21",
    "swsh9tg-TG22",
    "swsh9tg-TG23",
    "swsh8-245",
    "swsh8-251",
    "swsh8-252",
    "swsh8-255",
    "swsh8-257",
    "swsh8-266",
    "swsh8-269",
    "swsh8-270",
    "swsh8-271",
    "swsh7-167",
    "swsh7-175",
    "swsh7-180",
    "swsh7-182",
    "swsh7-184",
    "swsh7-186",
    "swsh7-189",
    "swsh7-192",
    "swsh7-194",
    "swsh7-196",
    "swsh7-198",
    "swsh7-205",
    "swsh7-209",
    "swsh7-212",
    "swsh7-215",
    "swsh7-218",
    "swsh7-220",
    "swsh6-164",
    "swsh6-166",
    "swsh6-168",
    "swsh6-170",
    "swsh6-172",
    "swsh6-174",
    "swsh6-177",
    "swsh6-179",
    "swsh6-183",
    "swsh6-185",
    "swsh6-201",
    "swsh6-203",
    "swsh6-205",
    "swsh5-146",
    "swsh5-151",
    "swsh5-153",
    "swsh5-155",
    "swsh5-168",
    "swsh5-170",
    "swshp-SWSH179",
    "swshp-SWSH180",
    "swshp-SWSH181",
    "swshp-SWSH182",
    "swshp-SWSH183",
    "swshp-SWSH184",
    "swshp-SWSH204",
    "swshp-SWSH260",
    "swshp-SWSH261",
    "swshp-SWSH262"
];

@Component({
    selector: 'app-holo-card',
    templateUrl: './holo-card.component.html',
    styleUrls: ['./holo-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true
})
export class HoloCardComponent implements OnInit, AfterViewInit {
    @ViewChild("card") cardRef!: ElementRef;

    // https://poke-holo.b-cdn.net/foils/swsh11/masks/upscaled/tg30_foil_etched_swsecret_2x.webp

    @Input() number: string;
    @Input() id: string;
    @Input() set: string;
    @Input() types: string[] = [];
    @Input() subtypes: string[] = ["basic"];
    @Input() supertype: string = "pokémon";
    @Input() rarity: string = "common";
    @Input() trainerGallery: string;
    @Input() img: string;
    @Input() foil: string;
    @Input() mask: string;
    @Input() isReverse = false;

    private _width = 245;
    @Input() set width(val) {
        this._width = val;
        this.updateBounds();
    };
    private _height = 340;
    @Input() set height(val) {
        this._height = val;
        this.updateBounds();
    };

    @Input()
    showcase = false;

    @Input()
    isInteractable = true;

    @Input()
    cardTitle = "FOOBAR";


    randomSeed = {
        x: Math.random(),
        y: Math.random()
    };

    cosmosPosition = {
        x: Math.floor(this.randomSeed.x * 734),
        y: Math.floor(this.randomSeed.y * 1280)
    };

    rotator: any;
    debounce: any;
    active = false;
    interacting = false;
    firstPop = true;
    loading = true;

    readonly springInteractSettings = { stiffness: 0.066, damping: 0.25 };
    readonly springPopoverSettings = { stiffness: 0.033, damping: 0.45 };
    springRotate = new Spring({ x: 0, y: 0 }, this.springInteractSettings, "rotate", this.renderStyle.bind(this));
    springGlare = new Spring({ x: 50, y: 50, o: 0 }, this.springInteractSettings, "glare", this.renderStyle.bind(this));
    springBackground = new Spring({ x: 50, y: 50 }, this.springInteractSettings, "background", this.renderStyle.bind(this));
    springRotateDelta = new Spring({ x: 0, y: 0 }, this.springPopoverSettings, "delta", this.renderStyle.bind(this));
    springTranslate = new Spring({ x: 0, y: 0 }, this.springPopoverSettings, "translate", this.renderStyle.bind(this));
    springScale = new Spring(1, this.springPopoverSettings, "scale", this.renderStyle.bind(this));

    constructor(private container: ViewContainerRef) {
        this.updateBounds();
    }
    private updateBounds() {
        const el = this.container?.element?.nativeElement;
        if (el) {
            el.style['width'] = this._width + 'px';
            el.style['height'] = this._height + 'px';
        }
    }

    getImage(img) {
        if (img.startsWith('https'))
            return img;
        return `https://images.pokemontcg.io` + img;
    }

    cardImage() {
        if (!!this.img) {
            return this.img;
        }
        if (!!this.set && !!this.number) {
            return `https://images.pokemontcg.io/${this.set.toLowerCase()}/${this.number}_hires.png`;
        }
        return "";
    }

    foilMaskImage(prop, type = "masks") {
        const server = "https://poke-holo.b-cdn.net";
        /**
         * Shiny Vault Card (starts with sv)
         */
        const isShiny = !!this.number && this.number.toLowerCase().startsWith("sv");
        /**
         Trainer / Galar Gallery Card (not shiny)
         */
        const isGallery = !!this.number && !!this.number.match(/^[tg]g/i);
        /**
         Alternate Art Card (not shiny / gallery)
         */
        const isAlternate = !!this.id && altArts.includes(this.id.toString()) && !isShiny && !isGallery;

        let etch = "holo";
        let style = "reverse";
        let ext = "webp";

        // if (!!prop) {
        //     if (prop === false) {
        //         return "";
        //     }
        //     return prop;
        // }

        if (!(this.rarity) || !(this.subtypes) || !(this.supertype) || !(this.set) || !(this.number)) {
            return "";
        }

        const fRarity = this.rarity.toLowerCase();
        const fNumber = this.number.toString().toLowerCase().replace("swsh", "").padStart(3, "0");
        const fSet = this.set.toString().toLowerCase().replace("tg", "").replace("sv", "");

        if (fRarity === "rare holo") {
            style = "swholo";
        }

        if (fRarity === "rare holo cosmos") {
            style = "cosmos";
        }

        if (fRarity === "radiant rare") {
            etch = "etched";
            style = "radiantholo";
        }

        if (fRarity === "rare holo v") {
            etch = "holo";
            style = "sunpillar";
        }

        if (fRarity === "rare holo vmax" || fRarity === "rare ultra" || fRarity === "rare holo vstar") {
            etch = "etched";
            style = "sunpillar";
        }

        if (fRarity === "amazing rare" || fRarity === "rare rainbow" || fRarity === "rare secret") {
            etch = "etched";
            style = "swsecret";
        }

        if (isShiny) {

            etch = "etched";
            style = "sunpillar";

            if (fRarity === "rare shiny v" || (fRarity === "rare holo v" && fNumber.startsWith("sv"))) {
                this.rarity = "Rare Shiny V";
            }

            if (fRarity === "rare shiny vmax" || (fRarity === "rare holo vmax" && fNumber.startsWith("sv"))) {
                style = "swsecret";
                this.rarity = "Rare Shiny VMAX";
            }

        }

        if (isGallery) {

            etch = "holo";
            style = "rainbow";

            if (fRarity.includes("rare holo v") || fRarity.includes("rare ultra")) {

                etch = "etched";
                style = "sunpillar";

            }

            if (fRarity.includes("rare secret")) {

                etch = "etched";
                style = "swsecret";

            }

        }

        if (isAlternate) {

            etch = "etched";

            if (this.subtypes.includes("VMAX")) {

                style = "swsecret";
                this.rarity = "Rare Rainbow Alt";

            } else {

                style = "sunpillar";

            }

        }

        return `${server}/foils/${fSet}/${type}/upscaled/${fNumber}_foil_${etch}_${style}_2x.${ext}`;

    }

    foilImage() {
        return this.foilMaskImage(this.foil, "foils");
    }

    maskImage() {
        return this.foilMaskImage(this.mask, "masks");
    }

    ngOnInit(): void {
    }
    ngAfterViewInit(): void {
        const el = this.cardRef?.nativeElement as HTMLElement;
        el.querySelector(".card__front").setAttribute("style", `
            --seedx: ${this.randomSeed.x};
            --seedy: ${this.randomSeed.y};
            --cosmosbg: ${this.cosmosPosition.x}px ${this.cosmosPosition.y}px;
            ${this.mask ? `--mask: url(${this.maskImage()});` : ''}
            ${this.foil ? `--foil: url(${this.foilImage()});` : ''}
        `)

        this.renderStyle();
    }

    renderStyle() {
        const el = this.cardRef?.nativeElement as HTMLElement;

        el.setAttribute("style", `
            --pointer-x: ${this.springGlare.x}%;
            --pointer-y: ${this.springGlare.y}%;
            --pointer-from-center: ${clamp(Math.sqrt(
                (this.springGlare.y - 50) * (this.springGlare.y - 50) +
                (this.springGlare.x - 50) * (this.springGlare.x - 50)
            ) / 50, 0, 1)};
            --pointer-from-top: ${this.springGlare.y / 100};
            --pointer-from-left: ${this.springGlare.x / 100};
            --card-opacity: ${this.springGlare.o};
            --rotate-x: ${this.springRotate.x + this.springRotateDelta.x}deg;
            --rotate-y: ${this.springRotate.y + this.springRotateDelta.y}deg;
            --background-x: ${this.springBackground.x}%;
            --background-y: ${this.springBackground.y}%;
            --card-scale: ${1};
            --translate-x: ${this.springTranslate.x}px;
            --translate-y: ${this.springTranslate.y}px;
        `);

        if (this.number == "116")
            console.log("render css")
    }

    onImageLoad() {
        this.loading = false;
    }

    // Update the springs for the card
    orientate(e: any) {

        const x = e.relative.gamma;
        const y = e.relative.beta;
        const limit = { x: 16, y: 18 };

        const degrees = {
            x: clamp(x, -limit.x, limit.x),
            y: clamp(y, -limit.y, limit.y)
        };

        this.updateSprings({
            x: adjust(degrees.x, -limit.x, limit.x, 37, 63),
            y: adjust(degrees.y, -limit.y, limit.y, 33, 67),
        }, {
            x: round(degrees.x * -1),
            y: round(degrees.y),
        }, {
            x: adjust(degrees.x, -limit.x, limit.x, 0, 100),
            y: adjust(degrees.y, -limit.y, limit.y, 0, 100),
            o: 1,
        });
    }

    interact(e: MouseEvent) {
        if (!this.isInteractable) return;

        this.interacting = true;

        if (e.type === "touchmove") {
            // @ts-ignore
            e.clientX = e.touches[0].clientX;
            // @ts-ignore
            e.clientY = e.touches[0].clientY;
        }

        const $el = e.target as HTMLElement;
        const rect = $el.getBoundingClientRect(); // get element's current size/position

        const absolute = {
            x: e.clientX - rect.left, // get mouse position from left
            y: e.clientY - rect.top // get mouse position from right
        };
        const percent = {
            x: clamp(round((100 / rect.width) * absolute.x)),
            y: clamp(round((100 / rect.height) * absolute.y))
        };
        const center = {
            x: percent.x - 50,
            y: percent.y - 50
        };

        this.updateSprings({
            x: adjust(percent.x, 0, 100, 37, 63),
            y: adjust(percent.y, 0, 100, 33, 67),
        }, {
            x: round(-(center.x / 3.5)),
            y: round(center.y / 2),
        }, {
            x: round(percent.x),
            y: round(percent.y),
            o: 1,
        });
    };

    updateSprings(background, rotate, glare) {

        this.springBackground.stiffness = this.springInteractSettings.stiffness;
        this.springBackground.damping = this.springInteractSettings.damping;
        this.springRotate.stiffness = this.springInteractSettings.stiffness;
        this.springRotate.damping = this.springInteractSettings.damping;
        this.springGlare.stiffness = this.springInteractSettings.stiffness;
        this.springGlare.damping = this.springInteractSettings.damping;

        this.springBackground.set(background);
        this.springRotate.set(rotate);
        this.springGlare.set(glare);
    }

    interactEnd(e: any, delay = 500) {
        setTimeout(() => {
            this.interacting = false;

            this.springRotate.stiffness = 0.01;
            this.springRotate.damping = 0.06;
            this.springRotate.set({ x: 0, y: 0 });

            this.springGlare.stiffness = 0.01;
            this.springGlare.damping = 0.06;
            this.springGlare.set({ x: 50, y: 50, o: 0 });

            this.springBackground.stiffness = 0.01;
            this.springBackground.damping = 0.06;
            this.springBackground.set({ x: 50, y: 50 });
        }, delay);
    };

    touchEnd(e: any, delay: any) {
        this.deactivate();
        this.interactEnd(e, delay);
    }

    timer: any;
    activate(e: any) {
        const isTouch = e.pointerType === "touch";
        if (isTouch) {
            this.resetBaseOrientation(e);
        }
        this.active = true;

        // Clear any previous timers.
        if (this.timer != 0)
            clearInterval(this.timer);

        this.timer = setInterval(() => {
            this.renderStyle();

            if (this.timer && !(this.springScale.is_active)) {
                clearInterval(this.timer);
                this.timer = 0;
            }
        }, 10);
    }

    deactivate(e?: any) {
        this.interactEnd(e);
        this.active = false;

        clearInterval(this.timer);
    }

    reposition(e?: any) {
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
            if (this.active)
                this.setCenter();
        }, 300);
    }

    setCenter() {
        const rect = this.cardRef.nativeElement.getBoundingClientRect(); // get element's size/position
        const view = document.documentElement; // get window/viewport size

        const delta = {
            x: round(view.clientWidth / 2 - rect.x - rect.width / 2),
            y: round(view.clientHeight / 2 - rect.y - rect.height / 2)
        };
        this.springTranslate.set({
            x: delta.x,
            y: delta.y
        });
    };

    popover() {
        const rect = this.cardRef.nativeElement.getBoundingClientRect(); // get element's size/position
        let delay = 100;
        let scaleW = (window.innerWidth / rect.width) * 0.9;
        let scaleH = (window.innerHeight / rect.height) * 0.9;
        let scaleF = 1.75;
        this.setCenter();
        if (this.firstPop) {
            delay = 1000;
            this.springRotateDelta.set({
                x: 360,
                y: 0
            });
        }
        this.firstPop = false;
        this.springScale.set(Math.min(scaleW, scaleH, scaleF));
        this.interactEnd(null, delay);
    }

    retreat() {
        this.springTranslate.set({
            x: 0,
            y: 0
        });
        this.springRotateDelta.set({
            x: 0,
            y: 0
        });
        this.springScale.set(1);
        this.interactEnd(null, 100);
    }

    resetBaseOrientation(e?: any) {
        // const getRawOrientation = function (e) {
        //     if (!e) {
        //         return { alpha: 0, beta: 0, gamma: 0 };
        //     } else {
        //         return { alpha: e.alpha, beta: e.beta, gamma: e.gamma };
        //     }
        // }

        // const getOrientationObject = (e) => {
        //     const orientation = getRawOrientation(e);
        //     return {
        //         absolute: orientation,
        //         relative: {
        //             alpha: orientation.alpha - baseOrientation.alpha,
        //             beta: orientation.beta - baseOrientation.beta,
        //             gamma: orientation.gamma - baseOrientation.gamma,
        //         }
        //     }
        // }
        // baseOrientation = getRawOrientation();

    }









    firstReading = true;
    baseOrientation: any = null;
    currentOrientation: any = null;
    getRawOrientation(e?: any) {
        if (!e) {
            return { alpha: 0, beta: 0, gamma: 0 };
        } else {
            return { alpha: e.alpha, beta: e.beta, gamma: e.gamma };
        }
    }

    getOrientationObject(e?: any) {
        const orientation = this.getRawOrientation(e);
        return {
            absolute: orientation,
            relative: {
                alpha: orientation.alpha - this.baseOrientation.alpha,
                beta: orientation.beta - this.baseOrientation.beta,
                gamma: orientation.gamma - this.baseOrientation.gamma,
            }
        }
    }

    @HostListener('window:deviceorientation', ['$event'])
    handleOrientation(e: any) {

        if (this.firstReading) {
            this.firstReading = false;
            this.baseOrientation = this.getRawOrientation(e);
            // console.log("Starting Orientation from: ", baseOrientation );
        }

        const o = this.getOrientationObject(e);
        // console.log("Setting Orientation to: ", o );
        this.currentOrientation = o;
    }
}
