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
module.exports = { getCartBarcodes, buildCartItems };
