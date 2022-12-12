import _ from "lodash";
import { loadAllItems } from "./items";
import { loadPromotions } from "./promotions";

export const printReceipt = (inputTags) => {
  const purchasedItems = getPurchasedItems(inputTags);
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

const getPurchasedItems = (inputTags) => {
  const allItems = loadAllItems();
  const promotions = loadPromotions();
  const uniqInputTags = _.uniq(inputTags);

  const purchasedItems = uniqInputTags.map((uniqInputTag) => {
    const barcode = uniqInputTag.split("-")[0];
    const count =
      uniqInputTag.split("-")[1] ||
      inputTags.filter((tag) => tag === uniqInputTag).length;
    const {
      name,
      price: unitPrice,
      unit,
    } = _.find(allItems, (item) => item.barcode === barcode);
    const promotionType = _.find(promotions, (promotion) =>
      promotion.barcodes.includes(barcode)
    )?.type;
    const subtotal = calculateAKindOfItemSubtotalBy(
      promotionType,
      unitPrice,
      count
    );
    return {
      barcode,
      name,
      unitPrice,
      unit,
      count,
      promotionType,
      subtotal,
    };
  });

  return purchasedItems;
};

const calculateTotalPriceFor = (purchasedItems) =>
  purchasedItems.reduce((totalPrice, item) => totalPrice + item.subtotal, 0);

const calculateDiscountFor = (purchasedItems) =>
  purchasedItems.reduce(
    (totalCount, item) =>
      totalCount +
      calculateAItemDiscountBy(item.promotionType, item.unitPrice, item.count),
    0
  );

const isBuyTwoFreeOneItem = (itemPromotionType) =>
  itemPromotionType === "BUY_TWO_GET_ONE_FREE";

const calculateAKindOfItemSubtotalBy = (promotionType, unitPrice, count) =>
  calculateAItemPriceBy(unitPrice, count) -
  calculateAItemDiscountBy(promotionType, unitPrice, count);

const calculateAItemPriceBy = (unitPrice, count) => unitPrice * count;

const calculateAItemDiscountBy = (promotionType, unitPrice, count) =>
  isBuyTwoFreeOneItem(promotionType) ? Math.floor(count / 3) * unitPrice : 0;

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
