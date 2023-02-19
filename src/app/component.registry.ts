/**
 * ! Read this before making _any_ changes to this file.
 * This file contains registration definitions for all
 * standalone components that can be lazy-loaded.
 * _Do not_ register components here that are defined on a module.
 * _Do not_ remove components from here if you don't recognize them.
 * _Do not_ comment components out if they are failing and commit this
 *    file, unless you are completely sure that is OK.
 * _Do_ use `<ng-template lazyLoad="MyComponent"></ng-template>` to lazy-load a component
 * _Do_ use PascalCase or camelCase in names, loading is case-insensitive.
 *
 * When creating a component that should be lazy-loaded, set `standalone: true` in the
 *     `@component({standalone: true})` decorator and add `SharedModule` to imports.
 */

export const RegisteredComponents: {
    id: string,
    load: () => Promise<any>,
    hidden?: boolean,
    icon?: string,
    order?: number
}[] = [
    // @ae-component-inject
    { id: 'Landing', load: () => import('src/app/pages/general/landing/landing.component'), icon: "home", order: 0 },
    { id: 'The Team', load: () => import('src/app/pages/general/about/about.component'), icon: "info", order: 10000 },
    { id: 'Holo Cards', load: () => import('src/app/pages/general/holo-cards/holo-cards.component'), icon: "collections", order: 9000 },
    { id: 'Parallax', load: () => import('src/app/pages/general/atropos/atropos.component'), icon: "vrpano", order: 8500 },
    { id: 'Carousel', load: () => import('src/app/pages/general/carousel/carousel.component'), icon: "view_carousel", order: 8400 },
    { id: 'Globe.GL', load: () => import('src/app/pages/general/globe-gl/globe-gl.component'), icon: "public", order: 1000 },
    { id: 'Regex Diagram', load: () => import('src/app/pages/general/regex-diagram/regex-diagram.component'), icon: "data_array", order: 1200 },
    { id: 'VSCode', load: () => import('src/app/pages/general/vscode/vscode.component'), icon: "code", order: 1500 },
    { id: 'React Flow', load: () => import('src/app/pages/@react/reactflow/reactflow-wrapper'), icon: "schema", order: 2000 },
    // { id: 'Ghost Cards', load: () => import('src/app/pages/general/ghost-cards/ghost-cards.component'), icon: "schema", order: 2000 },
    { id: 'Lazy Test', load: () => import('src/app/pages/general/lazy-load-test/lazy-load-test.component'), icon: "science", order: 20000 },
    { id: 'TestChild', load: () => import('./pages/general/lazy-load-test/test-child/test-child.component') },

    { id: 'info-dialog', load: () => import('src/app/pages/general/info-dialog/info-dialog.component'), hidden: true },

    { id: 'Intentionally Blank', load: () => import('src/app/pages/@framework/intentionally-blank/intentionally-blank.component'), hidden: true },
]
// Read only -- this should be completely immutable.
.map(o => Object.seal(o));
