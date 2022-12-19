const {
  getCartBarcodes,
  buildCartItems,
  buildReceiptItems,
} = require("../src/index");
const { loadAllItems, loadPromotions } = require("../src/fixtures.js");

describe("getCartBarcodes", () => {
  it("should return cart barcodes when input non-weighting tags", () => {
    const tag = ["ITEM000000", "ITEM000000", "ITEM000001"];
    const expectCartBarcodes = ["ITEM000000", "ITEM000000", "ITEM000001"];

    const result = getCartBarcodes(tag);

    expect(result).toEqual(expectCartBarcodes);
  });
  it("should return cart barcodes when input weighting tags", () => {
    const tag = ["ITEM000002-1", "ITEM000003-2"];
    const expectCartBarcodes = ["ITEM000002", "ITEM000003", "ITEM000003"];

    const result = getCartBarcodes(tag);

    expect(result).toEqual(expectCartBarcodes);
  });
  it("should return cart barcodes when input all kinds of tags", () => {
    const tag = ["ITEM000000", "ITEM000003-2"];
    const expectCartBarcodes = ["ITEM000000", "ITEM000003", "ITEM000003"];

    const result = getCartBarcodes(tag);

    expect(result).toEqual(expectCartBarcodes);
  });
});

describe("buildCartItems", () => {
  it("should return right build cart items when input a cartBarcode", () => {
    const allItems = loadAllItems();
    const cartBarcodes = ["ITEM000000"];
    const expectCartItems = [
      {
        barcode: "ITEM000000",
        name: "可口可乐",
        unit: "瓶",
        price: 3.0,
        count: 1,
      },
    ];

    const result = buildCartItems(cartBarcodes, allItems);

    expect(result).toEqual(expectCartItems);
  });
  it("should return right build cart items when input cartBarcodes", function () {
    const allItems = loadAllItems();
    const cartBarcodes = [
      "ITEM000000",
      "ITEM000000",
      "ITEM000001",
      "ITEM000002",
      "ITEM000003",
      "ITEM000003",
      "ITEM000003",
      "ITEM000003",
    ];
    const expectCartItems = [
      {
        barcode: "ITEM000000",
        name: "可口可乐",
        unit: "瓶",
        price: 3.0,
        count: 2,
      },
      { barcode: "ITEM000001", name: "雪碧", unit: "瓶", price: 3.0, count: 1 },
      { barcode: "ITEM000002", name: "苹果", unit: "斤", price: 5.5, count: 1 },
      {
        barcode: "ITEM000003",
        name: "荔枝",
        unit: "斤",
        price: 15.0,
        count: 4,
      },
    ];

    const result = buildCartItems(cartBarcodes, allItems);

    expect(result).toEqual(expectCartItems);
  });
});

describe("buildReceiptItems", () => {
  it("should return right receipt items when input no BUY_TWO_FREE_ONE cart items", function () {
    const allPromotions = loadPromotions();
    const cartItems = [
      { barcode: "ITEM000001", name: "雪碧", unit: "瓶", price: 3.0, count: 1 },
      {
        barcode: "ITEM000003",
        name: "荔枝",
        unit: "斤",
        price: 15.0,
        count: 4,
      },
    ];
    const expectReceiptItems = [
      {
        cartItem: {
          barcode: "ITEM000001",
          name: "雪碧",
          unit: "瓶",
          price: 3.0,
          count: 1,
        },
        discount: 0.0,
        subtotal: 3.0,
      },
      {
        cartItem: {
          barcode: "ITEM000003",
          name: "荔枝",
          unit: "斤",
          price: 15.0,
          count: 4,
        },
        discount: 0.0,
        subtotal: 60.0,
      },
    ];

    const result = buildReceiptItems(cartItems, allPromotions);

    expect(result).toEqual(expectReceiptItems);
  });
  it("should return right receipt items when input BUY_TWO_FREE_ONE cart items", function () {
    const allPromotions = loadPromotions();
    const cartItems = [
      {
        barcode: "ITEM000000",
        name: "可口可乐",
        unit: "瓶",
        price: 3.0,
        count: 3,
      },
      { barcode: "ITEM000002", name: "苹果", unit: "斤", price: 5.5, count: 7 },
    ];
    const expectReceiptItems = [
      {
        cartItem: {
          barcode: "ITEM000000",
          name: "可口可乐",
          unit: "瓶",
          price: 3.0,
          count: 3,
        },
        discount: 3.0,
        subtotal: 6,
      },
      {
        cartItem: {
          barcode: "ITEM000002",
          name: "苹果",
          unit: "斤",
          price: 5.5,
          count: 7,
        },
        discount: 11.0,
        subtotal: 27.5,
      },
    ];

    const result = buildReceiptItems(cartItems, allPromotions);

    expect(result).toEqual(expectReceiptItems);
  });
  // it("should return right receipt items when input all kinds of cart items", function () {
  //   const allPromotions = loadPromotions();
  //   const cartItems = [
  //     {
  //       barcode: "ITEM000000",
  //       name: "可口可乐",
  //       unit: "瓶",
  //       price: 3.0,
  //       count: 3,
  //     },
  //     { barcode: "ITEM000001", name: "雪碧", unit: "瓶", price: 3.0, count: 1 },
  //     { barcode: "ITEM000002", name: "苹果", unit: "斤", price: 5.5, count: 7 },
  //     {
  //       barcode: "ITEM000003",
  //       name: "荔枝",
  //       unit: "斤",
  //       price: 15.0,
  //       count: 4,
  //     },
  //   ];
  //   const expectReceiptItems = [
  //     {
  //       cartItem: {
  //         barcode: "ITEM000000",
  //         name: "可口可乐",
  //         unit: "瓶",
  //         price: 3.0,
  //         count: 3,
  //       },
  //       discount: 3.0,
  //       subtotal: 6,
  //     },
  //     {
  //       cartItem: {
  //         barcode: "ITEM000001",
  //         name: "雪碧",
  //         unit: "瓶",
  //         price: 3.0,
  //         count: 1,
  //       },
  //       discount: 0.0,
  //       subtotal: 3.0,
  //     },
  //     {
  //       cartItem: {
  //         barcode: "ITEM000002",
  //         name: "苹果",
  //         unit: "斤",
  //         price: 5.5,
  //         count: 7,
  //       },
  //       discount: 11.0,
  //       subtotal: 27.5,
  //     },
  //     {
  //       cartItem: {
  //         barcode: "ITEM000003",
  //         name: "荔枝",
  //         unit: "斤",
  //         price: 15.0,
  //         count: 4,
  //       },
  //       discount: 0.0,
  //       subtotal: 60.0,
  //     },
  //   ];
  //
  //   const result = buildReceiptItems(cartItems, allPromotions);
  //
  //   expect(result).toEqual(expectReceiptItems);
  // });
});
