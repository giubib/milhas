import * as milesService from "../../../src/services/miles-service";
import * as milesRepository from "../../../src/repositories/miles-repository";
import * as calculator from "../../../src/services/miles-calculator-service";
import { Trip, ServiceClass, AffiliateStatus } from "../../../src/protocols";

describe("miles-service", () => {
  const fakeTrip: Trip = {
    code: "TEST123",
    origin: { lat: -23.5505, long: -46.6333 },
    destination: { lat: -22.9068, long: -43.1729 },
    miles: false,
    plane: "Boeing 737",
    service: ServiceClass.ECONOMIC,
    affiliate: AffiliateStatus.BRONZE,
    date: "2025-05-20",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateMilesForTrip", () => {
    it("should throw conflict error if miles already exist", async () => {
      jest.spyOn(milesRepository, "findMiles").mockResolvedValue({
        id: 1,
        code: "TEST123",
        miles: 1000,
      });

      const promise = milesService.generateMilesForTrip(fakeTrip);
      await expect(promise).rejects.toEqual({
        type: "conflict",
        message: `Miles already registered for code ${fakeTrip.code}`,
      });
    });

    it("should calculate and save miles if not already generated", async () => {
      jest.spyOn(milesRepository, "findMiles").mockResolvedValue(null);
      jest.spyOn(calculator, "calculateMiles").mockReturnValue(800);
      const saveMock = jest.spyOn(milesRepository, "saveMiles").mockResolvedValue(undefined);

      const result = await milesService.generateMilesForTrip(fakeTrip);
      expect(result).toBe(800);
      expect(saveMock).toHaveBeenCalledWith(fakeTrip.code, 800);
    });
  });

  describe("getMilesFromCode", () => {
    it("should return miles if code exists", async () => {
      jest.spyOn(milesRepository, "findMiles").mockResolvedValue({
        id: 2,
        code: "TEST123",
        miles: 900,
      });

      const result = await milesService.getMilesFromCode("TEST123");
      expect(result).toEqual({
        id: 2,
        code: "TEST123",
        miles: 900,
      });
    });

    it("should throw not_found error if code does not exist", async () => {
      jest.spyOn(milesRepository, "findMiles").mockResolvedValue(null);

      const promise = milesService.getMilesFromCode("UNKNOWN");
      await expect(promise).rejects.toEqual({
        type: "not_found",
        message: `Miles not found for code UNKNOWN`,
      });
    });
  });
});
