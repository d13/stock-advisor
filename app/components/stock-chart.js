import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
import { once } from '@ember/runloop';

export default Component.extend({
    chartBuilder: service(),
    stock: null,
    data: null,
    chartInstance: null,
    updateChart() {
        let data = this.get('data');
        let stock = this.get('stock');
        const chartInstance = this.get('chartInstance');

        if (!stock || !data || !data.length) {
            if (chartInstance) {
                chartInstance.destroy();
                this.set('chartInstance', null);
            }
            return;
        }

        if (chartInstance) {
            const series = chartInstance.series[0];
            series.update({ name: stock.symbol }, false);
            series.setData(data);
        } else {
            this.set('chartInstance', this.chartBuilder.createLineChart(this.element.querySelector('.o-chart'), data, stock.symbol));
        }
    },
    didInsertElement() {
        this._super(...arguments);
        this.updateChart();
    },
    attrsChanged: observer('stock', 'data', function() {
        once(this, 'updateChart');
    })
});
