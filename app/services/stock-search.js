import Service from '@ember/service';
import moment from 'moment';
import $ from 'jquery';

// const history = {
//     history: {
//         "2019-04-12":{"open":"3.77","close":"3.77","high":"3.77","low":"3.77","volume":"0"},
//         "2019-04-11":{"open":"3.69","close":"3.69","high":"3.69","low":"3.69","volume":"0"},
//         "2019-04-10":{"open":"3.86","close":"3.86","high":"3.86","low":"3.86","volume":"0"},
//         "2019-04-09":{"open":"3.70","close":"3.70","high":"3.70","low":"3.70","volume":"0"},
//         "2019-04-08":{"open":"3.60","close":"3.60","high":"3.60","low":"3.60","volume":"0"},
//         "2019-04-05":{"open":"3.48","close":"3.48","high":"3.48","low":"3.48","volume":"0"},
//         "2019-04-04":{"open":"3.34","close":"3.34","high":"3.34","low":"3.34","volume":"0"},
//         "2019-04-03":{"open":"3.35","close":"3.35","high":"3.35","low":"3.35","volume":"0"},
//         "2019-04-02":{"open":"3.37","close":"3.37","high":"3.37","low":"3.37","volume":"0"},
//         "2019-04-01":{"open":"3.26","close":"3.26","high":"3.26","low":"3.26","volume":"0"},
//         "2019-03-29":{"open":"3.26","close":"3.26","high":"3.26","low":"3.26","volume":"0"}
//     }
// };

export default Service.extend({
    _makeRequest(endpoint, props) {
        const params = Object.assign({}, props, { endpoint });

        const qs = Object.keys(params).map((val, i) => `${i === 0 ? '?' : '&'}${val}=${params[val]}`).join('');
        return $.getJSON(`http://keithdaulton.com/stocks.php${qs}`);
    },
    findStocksBySymbol(symbol) {
        //return $.Deferred().resolve({"message":"Your account has a max limit of 5. Upgrade your account to your limit.","total_returned":5,"total_results":309,"total_pages":62,"limit":5,"page":1,"data":[{"symbol":"1DAA.F","name":"Digital Ally, Inc.","currency":"EUR","price":"3.77","stock_exchange_long":"Frankfurt Stock Exchange","stock_exchange_short":"FRA"},{"symbol":"2AAP.L","name":"LEV/ETP 2X APPLE 20670403","currency":"GBX","price":"1204.50","stock_exchange_long":"London Stock Exchange","stock_exchange_short":"LSE"},{"symbol":"3CAA.F","name":"China Automation Group Limited","currency":"EUR","price":"0.08","stock_exchange_long":"Frankfurt Stock Exchange","stock_exchange_short":"FRA"},{"symbol":"55AA.F","name":"THAI NVDR COMPA/NVDR","currency":"EUR","price":"0.11","stock_exchange_long":"Frankfurt Stock Exchange","stock_exchange_short":"FRA"},{"symbol":"5AA.F","name":"Wijaya Karya (Persero) Tbk PT","currency":"EUR","price":"0.12","stock_exchange_long":"Frankfurt Stock Exchange","stock_exchange_short":"FRA"}]})
        return this._makeRequest('stock_search', {
            search_by: 'symbol',
            search_term: symbol
        })
        .then(data => {
            if (!data || !data.data || !data.data.length) {
                return [];
            }
            return data.data.map(_ => {
                return {
                    symbol: _.symbol,
                    name: _.name,
                    currency: _.currency,
                    price: parseFloat(_.price),
                    exchangeLong: _.stock_exchange_long,
                    exchangeShort: _.stock_exchange_short
                };
            });
        });
    },
    findStockHistoryBySymbol(symbol) {
        const theDate = moment();
        const dateEnd = theDate.format('YYYY-MM-DD');
        const dateStart = theDate.subtract(2, 'weeks').format('YYYY-MM-DD');
        //return $.Deferred().resolve(history)
        return this._makeRequest('history', {
            sort: 'newest',
            symbol: symbol,
            date_from: dateStart,
            date_to: dateEnd
        })
        .then(data => {
            if (!data || !data.history) {
                return [];
            }

            return Object.keys(data.history).map(key => {
                let point = Object.assign({}, data.history[key], {
                    date: key
                });

                Object.keys(point).filter(_ => _ !== 'date').forEach(key => {
                    point[key] = parseFloat(point[key]);
                });

                return point;
            });
        });
    }
});
