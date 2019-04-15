import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
    chartBuilder: service(),
    stock: null,
    data: null,
    didInsertElement() {
        this._super(...arguments);

        let data = this.get('data');
        if (!data || !data.length) {
            return;
        }

        this.chartBuilder.createLineChart(this.element.querySelector('.o-chart'), this.data, this.stock.symbol);
    }
});
