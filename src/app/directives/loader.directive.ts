import { Directive, Input, ViewContainerRef, OnInit, isDevMode, ComponentRef, OnDestroy, EventEmitter } from '@angular/core';
import { RegisteredComponents } from '../component.registry';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Logger } from '../utils';
import { LazyProgressDistractorComponent } from '../components/@framework/lazy-progress-distractor/lazy-progress-distractor.component';
import { NotFoundComponent } from '../components/@framework/not-found/not-found.component';

// A proxied registry that mutates reference keys
export const ComponentRegistry =
    RegisteredComponents
    .map(c => ({ ...c, id: c.id.toLowerCase().replace(/[ ]/g, '') }));

export const checkIfLazyComponentExists = (id: string) => {
    return true;
}

const { log, warn, err } = Logger("LazyLoaderDirective", "#009688");

@Directive({
    selector: 'ng-template[lazyLoad]',
    standalone: true
})
export class LazyLoaderDirective implements OnInit, OnDestroy {

    private _id: string;
    /**
     * The id of the component that will be lazy loaded
     */
    @Input("lazyLoad") set id(id: string) {
        if (this._id) {
            // clear
            this.container.remove();
        }
        this._id = id;
    };


    private _data;
    /**
     * The data representing the item the context-menu was opened for.
     */
    @Input("lazyLoadArgs") set data(data: any) {
        this._data = data;

        if (this.instance)
            this.instance.arguments = data;
    };


    private _inputs: { [key: string]: any; };
    /**
     * A map of inputs to bind to the child.
     * Supports change detection. (May fail on deep JSON changes)
     *
     * ```html
     * <ng-template
     *       lazyLoad="MyLazyComponent"
     *       [inputs]="{ prop1: true, prop2: false, complex: { a: true, b: 0 } }"
     * >
     * </ng-template>
     * ```
     */
    @Input("inputs") set inputs(data: { [key: string]: any }) {
        let previous = this._inputs;
        this._inputs = data;

        if (this.component) {
            const { inputs } = this.component.ɵcmp;

            const currentKeys = Object.keys(inputs);
            const removed = Object.keys(previous).filter(key => !currentKeys.includes(key));

            // ? perhaps set to null or undefined instead
            removed.forEach(k => delete this.instance[k]);

            this.bindInputs();
        }
    }


    private outputSubscriptions: { [key: string]: Subscription} = {}
    private _outputs: { [key: string]: Function; };
    /**
     * A map of outputs to bind from the child.
     * Should support change detection.
     * ```html
     * <ng-template
     *       lazyLoad="MyLazyComponent"
     *       [outputs]="{ prop3: onOutputFire }"
     * >
     * </ng-template>
     * ```
     */
    @Input("outputs") set outputs(data: { [key: string]: Function }) {
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

    /**
     * Component ref for a loader-distractor
     */
    private spinner: ComponentRef<LazyProgressDistractorComponent>;

    /**
     * Subscription with true/false state on whether the distractor should be
     */
    private spinnerSubscription: Subscription;

    constructor(private container: ViewContainerRef) { }

    async ngOnInit() {
        this.showSpinner();

        if (!this._id) {
            warn("No component was specified!");
            return this.loadDefault();
        }

        try {
            const entry = ComponentRegistry.find(c => c.id == this._id.toLowerCase());
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
            const instance: any = this.instance = componentRef['instance'];

            this.bindInputs();
            this.bindOutputs();

            // Look for an observable called isLoading$ that will make us show/hide
            // the same distractor that is used on basic loading
            const isLoading$ = instance['isLoading$'] as BehaviorSubject<boolean>;
            if (isLoading$ && typeof isLoading$.subscribe == "function") {
                this.spinnerSubscription = isLoading$.subscribe(loading => {
                    if (!loading)
                        this.clearSpinner();
                    else
                        this.showSpinner();
                });
            }

            const name = Object.keys(module)[0];
            log(`Loaded '${name}'`);

            // Inject `arguments` as a JSON reference
            if (typeof this._data != "undefined" && this._data != null) {
                instance.arguments = this._data;
            }

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

        this.spinnerSubscription?.unsubscribe();
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
                const sub = target.subscribe((...args) => this._outputs[parentKey](...args));
                this.outputSubscriptions[parentKey] = sub;
            }
        });
    }

    /**
     * Show the progress spinner
     */
    private showSpinner() {
        if (!this.spinner)
            this.spinner = this.container.createComponent(LazyProgressDistractorComponent);

        else if (this.spinner && this.spinner.instance.isDestroying)
            this.spinner.instance.isDestroying = false;
    }

    /**
     * Clear the progress spinner
     */
    private clearSpinner() {
        if (!this.spinner) return;

        this.spinner.instance.isDestroying = true;

        setTimeout(() => {
            if (this.spinner?.instance.isDestroying) {
                this.spinner.destroy();
                this.spinner = null;
            }
        }, 300);
    }

    /**
     * Load the "Default" component (404) screen normally.
     */
    private loadDefault() {
        this.container.createComponent(NotFoundComponent);
        this.clearSpinner();
    }
}
