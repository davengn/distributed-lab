import {
  labApiService,
  prototypeServices,
  type PrototypeService,
  type ServiceStatus,
} from './prototype-data';

export interface ServiceCatalogRow {
  id: string;
  service: string;
  status: ServiceStatus;
  version: string;
  image: string;
  dependencies: string[];
  port: number;
}

export const prototypeCatalogRows: ServiceCatalogRow[] = [
  ...prototypeServices.filter((service) => service.id !== 'kafka'),
  labApiService,
  prototypeServices.find((service) => service.id === 'kafka') as PrototypeService,
].map(serviceToCatalogRow);

export function mapServicesToCatalogRows(
  services: Array<{
    id: string;
    name: string;
    status: string;
    version: string;
    port: number;
  }>
): ServiceCatalogRow[] {
  if (services.length === 0) {
    return prototypeCatalogRows;
  }

  return services.map((service) => {
    const fallback = [...prototypeServices, labApiService].find((item) => item.name === service.name);

    return {
      id: service.id,
      service: service.name,
      status: mapStatus(service.status),
      version: service.version,
      image: fallback?.image ?? 'service',
      dependencies: fallback?.dependencies ?? [],
      port: service.port,
    };
  });
}

function serviceToCatalogRow(service: PrototypeService): ServiceCatalogRow {
  return {
    id: service.id,
    service: service.name,
    status: service.status,
    version: service.version,
    image: service.image,
    dependencies: service.dependencies,
    port: service.port,
  };
}

function mapStatus(status: string): ServiceStatus {
  if (status === 'running' || status === 'degraded' || status === 'stopped') {
    return status;
  }

  return 'stopped';
}
