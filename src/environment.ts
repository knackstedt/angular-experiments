import { isDevMode } from '@angular/core';

export const environment = Object.seal({
    production: !isDevMode(),
});

