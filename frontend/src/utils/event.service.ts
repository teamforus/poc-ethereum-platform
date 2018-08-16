import { Injectable } from '@angular/core';
import { Event } from '@models/event';

@Injectable()
export class EventService {
    private _listeners: Map<number, EventListener> = new Map();
    private _currentId: number = 1000000;

    addListener(listener: EventListener): number {
      const newId = this.generateNewId();
      this._listeners.set(newId, listener);
      return newId; 
    }

    onEvent(event:Event) {
      this._listeners.forEach((listener) => {
        listener.onEvent(event);
      });
    }

    private generateNewId(): number {
      return this._currentId++;
    }

    removeListener(id: number) {
      this._listeners.delete(id);
    }
}

export interface EventListener {
  onEvent(event: Event);
}