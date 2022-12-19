const getCartBarcodes = (tags) =>
  tags
    .map((tag) => {
      const [barcode, count = "1"] = tag.split("-");
      return new Array(parseInt(count)).fill(barcode);
    })
    .flat();

const buildCartItems = (cartBarcodes, allItems) => {
  const item = allItems.find((item) => item.barcode === cartBarcodes[0]);
  item.count = 1;
  return [item];
};
module.exports = { getCartBarcodes, buildCartItems };
