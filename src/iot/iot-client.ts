import {mqtt, iot, io} from 'aws-iot-device-sdk-v2';
import {TextDecoder} from 'util';
import {
  EventNotificationManager,
  EVENTS_MESSAGE_RECEIVED,
} from '../util/notifier';
import {Logger} from '../util/logger';
import {IoTConfiguration} from './iot-configuration';
import {existsSync} from 'fs';
import {resolve} from 'path';
import {Config} from '../util/config';

export class IoTClient {
  private configuration: mqtt.MqttConnectionConfig;
  private connection?: mqtt.MqttClientConnection;

  constructor(
    protected config: Config,
    protected notificationManager: EventNotificationManager,
    protected logger: Logger
  ) {
    this.logger = logger;
    this.config = config;
    this.notificationManager = notificationManager;

    const iotConfiguration = {
      region: config.region,
      clientId: config.clientId,
      endpoint: config.iotEndpoint,
      certificates: {
        certificatePath: config.certificates.certificatePath,
        privateKeyPath: config.certificates.privateKeyPath,
        rootCertificatePath: config.certificates.rootCertificatePath,
      },
    };

    this.configuration = this.buildConfiguration(iotConfiguration);
    this.onMessageReceived = this.onMessageReceived.bind(this);
  }

  private buildConfiguration(configuration: IoTConfiguration) {
    this.validateConfiguration(configuration);
    const builder =
      iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(
        resolve(configuration.certificates.certificatePath),
        resolve(configuration.certificates.privateKeyPath)
      );
    builder.with_certificate_authority_from_path(
      resolve(configuration.certificates.rootCertificatePath)
    );
    builder.with_clean_session(false);
    builder.with_client_id(configuration.clientId);
    builder.with_endpoint(configuration.endpoint);
    return builder.build();
  }

  private validateConfiguration(configuration: IoTConfiguration) {
    const checkFileExists = (filePath: string) => {
      if (!existsSync(filePath)) {
        throw new Error(`File ${filePath} does not exist`);
      }
    };
    if (!configuration.region) {
      throw new Error('Region is required');
    }
    if (!configuration.clientId) {
      throw new Error('Client ID is required');
    }
    if (!configuration.endpoint) {
      throw new Error('Endpoint is required');
    }
    if (!configuration.certificates.certificatePath) {
      checkFileExists(configuration.certificates.certificatePath);
      throw new Error('Certificate path is required');
    }
    if (!configuration.certificates.privateKeyPath) {
      checkFileExists(configuration.certificates.privateKeyPath);
      throw new Error('Private key path is required');
    }
    if (!configuration.certificates.rootCertificatePath) {
      checkFileExists(configuration.certificates.rootCertificatePath);
      throw new Error('Root certificate path is required');
    }
  }

  async connect() {
    this.logger.info('Connecting to AWS IoT');
    const clientBootstrap = new io.ClientBootstrap();
    const client = new mqtt.MqttClient(clientBootstrap);
    this.connection = client.new_connection(this.configuration);

    try {
      await this.connection.connect();
      this.logger.info('Connected to AWS IoT');
    } catch (e) {
      this.logger.error('Error connecting to AWS IoT: ' + e);
      throw e;
    }
    return this.connection;
  }

  async subscribeUpdates() {
    if (!this.connection) {
      this.connection = await this.connect();
    }
    const updateTopic = this.config.iotTopicInbound;
    const request = await this.connection.subscribe(
      updateTopic,
      mqtt.QoS.AtLeastOnce,
      this.onMessageReceived
    );
    if (request.error_code) {
      this.logger.error('Error subscribing: ' + request.error_code);
      throw new Error('Error subscribing: ' + request.error_code);
    }
  }

  async onMessageReceived(topic: string, payload: ArrayBuffer) {
    this.logger.info('Got message from ' + topic);
    try {
      const decoder = new TextDecoder();
      const json = decoder.decode(payload);
      const message = JSON.parse(json);
      this.notificationManager.notify(message, EVENTS_MESSAGE_RECEIVED);
    } catch (e) {
      this.logger.error('Error parsing message: ' + e);
      throw e;
    }
  }
}
