import { AfterViewInit, Component, Input,ViewEncapsulation } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
    selector: 'app-backdrop',
    templateUrl: './backdrop.component.html',
    styleUrls: ['./backdrop.component.scss'],
    imports: [
        MatProgressSpinnerModule
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: true
})
export class BackdropComponent implements AfterViewInit {
    @Input() loading = false;
    ngAfterViewInit(): void {
        document.body.classList.remove('loading');
    }
}
