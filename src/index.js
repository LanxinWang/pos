import _ from "lodash";
import { loadAllItems } from "./items";
import { loadPromotions } from "./promotions";

export const printReceipt = (inputTags) => {
  const purchasedItems = getPurchasedItems(inputTags);
  const totalPrice = calculateTotalPrice(purchasedItems);
  const totalDiscount = calculateDiscount(purchasedItems);
  const printPurchasedItemsDetails =
    printPurchasedItemsDetailsFormat(purchasedItems);

  return `
    ***<没钱赚商店>收据***
    ${printPurchasedItemsDetails}
    ----------------------
    总计：${totalPrice.toFixed(2)}(元)
    节省：${totalDiscount.toFixed(2)}(元)
    **********************`;
};

const getPurchasedItems = (inputTags) => {
  const allItems = loadAllItems();
  const promotions = loadPromotions();
  const purchasedItems = [];
  const countMap = getItemsCount(inputTags);

  countMap.forEach((count, barcode) => {
    const {
      name,
      price: unitPrice,
      unit,
    } = _.find(allItems, (item) => item.barcode === barcode);
    const promotionType = _.find(promotions, (promotion) =>
      promotion.barcodes.includes(barcode)
    )?.type;
    const subtotal = calculateAItemSubtotal(promotionType, unitPrice, count);
    purchasedItems.push({
      barcode,
      name,
      unitPrice,
      unit,
      count,
      promotionType,
      subtotal,
    });
  });
  return purchasedItems;
};

const getItemsCount = (inputTags) => {
  const countMap = new Map();
  for (let i = 0; i < inputTags.length; i++) {
    const barcode = inputTags[i].split("-")[0];
    const count = parseInt(inputTags[i].split("-")[1]) || 1;
    countMap.has(barcode)
      ? countMap.set(barcode, countMap.get(barcode) + count)
      : countMap.set(barcode, count);
  }
  return countMap;
};

const calculateTotalPrice = (purchasedItems) =>
  purchasedItems.reduce((totalPrice, item) => totalPrice + item.subtotal, 0);

const calculateDiscount = (purchasedItems) =>
  purchasedItems.reduce(
    (totalDiscount, item) =>
      totalDiscount +
      calculateAItemDiscount(item.promotionType, item.unitPrice, item.count),
    0
  );

const calculateAItemSubtotal = (promotionType, unitPrice, count) =>
  unitPrice * count - calculateAItemDiscount(promotionType, unitPrice, count);

const calculateAItemDiscount = (promotionType, unitPrice, count) =>
  promotionType === "BUY_TWO_GET_ONE_FREE"
    ? Math.floor(count / 3) * unitPrice
    : 0;

const printPurchasedItemsDetailsFormat = (purchasedItems) =>
  purchasedItems
    .map(
      (boughtItem) =>
        `名称：${boughtItem.name}，数量：${boughtItem.count}${
          boughtItem.unit
        }，单价：${boughtItem.unitPrice.toFixed(
          2
        )}(元)，小计：${boughtItem.subtotal.toFixed(2)}(元)
    `
    )
    .join("")
    .trim();
