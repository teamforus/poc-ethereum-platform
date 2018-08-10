import { Injectable } from '@angular/core';
import { AppService, AppMessage, AppMessageListener, AppRequest } from '@utils/app.service';
import QRCode from 'qrcode';

@Injectable()
export class QrService implements AppMessageListener {
  
  public code: string;
  private _responseFunction: Function;
  private _responseId: number;
  private _responseRequest: string;
  private _appListenerNumber: number;

  constructor(
    private _appService: AppService
  ) {}

  close() {
    this.code = undefined;
  }

  get hasCode(): boolean {
    return !!this.code;
  }

  onMessage(message: AppMessage) {
    if (!!this._responseFunction && 
      message.id === this._responseId &&
      message.request === this._responseRequest) {
      this._responseFunction(message);
      this.unregister();
    }
  }

  present(message: string) {
    this.code = message;
    this._responseFunction = null;
  }

  /**
   * Request an action from an identity app. 
   * @param request The App request
   * @param onResponse The function executed when the app responses with a message. Need to be function(message:AppMessage)
   */
  requestFromApp(request:AppRequest, onResponse:Function) {
    if (!this._appListenerNumber) {
      this._appService.register(this);
    }
    this.present(JSON.stringify(request));
    this._responseId = request.id;
    this._responseRequest = request.type;
    this._responseFunction = onResponse;
    
  }

  unregister() {
    this._appService.unregister(this._appListenerNumber);
    delete this._appListenerNumber;
    delete this._responseFunction;
  }
}
