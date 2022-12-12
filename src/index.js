import _ from "lodash";
import { loadAllItems } from "./items";
import { loadPromotions } from "./promotions";

export const printReceipt = (inputTags) => {
  const purchasedItems = getPurchasedItemsBy(
    inputTags,
    loadAllItems(),
    loadPromotions()
  );
  const totalPrice = calculateTotalPriceFor(purchasedItems);
  const totalDiscount = calculateDiscountFor(purchasedItems);
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

const getPurchasedItemsBy = (inputTags, allItems, promotions) => {
  let purchasedItems = [];
  for (let i = 0; i < inputTags.length; i++) {
    const purchasedItemBarcode = inputTags[i].split("-")[0];
    const number = inputTags[i].split("-")[1] || 1;
    const { name, price, unit } = _.find(
      allItems,
      (item) => item.barcode === purchasedItemBarcode
    );
    const promotionType = _.find(promotions, (promotion) =>
      promotion.barcodes.includes(purchasedItemBarcode)
    )?.type;

    const itemIndex = itemIndexInPurchasedItems(
      purchasedItems,
      purchasedItemBarcode
    );

    if (itemIndex >= 0) {
      purchasedItems[itemIndex].num += number;
      continue;
    }

    purchasedItems.push({
      barcode: purchasedItemBarcode,
      name,
      unitPrice: price,
      unit,
      num: number,
      promotionType,
      subtotal: 0,
    });
  }

  return purchasedItems.map((item) => {
    item.subtotal = calculateAKindOfItemSubtotalBy(
      item.promotionType,
      item.unitPrice,
      item.num
    );
    return item;
  });
};

const itemIndexInPurchasedItems = (purchasedItems, purchasedItemBarcode) =>
  _.findIndex(
    purchasedItems,
    (purchasedItem) => purchasedItem.barcode === purchasedItemBarcode
  );

const calculateTotalPriceFor = (purchasedItems) =>
  purchasedItems.reduce((totalPrice, item) => totalPrice + item.subtotal, 0);

const calculateDiscountFor = (purchasedItems) =>
  purchasedItems.reduce(
    (totalCount, item) =>
      totalCount +
      calculateAItemDiscountBy(item.promotionType, item.unitPrice, item.num),
    0
  );

const isBuyTwoFreeOneItem = (itemPromotionType) =>
  itemPromotionType === "BUY_TWO_GET_ONE_FREE";

const calculateAKindOfItemSubtotalBy = (promotionType, unitPrice, num) =>
  calculateAItemPriceBy(unitPrice, num) -
  calculateAItemDiscountBy(promotionType, unitPrice, num);

const calculateAItemPriceBy = (unitPrice, num) => unitPrice * num;

const calculateAItemDiscountBy = (promotionType, unitPrice, num) =>
  isBuyTwoFreeOneItem(promotionType) ? Math.floor(num / 3) * unitPrice : 0;

const printPurchasedItemsDetailsFormat = (purchasedItems) =>
  purchasedItems
    .map(
      (boughtItem) =>
        `名称：${boughtItem.name}，数量：${boughtItem.num}${
          boughtItem.unit
        }，单价：${boughtItem.unitPrice.toFixed(
          2
        )}(元)，小计：${boughtItem.subtotal.toFixed(2)}(元)
    `
    )
    .join("")
    .trim();
