import hoistNonReactStatics from 'hoist-non-react-statics-es';
import { createStore } from 'redux';
import { PropsStore } from './types';

const wrapDisplayName = (BaseComponent: { displayName?: string, name?: string }, hocName: string) =>
  `${hocName}(${BaseComponent.displayName || BaseComponent.name || 'Component'})`;
const hoistStatics = hoistNonReactStatics;
const createPropsStore = <S>(initialState: S) => createStore(
    (state: S, action: { type: "change", payload: S }) => action.type === 'change' ?
        action.payload :
        state,
    initialState
);
const changeProps = <S>(store: PropsStore<S>, nextProps: S) => store.dispatch({
    type: 'change',
    payload: nextProps
});
function identity<T>(arg: T): T {
    return arg;
}
const dissoc = <T, K extends keyof T>(key: K, obj: T) => {
    const objWithoutKey = Object.assign({}, obj);
    delete objWithoutKey[key];
    return objWithoutKey;
};


export {
    wrapDisplayName,
    hoistStatics,
    createPropsStore,
    changeProps,
    identity,
    dissoc
};