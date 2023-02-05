import { Component, AfterViewInit, ViewContainerRef, HostListener } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import Globe from 'globe.gl/dist/globe.gl.min.js';
import cablesGeo from "./data.json";

@Component({
    selector: 'app-globe-gl',
    templateUrl: './globe-gl.component.html',
    styleUrls: ['./globe-gl.component.scss'],
    imports: [
        SharedModule
    ],
    standalone: true
})
export class GlobeGlComponent implements AfterViewInit {
    constructor(private container: ViewContainerRef) { }

    private globe: Globe;

    ngAfterViewInit() {
        const globe = this.globe = Globe()(this.container.element.nativeElement)
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
            .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
            .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png');

        this.resize();

        // from https://www.submarinecablemap.com
        let cablePaths = [];
        cablesGeo.features.forEach(({ geometry, properties }) => {
            geometry.coordinates.forEach(coords => cablePaths.push({ coords, properties }));
        });

        globe
            .pathsData(cablePaths)
            .pathPoints('coords')
            .pathPointLat(p => p[1])
            .pathPointLng(p => p[0])
            .pathColor(path => path['properties'].color)
            .pathLabel(path => path['properties'].name)
            .pathDashLength(0.1)
            .pathDashGap(0.008)
            .pathDashAnimateTime(12000);
    }

    @HostListener('window:resize', ['$event'])
    resize(e?: MouseEvent): void {
        let bounds = this.container?.element?.nativeElement?.getBoundingClientRect();

        this.globe?.height(bounds.height);
        this.globe?.width(bounds.width);
    }
}
