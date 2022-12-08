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
    loadAllItems: jest.fn().mockImplementation(() => mockLoadPromotions),
  }));
});
