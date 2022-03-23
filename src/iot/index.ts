export * from './iot-client';

import {Logger} from '../util/logger';
import {Event, EventNotificationManager} from '../util/notifier';
import {EventListener} from '../util/notifier';
import {IoTConfiguration} from './iot-configuration';
import {IoTClient} from './iot-client';

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
  const logger = new Logger({level: 'info'});
  const nmanager = new EventNotificationManager(logger);
  nmanager.addListener(new NManager(logger));
  const ioTConfiguration: IoTConfiguration = {
    region: 'eu-west-1',
    endpoint: 'a3mesw77wth3tr-ats.iot.eu-west-1.amazonaws.com',
    clientId: 'ctrl-alt-museum-video-wall',
    certificates: {
      certificatePath: '../certificates/ctrl-alt-museum-video-wall.cert.pem',
      privateKeyPath: '../certificates/ctrl-alt-museum-video-wall.private.key',
      rootCertificatePath: '../certificates/root-CA.crt',
    },
  };
  const client = new IoTClient(ioTConfiguration, nmanager, logger);
  await client.subscribeUpdates();
})();
