import { faker } from "@faker-js/faker";
import { Trip, ServiceClass, AffiliateStatus } from "../../../src/protocols";

export function generateTrip(overrides?: Partial<Trip>): Trip {
  return {
    code: faker.string.alphanumeric(6).toUpperCase(),
    origin: {
      lat: faker.location.latitude({ min: -90, max: 90 }),
      long: faker.location.longitude({ min: -180, max: 180 }),
    },
    destination: {
      lat: faker.location.latitude({ min: -90, max: 90 }),
      long: faker.location.longitude({ min: -180, max: 180 }),
    },
    miles: false,
    plane: faker.helpers.arrayElement(["Boeing 737", "Airbus A320", "Embraer 190"]),
    service: faker.helpers.arrayElement(Object.values(ServiceClass)),
    affiliate: faker.helpers.arrayElement(Object.values(AffiliateStatus)),
    date: faker.date.future({ years: 1 }).toISOString().split("T")[0],
    ...overrides,
  };
}
