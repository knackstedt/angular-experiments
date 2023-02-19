import { Input, ViewContainerRef, isDevMode, ComponentRef, OnDestroy, EventEmitter, Optional, ViewChild, Component, AfterViewInit, Inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, Subscription } from 'rxjs';
import { RegisteredComponents } from 'src/app/component.registry';
import { DialogRef } from '@angular/cdk/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Logger } from 'src/app/utils';

/**
 * ! Here be dragons.
 * Only the bravest of Adventurers can survive the battles below,
 * and they must be trained and ready for the gruelling journey ahead.
 * Many a soul has tried to best these Dragons, yet only one has
 * succeeded since our founding.
 *
 * TL;DR -- Don't mess with this unless you know what you're doing.
 *     This is central to a ton of moving parts -- breaking it will
 *     cause more collateral damage than you may realize.
 */

// A proxied registry that mutates reference keys
export const ComponentRegistry = RegisteredComponents.map(c => ({
    ...c,
    id: c.id.toLowerCase()
        .replace(/[^a-z0-9]/g, '') // purge non-basic ASCII chars
}));

export const checkIfLazyComponentExists = (id: string) => {
    return true;
};

const { log, warn, err } = Logger("LazyLoader", "#009688");

@Component({
    selector: 'lazy-loader',
    templateUrl: './lazy-loader.component.html',
    styleUrls: ['./lazy-loader.component.scss'],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatButtonModule
    ],
    standalone: true
})
export class LazyLoaderComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild("content", { read: ViewContainerRef }) container: ViewContainerRef;

    private _id: string;
    /**
     * The id of the component that will be lazy loaded
     */

    @Input("component") set id(id: string) {
        if (this._id) {
            // clear
            this.container.remove();
        }
        this._id = id;
    };

    private _inputs: { [key: string]: any; };
    /**
     * A map of inputs to bind to the child.
     * Supports change detection. (May fail on deep JSON changes)
     *
     * ```html
     * <lazy-loader
     *     component="MyLazyComponent"
     *     [inputs]="{
     *        prop1: true,
     *        prop2: false,
     *        complex: {
     *            a: true,
     *            b: 0
     *        }
     *     }"
     * >
     * </lazy-loader>
     * ```
     */
    @Input("inputs") set inputs(data: { [key: string]: any; }) {
        if (data == undefined) return;

        let previous = this._inputs;
        this._inputs = data;
        if (data == undefined)
            console.trace(data);

        if (this.component) {
            const { inputs } = this.component.ɵcmp;

            const currentKeys = Object.keys(inputs);
            const removed = Object.keys(previous).filter(key => !currentKeys.includes(key));

            // ? perhaps set to null or undefined instead
            removed.forEach(k => delete this.instance[k]);

            this.bindInputs();
        }
    }


    private outputSubscriptions: { [key: string]: Subscription; } = {};
    private _outputs: { [key: string]: Function; };
    /**
     * A map of outputs to bind from the child.
     * Should support change detection.
     * ```html
     * <lazy-loader
     *     component="MyLazyComponent"
     *     [outputs]="{
     *         prop3: onOutputFire
     *     }"
     * >
     * </lazy-loader>
     * ```
     */
    @Input("outputs") set outputs(data: { [key: string]: Function; }) {
        let previous = this._outputs;
        this._outputs = data;

        if (this.component) {
            const { inputs } = this.component.ɵcmp;

            const currentKeys = Object.keys(inputs);
            const removed = Object.keys(previous).filter(key => !currentKeys.includes(key));

            removed.forEach(k => {
                // Unsubscribe from observable
                this.outputSubscriptions[k]?.unsubscribe();
                delete this.instance[k];
            });

            this.bindOutputs();
        }
    }

    /**
     * Context that the outputs execute in
     *
     * TODO: resolve context binding loss
     */
    @Input("parent") parentContext: Object;


    /**
     * Emits errors encountered when loading components
     */
    @Output() componentLoadError = new EventEmitter();

    /**
     * Emits when the component is fully constructed
     * and had it's inputs and outputs bound
     * > before `OnInit`
     *
     * Returns the active class instance of the lazy-loaded component
     */
    @Output() componentLoaded = new EventEmitter();


    /**
     * Container that provides the component data
     */
    private module: any;

    /**
     * Component definition
     */
    private component: any;

    /**
     * Active component container reference
     */
    private componentRef: ComponentRef<any>;

    /**
     * Reference to the running component
     */
    private instance: any;

    isDestroyingDistractor = false;
    isDistractorVisible = true;

    /**
     * Subscription with true/false state on whether the distractor should be
     */
    private distractorSubscription: Subscription;

    constructor(
        @Optional() private viewContainerRef: ViewContainerRef,
        @Optional() public dialog: DialogRef,
        @Optional() @Inject(MAT_DIALOG_DATA) public dialogArguments
    ) { }

    ngOnInit() {
        this.showSpinner();
    }

    async ngAfterViewInit() {

        // First, check for dialog arguments
        if (this.dialogArguments) {
            this.inputs = this.dialogArguments.data?.inputs || this.dialogArguments.data;
            this.outputs = this.dialogArguments.data?.outputs;
            this.id = this.dialogArguments.id;
        }

        // this.showSpinner();

        if (!this._id) {
            warn("No component was specified!");
            return this.loadDefault();
        }

        try {
            const entry = ComponentRegistry.find(c => c.id == this._id.trim().replace(/[\-_]/g, '').toLowerCase());
            if (!entry) {
                err(`Failed to find Component '${this._id}' in registry!`);
                return this.loadDefault();
            }

            // Download the "module" (the standalone component)
            const module = this.module = await entry.load();

            // Pick the Component out by class Name
            const component = this.component = Object.keys(module)
                .filter(k => k.endsWith("Component"))
                .map(k => module[k])[0];

            if (!component) {
                err(`Component '${this._id}' is invalid or corrupted!`);
                return this.loadDefault();
            }


            // Bootstrap the component into the container
            const componentRef = this.componentRef = this.container.createComponent(component);
            this.container.insert(this.componentRef.hostView);

            const instance: any = this.instance = componentRef['instance'];

            this.bindInputs();
            this.bindOutputs();

            this.componentLoaded.next(instance);

            // Look for an observable called isLoading$ that will make us show/hide
            // the same distractor that is used on basic loading
            const isLoading$ = instance['isLoading$'] as BehaviorSubject<boolean>;
            if (isLoading$ && typeof isLoading$.subscribe == "function") {
                this.distractorSubscription = isLoading$.subscribe(loading => {
                    if (!loading)
                        this.clearSpinner();
                    else
                        this.showSpinner();
                });
            }

            const name = Object.keys(module)[0];
            log(`Loaded '${name}'`);

            if (!isLoading$)
                this.clearSpinner();

            return componentRef;
        }
        catch (ex) {

            if (isDevMode()) {
                console.warn("Component " + this._id + " threw an error on mount!");
                console.warn("This will cause you to see a 404 panel.");
                console.error(ex);
            }

            // Network errors throw a toast and return an error component
            if (ex && !isDevMode()) {
                console.error("Uncaught error when loading component");
                throw ex;
            }

            return this.loadDefault();
        }
    }

    ngOnDestroy() {
        // unsubscribe from all subscriptions
        Object.entries(this.outputSubscriptions).forEach(([key, sub]) => {
            sub.unsubscribe();
        });

        this.distractorSubscription?.unsubscribe();
        this.componentRef?.destroy();
        this.container?.clear();
    }

    /**
     * Bind the input values to the child component.
     */
    private bindInputs() {
        if (!this._inputs || !this.instance) return;

        // forward-bind inputs
        const { inputs } = this.component.ɵcmp;

        // Returns a list of entries that need to be set
        // This makes it so that unnecessary setters are not invoked.
        const updated = Object.entries(inputs).filter(([parentKey, childKey]: [string, string]) => {
            return this.instance[childKey] != this._inputs[parentKey];
        });

        updated.forEach(([parentKey, childKey]: [string, string]) => {
            if (this._inputs.hasOwnProperty(parentKey))
                this.instance[childKey] = this._inputs[parentKey];
        });
    }

    /**
     * Bind the output handlers to the loaded child component
     */
    private bindOutputs() {
        if (!this._outputs || !this.instance) return;

        const { outputs } = this.component.ɵcmp;

        // Get a list of unregistered outputs
        const newOutputs = Object.entries(outputs).filter(([parentKey, childKey]: [string, string]) => {
            return !this.outputSubscriptions[parentKey];
        });

        // Reverse bind via subscription
        newOutputs.forEach(([parentKey, childKey]: [string, string]) => {
            if (this._outputs.hasOwnProperty(parentKey)) {
                const target: EventEmitter<unknown> = this.instance[childKey];
                const outputs = this._outputs;

                // Angular folks, stop making this so difficult.
                const ctx = this.viewContainerRef['_hostLView'][8];
                const sub = target.subscribe(outputs[parentKey].bind(ctx)); // Subscription

                this.outputSubscriptions[parentKey] = sub;
            }
        });
    }

    /**
     * Show the progress spinner
     */
    private showSpinner() {
        this.isDistractorVisible = true;
    }

    /**
     * Clear the progress spinner
     */
    private clearSpinner() {
        this.isDestroyingDistractor = true;

        setTimeout(() => {
            this.isDistractorVisible = false;
        }, 300);
    }

    /**
     * Load the "Default" component (404) screen normally.
     */
    private loadDefault() {
        // TODO: pass through a not found // error component
        // this.container.createComponent(NotFoundComponent);
        this.clearSpinner();
    }
}
