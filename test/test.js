localStorage.clear();
sessionStorage.clear();

function productsChanged() {
    'use strict';
}

var productStore = new AGStorage(localStorage, "products", productsChanged);
productStore.createRecord({
    id: 'P1',
    productname: 'Ice Pop Maker',
    desc: 'Create fun and healthy treats anytime',
    price: '$16.33'
});

productStore.createRecord({
    id: 'P2',
    productname: 'Stainless Steel Food Jar',
    desc: 'Thermos double wall vacuum insulated food jar',
    price: '$14.87'
});

productStore.createRecord({
    id: 'P3',
    productname: 'Shower Caddy',
    desc: 'Non-slip grip keeps your caddy in place',
    price: '$17.99'
});

productStore.createRecord({
    id: 'P4',
    productname: 'VoIP Phone Adapter',
    desc: 'Works with Up to Four VoIP Services Across One Phone Port',
    price: '$47.50'
});
