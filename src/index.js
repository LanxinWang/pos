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

const buildReceipt = (receiptItems) => ({
  receiptItems,
  totalPrice: receiptItems.reduce(
    (totalPrice, currentItems) => totalPrice + currentItems.subtotal,
    0
  ),
  totalDiscount: receiptItems.reduce(
    (totalPrice, currentItems) => totalPrice + currentItems.discount,
    0
  ),
});

module.exports = {
  getCartBarcodes,
  buildCartItems,
  buildReceiptItems,
  buildReceipt,
};
