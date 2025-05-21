import { calculateDistance, toRadius, applyHaversineFormula } from "../../../src/services/distances-calculator-service";
import { Location } from "../../../src/protocols";

describe("distances-calculator-service", () => {
  const saoPaulo: Location = { lat: -23.5505, long: -46.6333 };
  const rioDeJaneiro: Location = { lat: -22.9068, long: -43.1729 };

  it("should convert degrees to radians correctly", () => {
    const degrees = 180;
    const expectedRadians = Math.PI;
    expect(toRadius(degrees)).toBeCloseTo(expectedRadians);
  });

  it("should calculate distance between São Paulo and Rio de Janeiro in KM", () => {
    const distance = calculateDistance(saoPaulo, rioDeJaneiro);
    expect(distance).toBeGreaterThan(350);
    expect(distance).toBeLessThan(450);
  });

  it("should calculate distance between São Paulo and Rio de Janeiro in Miles", () => {
    const distance = calculateDistance(saoPaulo, rioDeJaneiro, true);
    expect(distance).toBeGreaterThan(200);
    expect(distance).toBeLessThan(300);
  });

  it("should apply haversine formula correctly", () => {
    const lat1 = toRadius(saoPaulo.lat);
    const lat2 = toRadius(rioDeJaneiro.lat);
    const dLat = toRadius(rioDeJaneiro.lat - saoPaulo.lat);
    const dLon = toRadius(rioDeJaneiro.long - saoPaulo.long);

    const distance = applyHaversineFormula(lat1, lat2, dLat, dLon, 6371);
    expect(distance).toBeGreaterThan(350);
    expect(distance).toBeLessThan(450);
  });
});
