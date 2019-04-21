import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed, observer } from '@ember/object';

export default Component.extend({
    stockSearch: service(),
    stock: null,
    history: null,
    todaysPrice: null,
    yesterdaysPrice: null,
    setHistoryData() {
        const stock = this.get('stock');
        if (!stock) {
            this.set('todaysPrice', null);
            this.set('history', null);
            this.set('yesterdaysPrice', null);
            return;
        }

        this.stockSearch.findStockHistoryBySymbol(stock.symbol).then(data => {
            if (!data.length) {
                this.set('history', null);
                this.set('yesterdaysPrice', null);
                return;
            }

            this.set('history', data);
            this.set('todaysPrice', stock.price);
            this.set('yesterdaysPrice', data[1].close);
        });
    },
    init() {
        this._super(...arguments);
        this.setHistoryData();
    },
    stockChanged: observer('stock', function() {
        this.setHistoryData();
    }),
    priceDiff: computed('todaysPrice', 'yesterdaysPrice', function() {
        return Math.abs(this.todaysPrice - this.yesterdaysPrice).toFixed(2);
    }),
    shouldBuy: computed.gt('todaysPrice', 'yesterdaysPrice'),
    shouldSell: computed.lt('todaysPrice', 'yesterdaysPrice')
});
