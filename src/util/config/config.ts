import * as dotenv from 'dotenv';

export interface Config {
  logLevel: string;
  region: string;
  clientId: string;
  iotEndpoint: string;
  iotTopicInbound: string;
  certificates: {
    certificatePath: string;
    privateKeyPath: string;
    rootCertificatePath: string;
  };
}

export const loadEnvConfig = (): Config => {
  dotenv.config();

  const iotEndpoint = process.env.IOT_ENDPOINT;
  if (!iotEndpoint) {
    throw new Error('IOT_ENDPOINT is not defined');
  }

  const region = process.env.AWS_REGION;
  if (!region) {
    throw new Error('AWS_REGION is not defined');
  }

  const clientId = process.env.IOT_CLIENT_ID;
  if (!clientId) {
    throw new Error('IOT_CLIENT_ID is not defined');
  }

  const iotTopicInbound = process.env.IOT_TOPIC_INBOUND;
  if (!iotTopicInbound) {
    throw new Error('IOT_TOPIC_INBOUND is not defined');
  }

  const iotCertificatePath = process.env.IOT_CERTIFICATE_PATH;
  if (!iotCertificatePath) {
    throw new Error('IOT_CERTIFICATE_PATH is not defined');
  }

  const iotPrivateKeyPath = process.env.IOT_PRIVATE_KEY_PATH;
  if (!iotPrivateKeyPath) {
    throw new Error('IOT_PRIVATE_KEY_PATH is not defined');
  }

  const iotRootCertificatePath = process.env.IOT_ROOT_CA_PATH;
  if (!iotRootCertificatePath) {
    throw new Error('IOT_ROOT_CA_PATH is not defined');
  }

  const config = {
    logLevel: process.env.LOG_LEVEL || 'info',
    iotEndpoint,
    region,
    clientId,
    iotTopicInbound,
    certificates: {
      certificatePath: iotCertificatePath,
      privateKeyPath: iotPrivateKeyPath,
      rootCertificatePath: iotRootCertificatePath,
    },
  };

  return config;
};
