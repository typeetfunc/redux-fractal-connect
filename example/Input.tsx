import * as React from 'react';
import { connect } from 'react-redux';
import { composeStore } from '../src/index';

const composer = composeStore(['values$'], (values, props) => values[props.name]);
const connector = connect(value => ({ value }), dispatch => ({
    onChange: event => dispatch({
        type: 'FORM_CHANGE',
        value: event.target.value,
        name: event.target.name
    })
}));

function Input (props: { onChange: React.ChangeEventHandler<any>, value: string, name: string }) {
    return <input name={props.name} value={props.value} onChange={props.onChange} />;        
}
const WithConnect = composer(connector(Input));

export default WithConnect;