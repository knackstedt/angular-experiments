import { AfterViewInit, Component, Input,ViewEncapsulation } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-backdrop',
    templateUrl: './backdrop.component.html',
    styleUrls: ['./backdrop.component.scss'],
    imports: [
        CommonModule,
        MatProgressSpinnerModule
    ],
    standalone: true,
    encapsulation: ViewEncapsulation.None
})
export class BackdropComponent implements AfterViewInit {
    @Input() loading = false;
    ngAfterViewInit(): void {
        document.body.classList.remove('loading');
    }
}
