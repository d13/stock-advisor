import { debounce } from '@ember/runloop';
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
    stockSearch: service(),
    value: '',
    results: [],
    searching: false,
    assisting: false,
    validStock: null,
    onSelectionChange: null,
    handleSelection(val) {
        let callback = this.get('onSelectionChange');
        if (callback) {
            callback(val);
        }
    },
    setSearchResults() {
        const entry = this.get('value');
        if (!entry) {
            this.set('assisting', false);
            this.set('searching', false);
            this.set('validStock', null);
            this.set('results', []);
            this.handleSelection(null);
            return;
        }

        this.set('assisting', true);
        this.set('searching', true);

        this.stockSearch.findStocksBySymbol(entry).then(data => {
            if (!data.length) {
                this.set('validStock', null);
                this.set('results', []);
                this.set('searching', false);
                this.handleSelection(null);
                return;
            }

            let validStock = data.find(_ => entry === _.symbol) || null;

            this.set('validStock', null);
            this.set('results', data);
            this.set('searching', false);

            this.handleSelection(validStock);
        });
    },
    didInsertElement() {
        this.element.querySelector('.c-symbol-search__input').focus();
    },
    actions: {
        onSearchEntry() {
            debounce(this, this.setSearchResults, 500);
        },
        onSelectHint(stock) {
            this.set('assisting', false);
            if (this.get('value') !== stock.symbol) {
                this.set('value', stock.symbol);
            }
            this.set('validStock', stock);
            this.set('results', []);

            this.handleSelection(stock);
        }
    }
});
