import { loadPromotions } from "../src/promotions";

describe("promotions", () => {
  it("should get promotions information when call loadPromotions function", () => {
    const promotions = [
      {
        type: "BUY_TWO_GET_ONE_FREE",
        barcodes: ["ITEM000002", "ITEM000003"],
      },
    ];
    const result = loadPromotions();
    expect(result).toEqual(promotions);
  });
});
