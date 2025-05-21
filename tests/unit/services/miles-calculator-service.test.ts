import { AffiliateStatus, ServiceClass, Trip } from "../../../src/protocols";
import { calculateMiles } from "../../../src/services/miles-calculator-service";
import * as distanceService from "../../../src/services/distances-calculator-service";

describe("miles-calculator-service", () => {
  const baseTrip: Trip = {
    code: "TRIP123",
    origin: { lat: -23.5505, long: -46.6333 },
    destination: { lat: -22.9068, long: -43.1729 },
    miles: false,
    plane: "Boeing 737",
    service: ServiceClass.ECONOMIC,
    affiliate: AffiliateStatus.BRONZE,
    date: "2025-06-10",
  };

  beforeEach(() => {
    jest.spyOn(distanceService, "calculateDistance").mockReturnValue(400);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 0 if trip was paid with miles", () => {
    const trip: Trip = { ...baseTrip, miles: true };
    const result = calculateMiles(trip);
    expect(result).toBe(0);
  });

  it("should calculate basic miles without any bonuses", () => {
    const trip: Trip = { ...baseTrip };
    const result = calculateMiles(trip);
    expect(result).toBe(400);
  });

  it("should apply service class multiplier", () => {
    const trip: Trip = { ...baseTrip, service: ServiceClass.EXECUTIVE };
    const result = calculateMiles(trip);
    expect(result).toBe(600);
  });

  it("should apply affiliate bonus", () => {
    const trip: Trip = { ...baseTrip, affiliate: AffiliateStatus.GOLD };
    const result = calculateMiles(trip);
    expect(result).toBe(500);
  });

  it("should apply birthday bonus in May", () => {
    const trip: Trip = { ...baseTrip, date: "2025-05-15" };
    const result = calculateMiles(trip);
    expect(result).toBe(440);
  });

  it("should apply all bonuses and multipliers correctly", () => {
    const trip: Trip = {
      ...baseTrip,
      service: ServiceClass.FIRST_CLASS,
      affiliate: AffiliateStatus.PLATINUM,
      date: "2025-05-02",
    };
    const result = calculateMiles(trip);
    expect(result).toBe(1320);
  });
});
