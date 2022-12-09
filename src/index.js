import _ from "lodash";

export const printReceipt = (inputTags, allItems, promotions) => {
  const purchasedItems = getPurchasedItemsBy(inputTags, allItems, promotions);
  const totalPrice = calculateTotalPriceFor(purchasedItems);
  const totalCount = calculateTotalCountFor(purchasedItems);
  const printPurchasedItemsDetails =
    printPurchasedItemsDetailsFormat(purchasedItems);

  return `
    ***<没钱赚商店>收据***
    ${printPurchasedItemsDetails}
    ----------------------
    总计：${totalPrice.toFixed(2)}(元)
    节省：${totalCount.toFixed(2)}(元)
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

    const index = _.findIndex(
      purchasedItems,
      (purchasedItem) => purchasedItem.barcode === purchasedItemBarcode
    );

    if (index >= 0) {
      purchasedItems[index].num += number;
      continue;
    }

    purchasedItems.push({
      barcode: purchasedItemBarcode,
      name: name,
      unitPrice: price,
      unit: unit,
      num: number,
      promotionType,
      subtotal: 0,
    });
  }

  //calculate subtotal price
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

const calculateTotalPriceFor = (purchasedItems) =>
  purchasedItems.reduce((totalPrice, item) => totalPrice + item.subtotal, 0);

const calculateTotalCountFor = (purchasedItems) =>
  purchasedItems.reduce(
    (totalCount, item) =>
      totalCount +
      calculateAItemCountBy(item.promotionType, item.unitPrice, item.num),
    0
  );

const isBuyTwoFreeOneItem = (itemPromotionType) =>
  itemPromotionType === "BUY_TWO_GET_ONE_FREE";

const calculateAKindOfItemSubtotalBy = (promotionType, unitPrice, num) =>
  calculateAItemPriceBy(unitPrice, num) -
  calculateAItemCountBy(promotionType, unitPrice, num);

const calculateAItemPriceBy = (unitPrice, num) => unitPrice * num;

const calculateAItemCountBy = (promotionType, unitPrice, num) => {
  if (isBuyTwoFreeOneItem(promotionType) && num >= 3) {
    return (num / 3) * unitPrice;
  }
  return 0;
};

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
