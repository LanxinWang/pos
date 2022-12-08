const printReceipt = require("../src/index");
describe("pos", () => {
  it("should print correct receipt", () => {
    const inputTags = [
      "ITEM000001",
      "ITEM000001",
      "ITEM000001",
      "ITEM000001",
      "ITEM000001",
      "ITEM000003-2",
      "ITEM000005",
      "ITEM000005",
      "ITEM000005",
    ];
    const expectReceipt = `
    ***<没钱赚商店>收据***
    名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
    名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)
    名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
    ----------------------
    总计：51.00(元)
    节省：7.50(元)
    **********************`;

    const result = printReceipt(inputTags);

    expect(result).toEqual(expectReceipt);
  });
});