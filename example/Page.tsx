import { mapSubscribtions, Subscription } from '../src/index';
import * as React from 'react';
import { Values, FormChangeAction, Action, TypeFormInCardUserData, ReduxState, FormValues, SubscriptionToFormValues } from './types';
import { Dispatch } from 'redux';
import Form from './Form';

type Props = {
    dispatch: Dispatch<Action>,
    type: TypeFormInCardUserData,
    pageDate$: SubscriptionToFormValues
};

type OwnProps = {
    values$: Subscription<Values>
};

const mapper = mapSubscribtions({
    values$: [
        ['pageDate$'],
        (pageDate$: FormValues, props: Props) => pageDate$.formValues[props.type]
    ]
});

export default mapper(class Page extends React.Component<Props & OwnProps, void> {
    dispatch = (action: FormChangeAction) => {
        if (action.type === 'FORM_CHANGE') {
            this.props.dispatch({
                changes: {
                    [action.name]: action.value
                },
                type: 'CHANGE_FORM_USER'
            });
        }
        throw new Error('Unsupported action' + JSON.stringify(action))
    };

    render() {
        return <Form values$={this.props.values$} dispatch={this.dispatch} />;
    }
})