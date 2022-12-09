import { printReceipt } from "../src/index";

const mockLoadAllItems = [
  {
    barcode: "ITEM000000",
    name: "可口可乐",
    unit: "瓶",
    price: 2.5,
  },
  {
    barcode: "ITEM000001",
    name: "苹果",
    unit: "斤",
    price: 5.5,
  },
  {
    barcode: "ITEM000002",
    name: "雪碧",
    unit: "瓶",
    price: 3.0,
  },
  {
    barcode: "ITEM000003",
    name: "荔枝",
    unit: "斤",
    price: 15.0,
  },
];
const mockLoadPromotions = [
  {
    type: "BUY_TWO_GET_ONE_FREE",
    barcodes: ["ITEM000002", "ITEM000003"],
  },
];

beforeEach(() => {
  jest.mock("../src/items", () => ({
    loadAllItems: jest.fn().mockImplementation(() => mockLoadAllItems),
  }));
  jest.mock("../src/promotions", () => ({
    loadPromotions: jest.fn().mockImplementation(() => mockLoadPromotions),
  }));
});

describe("pos when input tags with no BUY_TWO_FREE_ONE promotions", () => {
  it("should print correct receipt when input 1 non-weigh-in tag", () => {
    const inputTags = ["ITEM000000"];
    const expectReceipt = `
    ***<没钱赚商店>收据***
    名称：可口可乐，数量：1瓶，单价：2.50(元)，小计：2.50(元)
    ----------------------
    总计：2.50(元)
    节省：0.00(元)
    **********************`;

    const result = printReceipt(inputTags);

    expect(result).toEqual(expectReceipt);
  });

  it("should print correct receipt when input 1 one-pound weigh-in tag", () => {
    const inputTags = ["ITEM000001-1"];
    const expectReceipt = `
    ***<没钱赚商店>收据***
    名称：苹果，数量：1斤，单价：5.50(元)，小计：5.50(元)
    ----------------------
    总计：5.50(元)
    节省：0.00(元)
    **********************`;
    const result = printReceipt(inputTags);
    expect(result).toEqual(expectReceipt);
  });

  it("should print correct receipt when input 3 same non-weigh-in tags", () => {
    const inputTags = ["ITEM000000", "ITEM000000", "ITEM000000"];
    const expectReceipt = `
    ***<没钱赚商店>收据***
    名称：可口可乐，数量：3瓶，单价：2.50(元)，小计：7.50(元)
    ----------------------
    总计：7.50(元)
    节省：0.00(元)
    **********************`;

    const result = printReceipt(inputTags);

    expect(result).toEqual(expectReceipt);
  });

  it("should print correct receipt when input 1 three-pounds weigh-in tags", () => {
    const inputTags = ["ITEM000001-3"];
    const expectReceipt = `
    ***<没钱赚商店>收据***
    名称：苹果，数量：3斤，单价：5.50(元)，小计：16.50(元)
    ----------------------
    总计：16.50(元)
    节省：0.00(元)
    **********************`;

    const result = printReceipt(inputTags);

    expect(result).toEqual(expectReceipt);
  });

  it("should print correct receipt when input 2 same non-weigh-in tags and 1 one-pounds weigh-in tag", () => {
    const inputTags = ["ITEM000000", "ITEM000000", "ITEM000001-1"];
    const expectReceipt = `
    ***<没钱赚商店>收据***
    名称：可口可乐，数量：2瓶，单价：2.50(元)，小计：5.00(元)
    名称：苹果，数量：1斤，单价：5.50(元)，小计：5.50(元)
    ----------------------
    总计：10.50(元)
    节省：0.00(元)
    **********************`;

    const result = printReceipt(inputTags);

    expect(result).toEqual(expectReceipt);
  });
});

describe("pos when input tags with BUY_TWO_FREE_ONE promotions", () => {
  it("should print correct receipt when input 1 non-weigh-in tag", () => {
    const inputTags = ["ITEM000002"];
    const expectReceipt = `
    ***<没钱赚商店>收据***
    名称：雪碧，数量：1瓶，单价：3.00(元)，小计：3.00(元)
    ----------------------
    总计：3.00(元)
    节省：0.00(元)
    **********************`;

    const result = printReceipt(inputTags);

    expect(result).toEqual(expectReceipt);
  });

  it("should print correct receipt when input 1 one-pound weigh-in tag", () => {
    const inputTags = ["ITEM000003-1"];
    const expectReceipt = `
    ***<没钱赚商店>收据***
    名称：荔枝，数量：1斤，单价：15.00(元)，小计：15.00(元)
    ----------------------
    总计：15.00(元)
    节省：0.00(元)
    **********************`;
    const result = printReceipt(inputTags);
    expect(result).toEqual(expectReceipt);
  });

  it("should print correct receipt when input 3 same non-weigh-in tags", () => {
    const inputTags = ["ITEM000002", "ITEM000002", "ITEM000002"];
    const expectReceipt = `
    ***<没钱赚商店>收据***
    名称：雪碧，数量：3瓶，单价：3.00(元)，小计：6.00(元)
    ----------------------
    总计：6.00(元)
    节省：3.00(元)
    **********************`;

    const result = printReceipt(inputTags);

    expect(result).toEqual(expectReceipt);
  });

  it("should print correct receipt when input 1 three-pounds weigh-in tags", () => {
    const inputTags = ["ITEM000003-3"];
    const expectReceipt = `
    ***<没钱赚商店>收据***
    名称：荔枝，数量：3斤，单价：15.00(元)，小计：30.00(元)
    ----------------------
    总计：30.00(元)
    节省：0.00(元)
    **********************`;

    const result = printReceipt(inputTags);

    expect(result).toEqual(expectReceipt);
  });

  it("should print correct receipt when input 2 same non-weigh-in tags and 1 one-pounds weigh-in tag", () => {
    const inputTags = ["ITEM000002", "ITEM000002", "ITEM000001-1"];
    const expectReceipt = `
    ***<没钱赚商店>收据***
    名称：雪碧，数量：2瓶，单价：3.00(元)，小计：6.00(元)
    名称：荔枝，数量：1斤，单价：15.00(元)，小计：15.00(元)
    ----------------------
    总计：21.00(元)
    节省：0.00(元)
    **********************`;

    const result = printReceipt(inputTags);

    expect(result).toEqual(expectReceipt);
  });
});

describe("pos when input all kinds tags", () => {
  it("should print correct receipt when input all kinds of tags", () => {
    const inputTags = [
      "ITEM000000",
      "ITEM000000",
      "ITEM000000",
      "ITEM000001-1",
      "ITEM000002",
      "ITEM000002",
      "ITEM000002",
      "ITEM000001-3",
    ];
    const expectReceipt = `
    ***<没钱赚商店>收据***
    名称：可口可乐，数量：3瓶，单价：2.50(元)，小计：7.50(元)
    名称：苹果，数量：1斤，单价：5.50(元)，小计：5.50(元)
    名称：雪碧，数量：3瓶，单价：3.00(元)，小计：6.00(元)
    名称：荔枝，数量：3斤，单价：15.00(元)，小计：30.00(元)
    ----------------------
    总计：49.00(元)
    节省：18.00(元)
    **********************`;

    const result = printReceipt(inputTags);

    expect(result).toEqual(expectReceipt);
  });
});
