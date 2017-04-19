import { fromStores, toStore, combine } from './Subscription';
import { createStore } from 'redux';


describe('Subscription', () => {
    const reducer = (state: any, action: any) => action.type === 'change' ? action.payload : state;
    const store1 = createStore(reducer, { init: true, data: { key: 'value', deepData: { key: 'deeepValue' } } });
    const store2 = createStore(reducer, { init: true, form: { values: { value: 'val' } } });
    const mapper = (state: any) => state.data;
    const subs1 = fromStores([store1], mapper);
    const subs2 = fromStores([store2], state => state.form);
    const comdSub = combine([subs1, subs2], (data, form) => {
        return form.values[data.key]
    });
    const valueStore = toStore(comdSub, store1.dispatch);
    
    
    test('check Subscription', () => {
        expect(subs1).toEqual({ stores: [store1], mapper });
    });

    test('check computed state', () => {
        expect(valueStore.getState()).toBe('val');        
    });
});









