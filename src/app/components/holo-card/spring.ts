const is_client = typeof window !== 'undefined';
const now = is_client
    ? () => window.performance.now()
    : () => Date.now();


type SpringOpts = {
    stiffness?: number,
    damping?: number,
    precision?: number,
    hard?: boolean,
    soft?: boolean;
};

/**
 * A "spring" class derived from svelte/motion.
 */
export class Spring<T = { x: number, y: number; }> {
    stiffness: number;
    damping: number;
    precision: number = 0.001;

    last_time!: number;

    current_value: T;
    last_value: T;
    target_value: T;

    inv_mass = 1;
    inv_mass_recovery_rate = 0;

    constructor(value: T, private opts: SpringOpts = {}, private name: string, private onUpdate) {
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
                clearInterval(this.interval);

            this.last_time = now();
            this.last_value = new_value;
            return;
        }
        else if (this.opts.soft) {

        }

        if (!this.interval) {
            this.last_time = now();

            // TODO: What interval should be used?
            // @ts-ignore
            this.interval = setInterval(() => {
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

                // If an interrupt was sent or the spring is settled
                if (this.tick_interrupt || ctx.settled) {
                    this.is_active = false;
                    clearInterval(this.interval);
                    this.interval = 0;
                }

                // Send an update event
                if (this.onUpdate)
                    this.onUpdate();

                return this.current_value = next_value;
            }, 20);
        }
    }

    public cancel() {
        if (this.interval)
            clearInterval(this.interval);
    }

    private tickSpring(ctx: any, last_value: any, current_value: any, target_value: any): T {
        if (typeof current_value === 'number') {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = this.stiffness * delta;
            const damper = this.damping * velocity;
            const acceleration = (spring - damper) * this.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;

            // Check if the spring is settled
            if (Math.abs(d) < this.precision && Math.abs(delta) < this.precision) {

                clearInterval(this.interval);
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
