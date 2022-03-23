import {Event} from './index';

export interface EventListener {
  onEvent(event: Event): void;
}
