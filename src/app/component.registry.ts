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
    hidden?: boolean
}[] = [
    { id: 'Landing', load: () => import('src/app/pages/general/landing/landing.component') },
    { id: 'About', load: () => import('src/app/pages/general/about/about.component') },
    { id: 'Holo Cards', load: () => import('src/app/pages/general/holo-cards/holo-cards.component') },
    { id: 'VSCode', load: () => import('src/app/pages/general/vscode/vscode.component') },
    { id: 'React Flow', load: () => import('src/app/pages/@react/reactflow/reactflow-wrapper') },
    { id: 'Intentionally Blank', load: () => import('src/app/pages/@framework/intentionally-blank/intentionally-blank.component'), hidden: true },
]
// Read only -- this should be completely immutable.
.map(o => Object.seal(o));
