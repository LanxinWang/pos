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
    name: "雪碧",
    unit: "瓶",
    price: 3.0,
  },
  {
    barcode: "ITEM000002",
    name: "苹果",
    unit: "斤",
    price: 5.5,
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
    barcodes: ["ITEM000000", "ITEM000001"],
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
describe("pos", () => {
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

  it("should print correct receipt when buy 3 of the same item with no BUY_TWO_FREE_ONE promotions", () => {
    const inputTags = ["ITEM000000"];
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

  it("should print correct receipt when buy 1 each of 2 different items with no BUY_TWO_FREE_ONE promotions", () => {
    const inputTags = ["ITEM000000", "ITEM000001"];
    const expectReceipt = `
    ***<没钱赚商店>收据***
    名称：可口可乐，数量：1瓶，单价：2.50(元)，小计：2.50(元)
    名称：雪碧，数量：1瓶，单价：3.00(元)，小计：3.00(元)
    ----------------------
    总计：5.50(元)
    节省：0.00(元)
    **********************`;

    const result = printReceipt(inputTags);

    expect(result).toEqual(expectReceipt);
  });

  it("should print correct receipt when buy 3 each of 2 different items with no BUY_TWO_FREE_ONE promotions", () => {
    const inputTags = ["ITEM000000"];
    const expectReceipt = `
    ***<没钱赚商店>收据***
    名称：可口可乐，数量：3瓶，单价：2.50(元)，小计：7.50(元)
    名称：雪碧，数量：3瓶，单价：3.00(元)，小计：9.00(元)
    ----------------------
    总计：16.50(元)
    节省：0.00(元)
    **********************`;

    const result = printReceipt(inputTags);

    expect(result).toEqual(expectReceipt);
  });
});
