import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';


const is_client = typeof window !== 'undefined';
const now = is_client
    ? () => window.performance.now()
    : () => Date.now()


type SpringOpts = {
    stiffness?: number,
    damping?: number,
    precision?: number,
    hard?: boolean,
    soft?: boolean
};

/**
 * A "spring" class derived from svelte/motion.
 */
class Spring<T = { x: number, y: number }> {
    stiffness: number;
    damping: number;
    precision: number;

    last_time!: number;

    current_value: T;
    last_value: T;
    target_value: T;

    inv_mass = 1;
    inv_mass_recovery_rate = 0;

    constructor(value: T, private opts: SpringOpts = {}, private name: string) {
        this.damping = opts?.damping || .8;
        this.stiffness = opts?.stiffness || .15;
        this.precision = opts?.precision || .1;

        this.last_value = value;
        this.target_value = value;
        this.current_value = value;
        this.set(value);
    }

    is_active = false;
    tick_interrupt = false;

    private interval!: number;
    public set(new_value: T) {
        this.target_value = new_value;
        this.is_active = true;
        this.tick_interrupt = false;

        if (this.value == null || this.opts.hard || (this.stiffness >= 1 && this.damping >= 1)) {
            if (this.interval)
                clearInterval(this.interval)

            this.last_time = now();
            this.last_value = new_value;
            return;
        }
        else if (this.opts.soft) {

        }

        if (!this.interval) {
            this.last_time = now();
            console.log("x")

            // TODO: What interval should be used?
            // @ts-ignore
            this.interval = setInterval(() => {
                console.log(".")
                const time = now();

                this.inv_mass = Math.min(this.inv_mass + this.inv_mass_recovery_rate, 1);

                const ctx = {
                    inv_mass: this.inv_mass,
                    settled: true,
                    dt: (time - this.last_time) * 60 / 1000
                };
                const next_value = this.tickSpring(ctx, this.last_value, this.value, this.target_value);

                this.last_time = time;
                this.last_value = this.value;

                if (this.tick_interrupt || ctx.settled) {
                    console.log("spring", this.name, "clearing interval")
                    this.is_active = false;
                    clearInterval(this.interval);
                    console.log('hm');
                    this.interval = 0;
                }

                return this.current_value = next_value;
            }, 10);
        }
    }

    public cancel() {
        if (this.interval)
            clearInterval(this.interval);
    }

    private tickSpring(ctx: any, last_value: any, current_value: any, target_value: any): T {
        // console.log("tick", this.name, "from", last_value, "to", current_value);
        if (typeof current_value === 'number') {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = this.stiffness * delta;
            const damper = this.damping * velocity;
            const acceleration = (spring - damper) * this.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;
            if (Math.abs(d) < this.precision && Math.abs(delta) < this.precision) {
                console.log("Spring", this.name, "has settled.");
                this.tick_interrupt = true;
                return target_value; // settled
            }
            else {
                ctx.settled = false;
                // @ts-ignore
                return current_value + d;
            }
        }
        else if (typeof current_value === 'object') {
            const next_value = {};
            for (const k in current_value) {
                // @ts-ignore
                next_value[k] = this.tickSpring(ctx, last_value[k], current_value[k], target_value[k]);
            }
            // @ts-ignore
            return next_value;
        }
        throw "Invalid Input";
    }

    public get value() {
        return this.current_value;
    }
    public get x() { return (this.value as any)['x']; }
    public get y() { return (this.value as any)['y']; }
    public get o() { return (this.value as any)['o']; }
}

const round = (num: number, fix = 3) => parseFloat(num.toFixed(fix));
const clamp = (num: number, min = -20, max = 20) => Math.min(Math.max(num, min), max);

@Component({
    selector: 'app-badge',
    templateUrl: './badge.component.html',
    styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnInit, AfterViewInit {
    @ViewChild("card") cardRef!: ElementRef;


    @Input()
    showcase = false;

    @Input()
    isInteractable = true;

    @Input()
    cardImage = "assets/badges/badge-esa-00-notinplay.png";

    @Input()
    cardTitle = "";
    
    rotator: any;
    debounce: any;
    active = false;
    interacting = false;
    firstPop = true;
    loading = true;

    readonly springR = { stiffness: 0.066, damping: 0.25 };
    readonly springD = { stiffness: 0.033, damping: 0.45 };
    springRotate = new Spring({ x: 0, y: 0 }, this.springR, "rotate");
    springGlare = new Spring({ x: 50, y: 50, o: 0 }, this.springR, "glare");
    springBackground = new Spring({ x: 50, y: 50 }, this.springR, "background");
    springRotateDelta = new Spring({ x: 0, y: 0 }, this.springD, "delta");
    springTranslate = new Spring({ x: 0, y: 0 }, this.springD, "translate");
    springScale = new Spring(1, this.springD, "scale");

    constructor() {

    }

    ngOnInit(): void {
    }
    ngAfterViewInit(): void {
        this.renderStyle();
        setInterval(this.renderStyle.bind(this), 10)
    }

    renderStyle() {
        const el = this.cardRef?.nativeElement;

        el.setAttribute("style", `
            --mx: ${this.springGlare.x}%;
            --my: ${this.springGlare.y}%;
            --tx: ${this.springTranslate.x}px;
            --ty: ${this.springTranslate.y}px;
            --s: ${this.springScale.value};
            --o: ${this.springGlare.o};
            --rx: ${this.springRotate.x + this.springRotateDelta.x}deg;
            --ry: ${this.springRotate.y + this.springRotateDelta.y}deg;
            --pos: ${this.springBackground.x}% ${this.springBackground.y}%;
            --posx: ${this.springBackground.x};
            --posy: ${this.springBackground.y};
            --hyp: ${Math.sqrt((this.springGlare.y - 50) * (this.springGlare.y - 50) + (this.springGlare.x - 50) * (this.springGlare.x - 50)) / 50};
        `);
    }

    onImageLoad() {
        this.loading = false;
    }

    // Update the springs for the card
    orientate(e: any) {

        const x = e.relative.gamma;
        const y = e.relative.beta;

        const max = { x: 16, y: 18 };
        const degrees = { x: clamp(x, -max.x, max.x), y: clamp(y, -max.y, max.y) };
        const percent = { x: 50 + (degrees.x / (max.x * 2) * 100), y: 50 + (degrees.y / (max.y * 2) * 100) };

        this.springBackground.set({
            x: round(50 + ((max.x * 2) * ((50 - -percent.x) / 100) - max.x * 2)),
            y: round(50 + ((max.y * 2) * ((50 + percent.y) / 100) - max.y * 2))
        });
        this.springRotate.stiffness = this.springR.stiffness;
        this.springRotate.damping = this.springR.damping;
        this.springRotate.set({
            x: round(degrees.x * -1),
            y: round(degrees.y)
        });
        this.springGlare.stiffness = this.springR.stiffness;
        this.springGlare.damping = this.springR.damping;
        this.springGlare.set({
            x: round(percent.x),
            y: round(percent.y),
            o: 1
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
            x: round((100 / rect.width) * absolute.x),
            y: round((100 / rect.height) * absolute.y)
        };
        const center = {
            x: percent.x - 50,
            y: percent.y - 50
        };

        this.springBackground.set({
            x: round(50 + percent.x / 4 - 12.5),
            y: round(50 + percent.y / 3 - 16.67)
        });
        this.springRotate.stiffness = this.springR.stiffness;
        this.springRotate.damping = this.springR.damping;
        this.springRotate.set({
            x: round(-(center.x / 3.5)),
            y: round(center.y / 2)
        });
        this.springGlare.stiffness = this.springR.stiffness;
        this.springGlare.damping = this.springR.damping;
        this.springGlare.set({
            x: percent.x,
            y: percent.y,
            o: 1
        });
    };

    interactEnd(e: any, delay = 500) {
        setTimeout(() => {
            this.interacting = false;
            this.springRotate.stiffness = 0.01;
            this.springRotate.damping = 0.06;
            this.springRotate.set({ x: 0, y: 0 });
            this.springGlare.stiffness = 0.01;
            this.springGlare.damping = 0.06;
            this.springGlare.set({ x: 50, y: 50, o: 0 });
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
