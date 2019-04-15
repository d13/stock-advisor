import Controller from '@ember/controller';

export default Controller.extend({
    stock: null,
    actions: {
        stockChanged(stock) {
            this.set('stock', stock || null);
        }
    }
});
