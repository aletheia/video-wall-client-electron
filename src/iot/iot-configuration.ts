export interface Certificates {
  certificatePath: string;
  privateKeyPath: string;
  rootCertificatePath: string;
}

export interface IoTConfiguration {
  region: string;
  clientId: string;
  certificates: Certificates;
  endpoint: string;
}
