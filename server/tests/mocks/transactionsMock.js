const initialStocks = [
  {
    userId: 1,
    symbol: 373019,
    buyAmount: 2,
    buyPrice: 184.8,
    operation: "buy",
  },
  {
    userId: 1,
    symbol: 373019,
    buyAmount: 1,
    operation: "buy",
    buyPrice: 183.2,
  },
  {
    userId: 1,
    symbol: 373019,
    sellAmount: 1,
    operation: "sell",
    sellPrice: 183.2,
  },
  {
    userId: 1,
    symbol: 1100957,
    buyAmount: 2,
    operation: "buy",
    buyPrice: 325.2,
  },
  {
    userId: 1,
    symbol: 1100957,
    buyAmount: 2,
    operation: "buy",
    buyPrice: 322.2,
  },
  {
    userId: 2,
    symbol: 373019,
    buyAmount: 2,
    operation: "buy",
    buyPrice: 184.8,
  },
  {
    userId: 2,
    symbol: 373019,
    operation: "buy",
    buyAmount: 1,
    buyPrice: 183.2,
  },
  {
    userId: 2,
    symbol: 373019,
    sellAmount: 1,
    operation: "sell",
    sellPrice: 183.2,
  },
  {
    userId: 2,
    operation: "buy",
    symbol: 1100957,
    buyAmount: 2,
    sellAmount: 0,
    buyPrice: 325.2,
  },
  {
    userId: 2,
    symbol: 1100957,
    buyAmount: 3,
    operation: "buy",
    buyPrice: 322.2,
  },
];

const tradeStocks = [
  {
    userId: 1,
    symbol: 373019,
    buyAmount: 5,
    buyPrice: 184.8,
    operation: "buy",
  },
  {
    userId: 1,
    symbol: 373019,
    sellAmount: 2,
    operation: "sell",
    sellPrice: 325.2,
  },
  {
    userId: 2,
    symbol: 373019,
    operation: "buy",
    buyAmount: 1,
    buyPrice: 183.2,
  },
  {
    userId: 2,
    symbol: 373019,
    sellAmount: 1,
    operation: "sell",
    sellPrice: 183.2,
  },
];

module.exports.initialStocks = initialStocks;
module.exports.tradeStocks = tradeStocks;