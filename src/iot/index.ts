export * from './iot-client';

import {Logger} from '../util/logger';
import {Event, EventNotificationManager, EventListener} from '../util/notifier';
import {IoTClient} from './iot-client';
import {loadEnvConfig} from '../util/config';

class NManager implements EventListener {
  constructor(private logger: Logger) {
    this.logger = logger;
  }
  onEvent(event: Event) {
    this.logger.info(`${JSON.stringify(event.payload)}`);
  }
}

(async () => {
  const config = loadEnvConfig();
  const logger = new Logger(config);
  const nmanager = new EventNotificationManager(logger);
  nmanager.addListener(new NManager(logger));
  const client = new IoTClient(config, nmanager, logger);
  await client.subscribeUpdates();
})();
