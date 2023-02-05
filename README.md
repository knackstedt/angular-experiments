## Angular Experiments

This repository contains all of my Angular Experiments and proofs-of-concept
Things such as rewriting components into Angular components, importing libraries etc.

Files
| Filename              | Purpose |
| ---                   | ---     |
| .browserslistrc       | Configure the target browser compatability. This effects the generated polyfills. |
| .editorconfig         | Generic editor configurations that we expect users to follow. |
| .env                  | Environment variables. Will be overridden in production. |
| .gitignore            | Ignore specific files from version control. |
| angular.json          | Angular configuration. |
| package-lock.json     | NPM installed package version state. |
| package.json          | NPM configuration. |
| proxy.config.json     | Proxy used for UI development binding to backend server. |
| template.js           | Code used to create a new UI page Usage `node template.js pages/general/foobar`. |
| tsconfig.app.json     | Typescript settings for the UI. |
| tsconfig.json         | Common Typescript settings. |

## Writing a Page

To create and access a page, it will need to make a standalone component and reference it in the `src/app/component.registry.ts` registry. You can use `node template.js pages/general/foobar` to automate that for you.
