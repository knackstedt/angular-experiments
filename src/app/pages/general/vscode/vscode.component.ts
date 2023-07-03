import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, ViewChild } from '@angular/core';

// Monaco has a UMD loader that requires this
// @ts-ignore
window.require = { paths: { 'vs': '/lib/monaco/vs' } };

const monacoFiles = [
    '/lib/monaco/vs/loader.js',
    '/lib/monaco/vs/editor/editor.main.nls.js',
    '/lib/monaco/vs/editor/editor.main.js',
]
let isInstalled = false
function installMonaco() {
    if (isInstalled) return;

    for (let i = 0; i < monacoFiles.length; i++) {
        const script = document.createElement("script");
        script.setAttribute("defer", "");
        script.setAttribute("src", monacoFiles[i]);
        document.body.append(script)
    }
    isInstalled = true;
}

let Monaco: any;

const settings = {
    automaticLayout: true,
    theme: 'vs-dark',
    scrollBeyondLastLine: false,
    language: "auto",
    colorDecorators: true,
    folding: true,
    scrollBeyondLastColumn: false,
    tabSize: 2,
    minimap: {
        enabled: true
    }
};

@Component({
    selector: 'app-vscode',
    templateUrl: './vscode.component.html',
    styleUrls: ['./vscode.component.scss'],
    standalone: true
})
export class VscodeComponent implements AfterViewInit, OnDestroy {
    @ViewChild("editor", { read: ElementRef, static: false }) editorElement: ElementRef;

    isDirty = false;
    editor;
    filename: string;

    private _code: string;
    @Input() set code(value: string) {
        if (value == this._code)
            return;
        if (typeof value != "string")
            throw new TypeError("Value must be of type string");

        this._code = value;
        if (this.editor)
            this.editor.setValue(this.code);
    };
    get code() { return this._code.trim() }

    private _language: string;
    @Input() set language(value: string) {
        this._language = {
            'ts': "typescript",
            'html': 'xml',
            'scss': 'css'
        }[value] || "auto"

        if (this.editor) {
            const model = this.editor.getModel();
            Monaco.editor.setModelLanguage(model, this._language);
        }
    }
    get language() { return this._language }

    settings = {
        automaticLayout: true,
        theme: 'vs-dark',
        scrollBeyondLastLine: false,
        language: "auto",
        colorDecorators: true,
        folding: true,
        scrollBeyondLastColumn: false,
        tabSize: 2,
        minimap: {
            enabled: true
        },
        scrollbar: {
            alwaysConsumeMouseWheel: false
        }
    };

    verticalScrollExhausted = false;

    constructor() {
        installMonaco();
    }

    ngAfterViewInit() {
        // this.settings.language = "json";
        this.initEditor();
    }
    ngOnDestroy(): void {
        this.editor?.dispose();
    }

    async initEditor() {
        // Ensure Monaco is loaded.
        await new Promise((res, rej) => {
            let count = 0;
            let i = window.setInterval(() => {
                count++;

                if (window['monaco'] != undefined) {
                    window.clearInterval(i);

                    Monaco = window['monaco'];
                    res(true);
                }
                if (count >= 100) {
                    window.clearInterval(i);
                    res(false);
                }
            }, 100);
        });

        this.settings.language = this._language;

        let editor = this.editor = Monaco.editor.create(this.editorElement.nativeElement, this.settings);

        if (this.code)
            editor.setValue(this.code);
        // }
        // else {
        //     this.code = JSON.stringify(Monaco.editor, null, 4);
        //     editor.setValue(this.code);
        // }'

        editor.onDidChangeModelContent(() => {
            this.isDirty = this.editor.getValue() != this.code;
        });

        // editor.onMouseWheel((...args) => {
        //     console.log("onMouseWheel", args)
        // });
        // editor.onDidScrollChange((...args) => {
        //     console.log("OnDidScrollChange", args)
        // });
    }

    download() {
        const code = this.editor.getValue();

        let blob = new Blob([code], { type: 'text/log' });
        let elm = document.createElement('a');
        let blobURL = URL.createObjectURL(blob);

        // Set the data values.
        elm.href = blobURL;
        elm.download = this.filename;

        document.body.appendChild(elm);
        elm.click();

        document.body.removeChild(elm);
        elm.remove();

        URL.revokeObjectURL(blobURL);
    }

    @HostListener('window:resize', ['$event'])
    resize = (): void => {
        this.editor?.layout();
    };
}
