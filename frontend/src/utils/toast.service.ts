import { Injectable } from '@angular/core';
import { ToastWarningLevels, Toast } from '@models/toast';

@Injectable()
export class ToastService {

  private _toasts: Toast[] = [];

  toast(message: string, level: number = ToastWarningLevels.LOW) {
    const toast = new Toast(message, level)
    this._toasts.unshift(toast);
    setTimeout(() => {
      this._toasts.pop();
      // Toast duration
    }, 5000);
  }

  get toasts(): Toast[] { return this._toasts; }
}
