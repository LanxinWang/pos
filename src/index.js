const getCartBarcodes = (tags) =>
  tags
    .map((tag) => {
      const [barcode, count = "1"] = tag.split("-");
      return new Array(parseInt(count)).fill(barcode);
    })
    .flat();
module.exports = { getCartBarcodes };
