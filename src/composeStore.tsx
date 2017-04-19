import * as React from 'react';
import { Store } from 'redux';
import { hoistStatics, wrapDisplayName, createPropsStore, changeProps, dissoc } from './utils';
import { toStore, combine } from './Subscription';

import { Mapper, PropsStore, Component, WrapperProps } from './types';

const DEFAULT_OPTIONS = {
    storeKey: 'store',
    wrapDisplayNamePrefix: 'ComposeStore',
    dispatchKey: 'dispatch'
};


export default function composeStore<S, K extends string>(
    subscriptions: K[],
    mapToStore: Mapper<S>,
    options = DEFAULT_OPTIONS
) {
    options = {
        ...DEFAULT_OPTIONS,
        ...options
    };
    return function wrapWithDecompose<P>(WrappedComponent: Component<P>) {

        const displayName = wrapDisplayName(WrappedComponent, options.wrapDisplayNamePrefix);

        class ComposeStore extends React.PureComponent<WrapperProps<P>, void> {
            propsStore: PropsStore<WrapperProps<P>> | null;
            store: Store<S>;
            static displayName = displayName;
            static WrappedComponent = WrappedComponent;

            constructor(props: WrapperProps<P>, context: any) {
                super(props, context);
                this.propsStore = mapToStore.length > subscriptions.length ?
                    createPropsStore(props) :
                    null;
                this.store = toStore<S>(
                    combine<any, S>(subscriptions.map(name => props[name]), mapToStore),
                    props[options.dispatchKey]
                );
            }

            componentWillReceiveProps(nextProps: any) {
                if (this.propsStore) {
                    changeProps(this.propsStore, nextProps);
                }
            }

            render() {
                const rest = dissoc('children', this.props);
                return <WrappedComponent {...rest} {...{[options.storeKey]: this.store}}>
                    {this.props.children}
                </WrappedComponent>;
            }
        };
        return hoistStatics(ComposeStore, WrappedComponent)
    };
}
