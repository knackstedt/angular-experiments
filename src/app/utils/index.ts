/**
 * Wait for a speficied amount of time to pass
 * @param ms time in ms to sleep for
 * @returns
 */
export const sleep = ms => new Promise(r => setTimeout(r, ms));


/**
 * Helper to update the page URL.
 * @param page component page ID to load.
 * @param data string or JSON data for query params.
 */
export const updateUrl = (page: string, data: string | string[][] | Record<string, string | number> | URLSearchParams, replace = false) => {
    const oldHash = location.hash.split('?')[0];

    if (!page)
        page = oldHash.split('/')[1];

    const hash = `#/${page}`;

    const qstring = location.hash.split('?')[1];

    const query = new URLSearchParams(data as any);
    const prevParams = new URLSearchParams(qstring);

    // If the hash is the same, retain params.
    if (hash == oldHash) {
        // @ts-ignore
        for (const [key, value] of prevParams.entries()) {
            if (!query.has(key))
                query.set(key, prevParams.get(key));
        }
    }

    // @ts-ignore
    for (const [key, val] of query.entries()) {
        if (
            val == null ||
            val == undefined ||
            val == '' ||
            val == 'null' ||
            Number.isNaN(val) ||
            val == 'NaN'
        )
            query.delete(key);
    }

    // console.log(hash);
    if (!(hash.toLowerCase() == "#/frame" || hash.toLowerCase() == "#/powerbi") || data['id'] == -1)
        query.delete('id');

    if (replace) {
        window.history.replaceState(data, '', hash + '?' + query.toString());
    }
    else {
        window.history.pushState(data, '', hash + '?' + query.toString());
    }
}


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
