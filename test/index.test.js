import { printReceipt } from "../src/index";
import { loadAllItems } from "../src/items";
import { loadPromotions } from "../src/promotions";

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
describe("pos print receipts when all items bought with no BUY_TWO_FREE_ONE promotions", () => {
  it("should print correct receipt when buy 1 item with no BUY_TWO_FREE_ONE promotions", () => {
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

  it("should print correct receipt when buy 1-pound weigh-in item with no BUY_TWO_FREE_ONE promotions", () => {
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

  it("should print correct receipt when buy 3 same items with no BUY_TWO_FREE_ONE promotions", () => {
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

  it("should print correct receipt when buy 3-pounds same weigh-in items with no BUY_TWO_FREE_ONE promotions", () => {
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

  it("should print correct receipt when buy 1 item and 2-pound item with no BUY_TWO_FREE_ONE promotions", () => {
    const inputTags = ["ITEM000000", "ITEM000001-2"];
    const expectReceipt = `
    ***<没钱赚商店>收据***
    名称：可口可乐，数量：1瓶，单价：2.50(元)，小计：2.50(元)
    名称：苹果，数量：2斤，单价：5.50(元)，小计：11.00(元)
    ----------------------
    总计：13.50(元)
    节省：0.00(元)
    **********************`;

    const result = printReceipt(inputTags);

    expect(result).toEqual(expectReceipt);
  });
});
