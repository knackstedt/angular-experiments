import { Directive, Input, ViewContainerRef, OnInit, Component, isDevMode, ComponentRef, OnDestroy } from '@angular/core';
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

    /**
     * The id of the component that will be lazy loaded
     */
    private _id: string;
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

    private instance;
    private module;

    private componentRef: ComponentRef<any>;
    constructor(private container: ViewContainerRef) { }

    private spinner: ComponentRef<LazyProgressDistractorComponent>;
    private spinnerSubscription: Subscription;
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

            const module = this.module = await entry.load();

            const component = Object.keys(module)
                .filter(k => k.endsWith("Component"))
                .map(k => module[k])[0];

            if (!component) {
                err(`Component '${this._id}' is invalid or corrupted!`);
                return this.loadDefault();
            }

            const componentRef = this.componentRef = this.container.createComponent(component);
            const instance: any = this.instance = componentRef['instance'];

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
                console.warn("Component " + this.id + " threw an error on mount!");
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
        this.spinnerSubscription?.unsubscribe();
        this.componentRef?.destroy();
        this.container?.clear();
    }

    private showSpinner() {
        if (!this.spinner)
            this.spinner = this.container.createComponent(LazyProgressDistractorComponent);

        else if (this.spinner && this.spinner.instance.isDestroying)
            this.spinner.instance.isDestroying = false;
    }

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

    private loadDefault() {
        this.container.createComponent(NotFoundComponent);
        this.clearSpinner();
    }
}
