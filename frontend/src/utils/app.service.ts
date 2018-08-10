import { Injectable } from '@angular/core';

@Injectable()
export class AppService {
  private readonly min = 10*Math.pow(10, 8);
  private readonly max = (this.min*10)-1;
  
  private _listenerMap: Map<number, AppMessageListener> = new Map();
  static headers: Map<string, string> = new Map();

  addHeader(key:string, value:string) {
    AppService.headers.set(key, value);
  }

  /**
   * Emit a message to all listeners
   * @param message The message to be send to the listeners
   */
  emit(message: AppMessage) {
    this._listenerMap.forEach((listener) => {
      listener.onMessage(message);
    });
  }

  private getNewRegistrationNumber() {
    let currentAttempt = -1;
    while (currentAttempt < this.min || this._listenerMap.has(currentAttempt)) {
      currentAttempt = Math.ceil(Math.random() * (this.max - this.min) + this.min);
    }
    return currentAttempt;
  }

  /**
   * Register an event message listener to receive all messages sent
   *  to the user.
   * @param listener The listener to add
   * @returns The registration number (which can be used to unregister)
   */
  register(listener: AppMessageListener) {
    const registrationNumber = this.getNewRegistrationNumber();
    this._listenerMap.set(registrationNumber, listener);
    return registrationNumber;
  }

  /**
   * Remove a listener from the list of listeners, thus stopping
   * it to receive app messages.
   * @param registrationNumber The number which was returned by 
   * the register function
   */
  unregister(registrationNumber: number) {
    this._listenerMap.delete(registrationNumber);
  }
}

export class AppMessage {
  constructor(
    public id: number,
    public request: string,
    public body: any
  ) {}
}

export interface AppMessageListener {
  /**
   * Handle a message received from an identity application
   * @param message The message to be handled
   * 
   */
  onMessage(message: AppMessage);

  /**
   * Resister self from AppService. 
   */
  unregister();
}

export class AppRequest {
  public readonly id;
  constructor(
    public readonly type: string,
    public readonly body: Object = {}
  ) {
    AppService.headers.forEach((value, key) => {
      body[key] = value;
    });
    const min = 10*Math.pow(10, 8)
    const max = (min*10)-1
    this.id = Math.ceil(Math.random() * (max - min) + min);
  }
}