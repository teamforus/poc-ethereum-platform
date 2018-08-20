import { Injectable } from '@angular/core';
import { ToastWarningLevels, Toast } from '@models/toast';
import { EventService, EventListener } from '@utils/event.service';
import { Event } from '@models/event';

@Injectable()
export class ToastService implements EventListener {

  constructor(
    private _eventService: EventService
  ) {
    this._eventService.addListener(this)
  }

  private _toasts: Toast[] = [];

  onEvent(event: Event) {
    this.toast(event.data['tokenName'] + ' is aangevraagd voor ' + event.data['requesterName']);
  }

  toast(message: string, level: number = ToastWarningLevels.LOW) {
    const toast = new Toast(message, level)
    this._toasts.unshift(toast);
    // @ts-ignore
    toast.timeout = setTimeout(() => {
      this._toasts.pop();
      // Toast duration
    }, 5000);
  }

  remove(index: number) {
    this._toasts[index].clear();
    this._toasts.splice(index,1);
  }

  get toasts(): Toast[] { return this._toasts; }
}