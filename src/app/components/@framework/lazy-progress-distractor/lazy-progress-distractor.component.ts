import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-lazy-progress-distractor',
    templateUrl: './lazy-progress-distractor.component.html',
    styleUrls: ['./lazy-progress-distractor.component.scss'],
    imports: [MatProgressSpinnerModule],
    standalone: true
})
export class LazyProgressDistractorComponent {
    @Input() isDestroying = false;
}
