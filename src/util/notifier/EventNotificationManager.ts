import {nanoid} from 'nanoid';
import {Logger} from '../logger';
import {ALL_EVENTS_SUBSCRIPTION} from './constants';
import {Json, Event} from './index';
import {EventListener} from './EventListener';

export class EventNotificationManager {
  protected listeners: {[evtName: string]: EventListener[]};

  constructor(protected logger: Logger) {
    this.logger = logger;
    this.listeners = {};
    this.listeners[ALL_EVENTS_SUBSCRIPTION] = [];
  }

  addListener(listener: EventListener, eventType?: string) {
    if (eventType) {
      this.listeners[eventType] = this.listeners[eventType] || [];
      this.listeners[eventType].push(listener);
    } else {
      this.listeners[ALL_EVENTS_SUBSCRIPTION].push(listener);
    }
  }
  removeListener(listener: EventListener) {
    Object.values(this.listeners).forEach(listeners => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    });
  }

  notify(payload: Json, eventType?: string, eventId?: string) {
    this.logger.info('Notifying listeners');

    const id = eventId || nanoid();
    eventType = eventType || 'unknown';
    const event: Event = {
      id,
      type: eventType,
      payload,
    };

    const typeSpecificEventListeners =
      eventType && this.listeners[eventType] ? this.listeners[eventType] : [];

    const listeners = typeSpecificEventListeners.concat(
      this.listeners[ALL_EVENTS_SUBSCRIPTION]
    );
    console.log(listeners);
    listeners.forEach((listener: EventListener) => {
      console.log(JSON.stringify(event) + ' ' + eventType);
      listener.onEvent(event);
    });
  }

  notifyEvent(event: Event) {
    this.notify(event.payload, event.type, event.id);
  }
}
