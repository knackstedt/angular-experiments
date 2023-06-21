import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Regex2RailRoadDiagram } from './diagram/regex-to-railroad';


@Component({
    selector: 'app-regex-diagram',
    templateUrl: './regex-diagram.component.html',
    styleUrls: ['./regex-diagram.component.scss'],
    imports: [
    ],
    standalone: true
})
export class RegexDiagramComponent implements AfterViewInit {
    @ViewChild('diagram', { read: ElementRef, static: false }) diagram: ElementRef;

    private _regexText: string = "a+b+c+";
    get regexText() { return this._regexText }
    set regexText(text: string) {
        this._regexText = text;
        try {
            const html = Regex2RailRoadDiagram(text, { flavour: 'perl', options: '' });
            this.diagram.nativeElement.innerHTML = html;
        }
        catch (ex) {
            console.log(ex);
            let message = this.errorMessageOverride(ex);
            this.diagram.nativeElement.innerHTML = message;
        }
    };

    constructor() { }

    @Input() errorMessageOverride: CallableFunction = (ex) => {
        // Syntax Highlighting taken from:
        // http://jsfiddle.net/KJQ9K/554/
        function syntaxHighlight(json) {
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                if (cls == 'string')
                    return '"<span class="' + cls + '">' + match.substr(1, match.length - 2) + '</span>"';
                return '<span class="' + cls + '">' + match + '</span>';
            });
        }
        const style = ".string{color: #f28b54;} .number, .boolean, .null{color: #9980ff;} .key{ color: #e36eec; }";

        return `<style>${style}</style><pre>` + syntaxHighlight(JSON.stringify(ex, null, 2)) + '</pre>';
    };

    ngAfterViewInit(): void {
        this.regexText = this.regexText;
    }
}
