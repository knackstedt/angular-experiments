import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import * as React from 'react';
import { JSONCrackWrappableComponent } from './jsoncrack';
import { createRoot, Root } from 'react-dom/client';

@Component({
    selector: 'react-jsoncrack',
    template: ``,
    styleUrls: ['./jsoncrack.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None
})
export class ReactFlowWrapperComponent implements OnChanges, OnDestroy, AfterViewInit {

  private root: Root;

  constructor(private container: ViewContainerRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    this.root.unmount();
  }

  private render() {
    if (!this.root) {
      this.root = createRoot(this.container.element.nativeElement);
    }
    this.root.render(
      <JSONCrackWrappableComponent/>
    );
  }
}
