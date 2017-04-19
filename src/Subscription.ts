import { Mapper, StoresList, Subscription, SubscriptionsList } from './types';
import { Dispatch, Store } from 'redux';

function fromStores<S, R>(stores: StoresList<S>, mapper: Mapper<R>) {
  return {
    stores,
    mapper
  };
}

function uniqStoresWithIdx<S>(listRefs: StoresList<S>[]): { stores: StoresList<S>, listWithIdx: number[][] } {
  let uniqRef = new Map();
  let count = 0;
  let listIdx: number[][] = [];
  let uniqRefArr: StoresList<S> = [];
  listRefs.forEach(refList => {
    const listIdxItem = refList.map(ref => {
      if(!uniqRef.has(ref)) {
        uniqRef.set(ref, count);
        uniqRefArr[count] = ref;
        count = count + 1;
      }
      return uniqRef.get(ref);
    });
    listIdx.push(listIdxItem);
  });
  return {
    stores: uniqRefArr,
    listWithIdx: listIdx
  };
}

function getItemsByIdx<T>(idxs: number[], array: ArrayLike<T>): T[] {
  return idxs.map(i => array[i]);
} 

function shallowEqualArgs(argsOld: any[], argsNew: any[]) {
    if (argsOld && argsNew && argsOld.length === argsNew.length) {
        var res = true;

        for (var i = 0; i < argsOld.length; i++) {
            res = argsOld[i] === argsNew[i];
            if (!res) {
                break;
            }
        }
        return res;
    }
    return false;
}


function combine<S, R>(subscriptions: SubscriptionsList<S>, mapper: Mapper<S>): Subscription<R> {
  const storesFromSubscriptions = subscriptions.map(subscription => subscription.stores);
  const { stores, listWithIdx } = uniqStoresWithIdx(storesFromSubscriptions);
  const mappersFromSubscriptions = subscriptions.map(subscription => subscription.mapper);
  let staleArgs: any[] | null = null;
  let staleRes: any = null;
  
  return {
    stores,
    mapper: function mapperForSubscriptions() {
      const originArgs = arguments;
      const mapperArgs = mappersFromSubscriptions.map((mapFn, i) => {
        const innerMapperArgs = getItemsByIdx(listWithIdx[i], originArgs);
        return mapFn.apply(null, innerMapperArgs);
      });
      if (staleArgs === null || !shallowEqualArgs(staleArgs, mapperArgs)) {
        staleRes = mapper.apply(null, mapperArgs)
      }
      staleArgs = mapperArgs;
      
      return staleRes;
    }
  };
}

const nullReplaceReducer = () => {};

function toStore<S>(subscription: Subscription<S>, dispatch: Dispatch<S>): Store<S>  {
  return {
    getState: function getState() {
      const storesStates = subscription.stores.map(store => store.getState());
      return subscription.mapper.apply(null, storesStates);
    },
    subscribe: function subscribe(callback) {
      const storesDisposes = subscription.stores
        .map(store => store.subscribe(callback));
      
      return function unsubscribe() {
        storesDisposes.forEach(dispose => dispose());
      };
    },
    replaceReducer: nullReplaceReducer,
    dispatch
  };
};

export {
  fromStores,
  combine,
  toStore,
  StoresList,
  Subscription,
  SubscriptionsList
};