import { ToasterService } from 'src/app/services/toaster.service';
import { Component, OnInit } from '@angular/core';
import { ToastMessage } from 'src/app/types/toast-message';

type ToastItem = ToastMessage & {
    id: number
}

@Component({
    selector: 'app-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
    standalone: false
})
export class ToastComponent {

    toastItems: ToastItem[] = [];

    constructor(private toaster: ToasterService) { 
        toaster.toaster$.subscribe(message => {
            this.openMessage(message);
        });

        // Tell the toaster that we are listening for messages.
        toaster.bindListener();
    }

    private toastId = 0;
    openMessage(message: ToastMessage) {
        let toastItem = {
            ...message,
            // Allow message.data to be null.
            ...(message.data || {}),

            // Give it a unique id.
            id: this.toastId++ 
        };
        this.toastItems.push(toastItem);

        // We add this class after the DOM gets generated to give the toast a slide-in
        // effect without using CSS keyframes. (because keyframes are buggy with multiple targets)
        setTimeout(() => {
            toastItem.state = "visible";
        }, 10);
        setTimeout((() => {
            this.removeMessage(toastItem);
        }).bind(this), 60 * 1000);
    }

    removeMessage(message: ToastItem) {
        // Clear state to trigger slide-out animation.
        message.state = '';

        // Wait for the animation to complete then kill the item.
        setTimeout(() => {
            this.toastItems.splice(this.toastItems.findIndex(t => t.id == message.id), 1);
        }, 400);
    }
}
