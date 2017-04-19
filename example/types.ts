import { Subscription } from '../src/index';

export type Values = {[_: string]: string};
export type TypeFormInCardUserData = "user" | "moderator" | "advertiser";
export type ChangeFormUserAction = { type: 'CHANGE_FORM_USER', payload: { changes: Values }};
export type Action = ChangeFormUserAction;

export type FormChangeAction = { type: "FORM_CHANGE", name: string, value: string };
export type FormChangeActionCreator = (action: FormChangeAction) => void;
export type SubscriptionToFormValues = Subscription<FormValues>;

export type FormValues = {
    formValues: {
        [_: string]: Values
    }
};



export type ReduxState = {
    cardUserData: FormValues
};