import Service from '@ember/service';
import moment from 'moment';

/* global Highcharts */
export default Service.extend({
    createLineChart(element, data, symbol, title) {
        if (!element || !data) {
            return;
        }

        const cats = [];
        const vals = [];
        data.forEach(_ => {
            cats.unshift(moment(_.date, 'YYYY-MM-DD').format('MMM D'));
            vals.unshift(_.close);
        });

        new Highcharts.Chart(element, {
            title: {
                text: title || 'Stock Performance'
            },
            yAxis: {
                title: {
                    text: 'Price'
                }
            },
            xAxis: {
                categories: cats
            },
            series: [{
                name: symbol || 'Stock',
                data: vals
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    }
                }]
            }
        });
    }
});
