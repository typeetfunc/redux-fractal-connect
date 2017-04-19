const { fromStores, toStore, combine } = require('./Subscription');
const { createStore } = require('redux');
const Benchmark = require('benchmark');

const reducer = (state, action) => action.type === 'change' ? action.payload : state;

const store1 = createStore(reducer, { data: { deepData: { key: 'deeepValue' } } });
const store2 = createStore(reducer, { data: { deepData: { key: 'deeepValue' } } });
const getData = state => state.data.deepData.key;
store1.subscribe(() => {
    getData(store1.getState());
});
const subscribes = fromStores([store2], state => state.data);
const deepSub = combine([subscribes], data => data.deepData);
const keySub = combine([deepSub], deepData => deepData.key);
const keyStore = toStore(keySub);
keyStore.subscribe(() => {
    keyStore.getState();
});

new Benchmark.Suite()
        .add('default subscribes ~~', () => {
            store1.dispatch({
                type: 'change',
                payload: { data: { deepData: { key: '111' } } }
            });
        })
        .add('fractal subscribes ~~', () => {
            store2.dispatch({
                type: 'change',
                payload: { data: { deepData: { key: '111' } } }
            });
        })
        .on('start', (event) => {
            console.log('starting', event.target.name);
        })
        .on('cycle', (event) => {
            console.log('target', String(event.target));
        })
        .on('error', (event) => {
            console.log('error', String(event.target.error));
        })
        .run();