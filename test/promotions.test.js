import { loadPromotions } from "../src/promotions";

describe("promotions", () => {
  it("should get promotions information when call loadPromotions function", () => {
    const promotionsInformation = [
      {
        type: "BUY_TWO_GET_ONE_FREE",
        barcodes: ["ITEM000000", "ITEM000001", "ITEM000005"],
      },
    ];
    const result = loadPromotions();
    expect(result).toEqual(promotionsInformation);
  });
});
