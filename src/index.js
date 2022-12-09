import _ from "lodash";

export const printReceipt = (inputTags, allItems, promotions) => {
  const purchasedItems = getItemsBy(inputTags, allItems, promotions);
  const totalPrice = calculateTotalPriceFor(purchasedItems);
  const totalCount = calculateTotalCountFor(purchasedItems);
  const printPurchasedItemsDetails = printPurchasedItemsFormat(purchasedItems);
  return `
    ***<没钱赚商店>收据***
    ${printPurchasedItemsDetails}
    ----------------------
    总计：${totalPrice.toFixed(2)}(元)
    节省：${totalCount.toFixed(2)}(元)
    **********************`;
};

const getItemsBy = (inputTags, allItems, promotions) => {
  let purchasedItems = [];
  for (let i = 0; i < inputTags.length; i++) {
    const purchasedItemBarcode = inputTags[i].split("-")[0];
    const number = inputTags[i].split("-")[1] || 1;
    const item = _.find(
      allItems,
      (item) => item.barcode === purchasedItemBarcode
    );

    const index = _.findIndex(
      purchasedItems,
      (purchasedItem) => purchasedItem.barcode === purchasedItemBarcode
    );

    if (index >= 0) {
      purchasedItems[index].num += number;
      continue;
    }

    const promotionType = _.find(promotions, (promotion) =>
      promotion.barcodes.includes(purchasedItemBarcode)
    )?.type;

    purchasedItems.push({
      barcode: item.barcode,
      name: item.name,
      unitPrice: item.price,
      unit: item.unit,
      num: number,
      promotionType,
      subtotal: 0,
    });
  }
  const result = purchasedItems.map((item) => {
    item.subtotal = calculateAKindOfItemSubtotalBy(
      item.promotionType,
      item.unitPrice,
      item.num
    );
    return item;
  });
  return result;
};

const calculateTotalPriceFor = (purchasedItems) => {
  return purchasedItems.reduce(
    (totalPrice, currentItem) => totalPrice + currentItem.subtotal,
    0
  );
};

const calculateTotalCountFor = (purchasedItems) =>
  purchasedItems.reduce(
    (totalCount, item) =>
      totalCount +
      calculateAItemCountBy(item.promotionType, item.unitPrice, item.num),
    0
  );

const isBuyTwoFreeOneItem = (itemPromotionType) => {
  return itemPromotionType === "BUY_TWO_GET_ONE_FREE";
};

const calculateAKindOfItemSubtotalBy = (
  itemPromotionType,
  itemUnitPrice,
  num
) => {
  return (
    calculateAItemPriceBy(itemUnitPrice, num) -
    calculateAItemCountBy(itemPromotionType, itemUnitPrice, num)
  );
};

const calculateAItemPriceBy = (itemUnitPrice, num) => {
  return itemUnitPrice * num;
};

const calculateAItemCountBy = (itemPromotionType, itemUnitPrice, num) => {
  if (isBuyTwoFreeOneItem(itemPromotionType) && num >= 3) {
    return (num / 3) * itemUnitPrice;
  }
  return 0;
};

const printPurchasedItemsFormat = (purchasedItems) =>
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
