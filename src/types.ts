import { Store, Unsubscribe, Dispatch } from 'redux';
import { ComponentClass, StatelessComponent, ReactNode } from 'react';
export type PropsStore<S> = Store<S>;
export interface StoreLike<S> {
    subscribe: (listener: () => void) => Unsubscribe,
    getState: () => S,
    dispatch?: Dispatch<S>
};
export type StoresList<S> = Array<Store<S>>;
export type Mapper<S> = (...arg: any[]) => S
export interface Subscription<S> {
    stores: StoresList<any>,
    mapper: Mapper<S>
};
export interface Props {
    [_: string]: any,
    children?: ReactNode
};
export type WrapperProps<P> = P & Props;
export type Component<P> = ComponentClass<P> | StatelessComponent<P>;
export type SubscriptionsList<S> = Array<Subscription<S>>;
