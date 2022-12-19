const {
  getCartBarcodes,
  buildCartItems,
  buildReceiptItems,
  buildReceipt,
  formatReceipt,
  printReceipt,
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
  it("should return right receipt items when input all kinds of cart items", function () {
    const allPromotions = loadPromotions();
    const cartItems = [
      {
        barcode: "ITEM000000",
        name: "可口可乐",
        unit: "瓶",
        price: 3.0,
        count: 3,
      },
      { barcode: "ITEM000001", name: "雪碧", unit: "瓶", price: 3.0, count: 1 },
      { barcode: "ITEM000002", name: "苹果", unit: "斤", price: 5.5, count: 7 },
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
          barcode: "ITEM000002",
          name: "苹果",
          unit: "斤",
          price: 5.5,
          count: 7,
        },
        discount: 11.0,
        subtotal: 27.5,
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
});

describe("buildReceipt", () => {
  it("should return right receipt when input a receipt item", function () {
    const receiptItems = [
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
    ];
    const expectReceipt = {
      receiptItems,
      totalPrice: 6,
      totalDiscount: 3,
    };

    const result = buildReceipt(receiptItems);

    expect(result).toEqual(expectReceipt);
  });
  it("should return right receipt when input receipt items", function () {
    const receiptItems = [
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
          barcode: "ITEM000002",
          name: "苹果",
          unit: "斤",
          price: 5.5,
          count: 7,
        },
        discount: 11.0,
        subtotal: 27.5,
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
    const expectReceipt = {
      receiptItems,
      totalPrice: 96.5,
      totalDiscount: 14,
    };

    const result = buildReceipt(receiptItems);

    expect(result).toEqual(expectReceipt);
  });
});

describe("formatReceipt", () => {
  it("should get right receipt formation when in put a receipt item", function () {
    const receipt = {
      receiptItems: [
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
      ],
      totalPrice: 6,
      totalDiscount: 3,
    };

    const expectReceipt = `
        ***<没钱赚商店>收据***
        名称：可口可乐，数量：3瓶，单价：3.00(元)，小计：6.00(元)
        ----------------------
        总计：6.00(元)
        节省：3.00(元)
        **********************`;

    const result = formatReceipt(receipt);

    expect(result).toEqual(expectReceipt);
  });
  it("should get right receipt formation when in put some receipt items", function () {
    const receipt = {
      receiptItems: [
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
            barcode: "ITEM000002",
            name: "苹果",
            unit: "斤",
            price: 5.5,
            count: 7,
          },
          discount: 11.0,
          subtotal: 27.5,
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
      ],
      totalPrice: 96.5,
      totalDiscount: 14,
    };

    const expectReceipt = `
        ***<没钱赚商店>收据***
        名称：可口可乐，数量：3瓶，单价：3.00(元)，小计：6.00(元)
        名称：雪碧，数量：1瓶，单价：3.00(元)，小计：3.00(元)
        名称：苹果，数量：7斤，单价：5.50(元)，小计：27.50(元)
        名称：荔枝，数量：4斤，单价：15.00(元)，小计：60.00(元)
        ----------------------
        总计：96.50(元)
        节省：14.00(元)
        **********************`;

    const result = formatReceipt(receipt);

    expect(result).toEqual(expectReceipt);
  });
});

describe("printReceipt", () => {
  beforeAll(() => {
    jest.spyOn(console, "log");
  });
  it("should print empty warning when input empty tag", function () {
    const tags = [];
    const expectReceiptWarning = "input is empty";

    printReceipt(tags);

    expect(console.log).toHaveBeenCalledWith(expectReceiptWarning);
  });
  it("should print receipt when input non-weighting tags", function () {
    const tags = ["ITEM000000", "ITEM000000", "ITEM000000", "ITEM000001"];

    const expectReceipt = `
        ***<没钱赚商店>收据***
        名称：可口可乐，数量：3瓶，单价：3.00(元)，小计：6.00(元)
        名称：雪碧，数量：1瓶，单价：3.00(元)，小计：3.00(元)
        ----------------------
        总计：9.00(元)
        节省：3.00(元)
        **********************`;

    printReceipt(tags);

    expect(console.log).toHaveBeenCalledWith(expectReceipt);
  });
  it("should print receipt when input weighting tags", function () {
    const tags = ["ITEM000002-7", "ITEM000003-4"];

    const expectReceipt = `
        ***<没钱赚商店>收据***
        名称：苹果，数量：7斤，单价：5.50(元)，小计：27.50(元)
        名称：荔枝，数量：4斤，单价：15.00(元)，小计：60.00(元)
        ----------------------
        总计：87.50(元)
        节省：11.00(元)
        **********************`;

    printReceipt(tags);

    expect(console.log).toHaveBeenCalledWith(expectReceipt);
  });
  it("should print receipt when input all kinds of tags", function () {
    const tags = [
      "ITEM000000",
      "ITEM000000",
      "ITEM000000",
      "ITEM000001",
      "ITEM000002-7",
      "ITEM000003-4",
    ];
    const expectReceipt = `
        ***<没钱赚商店>收据***
        名称：可口可乐，数量：3瓶，单价：3.00(元)，小计：6.00(元)
        名称：雪碧，数量：1瓶，单价：3.00(元)，小计：3.00(元)
        名称：苹果，数量：7斤，单价：5.50(元)，小计：27.50(元)
        名称：荔枝，数量：4斤，单价：15.00(元)，小计：60.00(元)
        ----------------------
        总计：96.50(元)
        节省：14.00(元)
        **********************`;

    printReceipt(tags);

    expect(console.log).toHaveBeenCalledWith(expectReceipt);
  });
});
