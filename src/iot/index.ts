export * from './iot-client';

import {Logger} from '../util/logger';
import {Event, EventNotificationManager, EventListener} from '../util/notifier';
import {IoTConfiguration} from './iot-configuration';
import {IoTClient} from './iot-client';
import {loadEnvConfig} from '../util/config';

class NManager implements EventListener {
  constructor(private logger: Logger) {
    this.logger = logger;
  }
  onEvent(event: Event) {
    console.log('oncazz');
    console.log(event);

    //this.logger.info(`${JSON.stringify(event.payload)}`);
  }
}

(async () => {
  const config = loadEnvConfig();
  const logger = new Logger(config);
  const nmanager = new EventNotificationManager(logger);
  nmanager.addListener(new NManager(logger));
  const ioTConfiguration: IoTConfiguration = {
    region: 'eu-west-1',
    endpoint: 'a3mesw77wth3tr-ats.iot.eu-west-1.amazonaws.com',
    clientId: 'ctrl-alt-museum-video-wall',
    certificates: {
      certificatePath:
        __dirname + '../certificates/ctrl-alt-museum-video-wall.cert.pem',
      privateKeyPath:
        __dirname + '../certificates/ctrl-alt-museum-video-wall.private.key',
      rootCertificatePath: __dirname + '../certificates/root-CA.crt',
    },
  };
  const client = new IoTClient(config, nmanager, logger);
  await client.subscribeUpdates();
})();
