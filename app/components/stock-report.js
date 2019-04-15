import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed, observer } from '@ember/object';

export default Component.extend({
    stockSearch: service(),
    stock: null,
    history: null,
    todaysPrice: 0,
    yesterdaysPrice: 0,
    setHistoryData() {
        const stock = this.get('stock');
        if (stock) {
            this.stockSearch.findStockHistoryBySymbol(stock.symbol).then(data => {
                console.log(data);
                if (!data.length) {
                    return;
                }
                this.set('history', data);
                this.set('todaysPrice', stock.price);
                this.set('yesterdaysPrice', data[0].close);
            });
        }
    },
    init() {
        this._super(...arguments);
        this.setHistoryData();
    },
    stockChanged: observer('stock', function() {
        this.setHistoryData();
    }),
    priceDiff: computed('todaysPrice', 'yesterdaysPrice', function() {
        return Math.abs(this.todaysPrice - this.yesterdaysPrice);
    }),
    shouldBuy: computed.gt('todaysPrice', 'yesterdaysPrice'),
    shouldSell: computed.lt('todaysPrice', 'yesterdaysPrice')
});
