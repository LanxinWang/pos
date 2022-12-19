const { getCartBarcodes } = require("../src/index");

describe("getCartBarcodes", () => {
  it("should return cart barcodes when input non-weighting tags", () => {
    const tag = ["ITEM000000", "ITEM000000", "ITEM000001"];
    const expectCartBarcodes = ["ITEM000000", "ITEM000000", "ITEM000001"];

    const result = getCartBarcodes(tag);

    expect(result).toEqual(expectCartBarcodes);
  });
  it("should return cart barcodes when input weighting tags", function () {
    const tag = ["ITEM000002-1", "ITEM000003-2"];
    const expectCartBarcodes = ["ITEM000002", "ITEM000003", "ITEM000003"];

    const result = getCartBarcodes(tag);

    expect(result).toEqual(expectCartBarcodes);
  });
  it("should return cart barcodes when input all kinds of tags", function () {
    const tag = ["ITEM000000", "ITEM000003-2"];
    const expectCartBarcodes = ["ITEM000000", "ITEM000003", "ITEM000003"];

    const result = getCartBarcodes(tag);

    expect(result).toEqual(expectCartBarcodes);
  });
});
