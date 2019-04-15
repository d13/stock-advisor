import DS from 'ember-data';
const { Model } = DS;
/*
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "currency": "USD",
    "price": "198.87",
    "stock_exchange_long": "NASDAQ Stock Exchange",
    "stock_exchange_short": "NASDAQ",
*/
export default Model.extend({
    symbol: DS.attr(),
    name: DS.attr(),
    currency: DS.attr(),
    price: DS.attr(),
    exchangeLong: DS.attr(),
    exchangeShort: DS.attr()
});
