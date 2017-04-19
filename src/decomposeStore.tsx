import * as React from 'react';
import { hoistStatics, wrapDisplayName,  createPropsStore, changeProps, dissoc } from './utils';

import { fromStores } from './Subscription';
import { Store, Dispatch } from 'redux';
import { Subscription, Mapper, PropsStore, Component, WrapperProps } from './types';


const DEFAULT_OPTIONS = {
    storeKey: 'store',
    wrapDisplayNamePrefix: 'DecomposeStore'
};


export default function decomposeStore<T, S>(
    subscriptionsShape: {
        [K: string]: Mapper<S>
    },
    options = DEFAULT_OPTIONS
) {
    options = {
        ...DEFAULT_OPTIONS,
        ...options
    };
    return function wrapWithDecompose<P, K extends string>(
        WrappedComponent: Component<P & {[F in K]: Subscription<S>} & {dispatch: Dispatch<T>}>) {
        const contextTypes = {
            [options.storeKey]: React.PropTypes.shape({
                subscribe: React.PropTypes.func.isRequired,
                dispatch: React.PropTypes.func.isRequired,
                getState: React.PropTypes.func.isRequired
            })
        };
        const displayName = wrapDisplayName(WrappedComponent, options.wrapDisplayNamePrefix);

        class DecomposeStore extends React.PureComponent<WrapperProps<P>, void> {
            propsStore: PropsStore<WrapperProps<P>> | null;
            store: Store<T>;
            subscribes: {
                [F in K]?: Subscription<S>
            };
            static displayName = displayName;
            static WrappedComponent = WrappedComponent;
            static contextTypes = contextTypes;

            constructor(props: WrapperProps<P>, context: any) {
                super(props, context);

                this.store = props[options.storeKey] || context[options.storeKey];
                const keysShape = Object.keys(subscriptionsShape);
                const dependsOnProps = keysShape
                    .filter(name => subscriptionsShape[name].length === 2).length;
                this.propsStore = dependsOnProps ?
                    createPropsStore(props) :
                    null;
                this.subscribes = {};
                keysShape.forEach(name => {
                    const stores = subscriptionsShape[name].length === 2 && this.propsStore ?
                        [this.store, this.propsStore] :
                        [this.store];
                    
                    this.subscribes[name] = fromStores<T | P, S>(stores, subscriptionsShape[name]);
                });
            }

            componentWillReceiveProps(nextProps: any) {
                if (this.propsStore) {
                    changeProps(this.propsStore, nextProps);
                }
            }

            render() {
                const rest = dissoc('children', this.props);
                return <WrappedComponent {...rest} {...this.subscribes} dispatch={this.store.dispatch}>
                    {this.props.children}
                </WrappedComponent>;
            }
        };

        return hoistStatics(DecomposeStore, WrappedComponent);
    };
}
