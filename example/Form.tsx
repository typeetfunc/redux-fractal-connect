import * as React from 'react';
import { Subscription } from '../src/index';
import { FormChangeActionCreator, Values } from './types';
import Input from './Input';


export default function Form({ values$, dispatch }: { values$: Subscription<Values>, dispatch: FormChangeActionCreator }) {
    return <div>
        <Input values$={values$} dispatch={dispatch} name='name'/>
        <Input values$={values$} dispatch={dispatch} name='amount'/>
    </div>;
}