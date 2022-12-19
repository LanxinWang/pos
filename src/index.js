const getCartBarcodes = (tags) =>
  tags
    .map((tag) => {
      const [barcode, count = "1"] = tag.split("-");
      return new Array(parseInt(count)).fill(barcode);
    })
    .flat();

const buildCartItems = (cartBarcodes, allItems) =>
  [...new Set(cartBarcodes)].map((cartBarcode) => {
    const item = allItems.find((item) => item.barcode === cartBarcode);
    item.count = cartBarcodes.filter(
      (barcode) => barcode === cartBarcode
    ).length;
    return item;
  });

const buildReceiptItems = (cartItems, allPromotions) =>
  cartItems.map((cartItem) => {
    const promotion = allPromotions.find((promotion) =>
      promotion.barcodes.includes(cartItem.barcode)
    )?.type;
    const discount =
      promotion === "BUY_TWO_FREE_ONE"
        ? Math.floor(cartItem.count / 3) * cartItem.price
        : 0;
    const subtotal = cartItem.price * cartItem.count - discount;
    return {
      cartItem,
      discount,
      subtotal,
    };
  });

const getTotalPrice = (receiptItems, filed) => {
  return receiptItems.reduce(
    (totalPrice, currentItems) => totalPrice + currentItems[filed],
    0
  );
};

const buildReceipt = (receiptItems) => ({
  receiptItems,
  totalPrice: getTotalPrice(receiptItems, "subtotal"),
  totalDiscount: getTotalPrice(receiptItems, "discount"),
});

module.exports = {
  getCartBarcodes,
  buildCartItems,
  buildReceiptItems,
  buildReceipt,
};
