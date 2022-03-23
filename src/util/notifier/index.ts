export interface Json {
  [key: string]: boolean | string | number | Event | string[] | number[];
}

export interface Event {
  id: string;
  type: string;
  payload: Json;
}

export * from './event-listener';
export * from './event-notification-manager';
export * from './constants';
