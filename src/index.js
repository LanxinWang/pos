// import _ from "lodash";

const _ = require("lodash");
const { loadAllItems } = require("./items");
const allItems = loadAllItems();

const printReceipt = (inputTags, promotions) => {
  console.log(allItems);

  const purchasedItems = getItemsBy(inputTags, promotions);
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

const getItemsBy = (inputTags, promotions) => {
  let result = [];
  //generate purchased items
  for (let tag = 0; tag < inputTags.length; tag++) {
    const itemBarcode = inputTags[tag].split("-")[0];
    const number = inputTags[tag].split("-")[1] || 1;
    console.log("number:", number);
    const item = _.find(allItems, (item) => item.barcode === itemBarcode);
    console.log(
      "``````:",
      _.find(result, (item) => item.barcode === itemBarcode)
    );
    // if (_.find(result, (item) => item.barcode === itemBarcode)) {
    //   console.log("-----enter-----");
    //   const index = _.findIndex(
    //     result,
    //     (boughtItem) => boughtItem.barcode === itemBarcode
    //   );
    //   console.log("index", index);
    //   console.log("result[index]", result[index]);
    //   result[index].num += number;
    // }
    const promotionType = _.find(promotions, (promotion) =>
      promotion.barcodes.includes(itemBarcode)
    )?.type;
    const subtotal = calculateAKindOfItemSubtotalBy(
      promotionType,
      item.price,
      number
    );
    result.push({
      name: item.name,
      unitPrice: item.price,
      unit: item.unit,
      num: number,
      promotionType,
      subtotal,
    });
  }
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
      calculateAItemCountBy(item.promotionType, item.price, item.num),
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
    .map((boughtItem) => {
      return `名称：${boughtItem.name}，数量：${boughtItem.num}${
        boughtItem.unit
      }，单价：${boughtItem.price.toFixed(
        2
      )}(元)，小计：${boughtItem.subtotal.toFixed(2)}(元)`;
    })
    .join("\n");

module.exports = {
  printReceipt,
};
