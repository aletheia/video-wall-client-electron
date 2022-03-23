import {mqtt, iot, io} from 'aws-iot-device-sdk-v2';
import {TextDecoder} from 'util';
import {
  EventNotificationManager,
  MESSAGE_RECEIVED_EVENT_TYPE,
} from '../util/notifier';
import {Logger} from '../util/logger';
import {IoTConfiguration} from './iot-configuration';
import {existsSync} from 'fs';
import {resolve} from 'path';

export const updateTopic = '/ctrlaltmuseum';

export class IoTClient {
  private configuration: mqtt.MqttConnectionConfig;
  private connection?: mqtt.MqttClientConnection;

  constructor(
    protected config: IoTConfiguration,
    protected notificationManager: EventNotificationManager,
    protected logger: Logger
  ) {
    this.logger = logger;
    this.config = config;
    this.notificationManager = notificationManager;
    this.configuration = this.buildConfiguration(config);
    this.onMessageReceived = this.onMessageReceived.bind(this);
  }

  private buildConfiguration(configuration: IoTConfiguration) {
    this.validateConfiguration(configuration);
    const builder =
      iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(
        resolve(__dirname, configuration.certificates.certificatePath),
        resolve(__dirname, configuration.certificates.privateKeyPath)
      );
    builder.with_certificate_authority_from_path(
      resolve(__dirname, configuration.certificates.rootCertificatePath)
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
      this.notificationManager.notify(message, MESSAGE_RECEIVED_EVENT_TYPE);
    } catch (e) {
      this.logger.error('Error parsing message: ' + e);
      throw e;
    }
  }
}
