/**
 * Wait for a speficied amount of time to pass
 * @param ms time in ms to sleep for
 * @returns
 */
export const sleep = ms => new Promise(r => setTimeout(r, ms));


export const Logger = (context: string, contextColor: string, textColor: string = "#03a9f4") => ({
    log: (message, ...args) => {
        console.log(`%c[${context}] %c${message}`, 'color: ' + contextColor, 'color: ' + textColor, ...args);
    },
    warn: (message, ...args) => {
        console.warn(`%c[${context}] %c${message}`, 'color: ' + contextColor, 'color: ' + textColor, ...args);
    },
    err: (message, ...args) => {
        console.error(`%c[${context}] %c${message}`, 'color: ' + contextColor, 'color: ' + textColor, ...args);
    },
    error: (message, ...args) => {
        console.error(`%c[${context}] %c${message}`, 'color: ' + contextColor, 'color: ' + textColor, ...args);
    }
})
