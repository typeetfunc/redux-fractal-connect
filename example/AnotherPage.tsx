import { mapSubscribtions, Subscription } from '../src/index';
import * as React from 'react';
import { Values, FormChangeAction } from './types';
import Form from './Form';

const mapper = mapSubscribtions({
    values$: [
        [],
        props => props.values
    ]
});

type Props = {
    values$: Subscription<Values>,
    values: Values
    onChange: (values: Values) => void
};

const AnotherPage = mapper(class AnotherPage extends React.Component<Props, undefined> {
    dispatch = (action: FormChangeAction) => {
        if (action.type === 'FORM_CHANGE') {
            this.props.onChange({
                ...this.props.values,
                [action.name]: action.value
            });
        }
        throw new Error('Unsupported action' + JSON.stringify(action))
    };
    render() {
        return <Form values$={this.props.values$} dispatch={this.dispatch}/>;
    }
})

export default AnotherPage;