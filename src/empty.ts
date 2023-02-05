/**
 * This exists so that Webpack node polyfills get skipped
 * Angular checks dependencies when building, and will throw errors when
 * benign imports are missing in a web environment.
 */
export default () => {}
