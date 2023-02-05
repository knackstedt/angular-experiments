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
} from '@angular/core';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ReactFlowWrappableComponent } from './reactflow';
import { createRoot, Root } from 'react-dom/client';

@Component({
  selector: 'react-reactflow',
  template: ``,
  styleUrls: ['./reactflow.scss']
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
      <ReactFlowWrappableComponent/>
    );
  }
}
