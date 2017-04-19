import * as React from 'react';
import { hoistStatics, wrapDisplayName, createPropsStore, changeProps, identity, dissoc } from './utils';
import { fromStores } from './Subscription';
import { Subscription, Mapper, PropsStore, Component, WrapperProps } from './types';

function dependOnProps([propsList, fn]: Array<{ length: number }>) {
    return fn.length > propsList.length; 
}
const DEFAULT_OPTIONS = {
    wrapDisplayNamePrefix: 'MapSubscribtions'
};

export default function mapSubscribtions<S>(
    subscriptionsMappers: {
        [_: string]: [string[], Mapper<S>]
    },
    options = DEFAULT_OPTIONS
) {
    return function wrapWithMapSubscriptions<P>(WrappedComponent: Component<P>) {
        const displayName = wrapDisplayName(WrappedComponent, options.wrapDisplayNamePrefix);
        class MapSubscribtions extends React.PureComponent<WrapperProps<P>, void> {
            propsStore: PropsStore<WrapperProps<P>> | null;
            mappedSubscriptions: {
                [_: string]: Subscription<S>
            } = {};
            static displayName = displayName;
            static WrappedComponent = WrappedComponent;
            constructor(props: WrapperProps<P>, context: any) {
                super(props, context);
                this.propsStore = Object.keys(subscriptionsMappers)
                    .filter(name => dependOnProps(subscriptionsMappers[name])) ?
                        createPropsStore(props) :
                        null;

                Object.keys(subscriptionsMappers).forEach(name => {
                    const subs = subscriptionsMappers[name][0].map(nameSubInProp => props[nameSubInProp]);
                    if (this.propsStore && dependOnProps(subscriptionsMappers[name])) {
                        subs.push(fromStores([this.propsStore], identity));
                    }
                    this.mappedSubscriptions[name] = combine(
                        subs,
                        subscriptionsMappers[name][1]
                    );
                })
            }

             componentWillReceiveProps(nextProps: any) {
                if (this.propsStore) {
                    changeProps(this.propsStore, nextProps);
                }
            }

            render() {
                const rest = dissoc('children', this.props);
                return <WrappedComponent {...rest} {...this.mappedSubscriptions}>
                    {this.props.children}
                </WrappedComponent>;
            }
        };
        return hoistStatics(MapSubscribtions, WrappedComponent)
    };
}
