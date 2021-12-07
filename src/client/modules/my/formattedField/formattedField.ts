import { api, LightningElement } from 'lwc';

export default class FormattedField extends LightningElement {
    @api name;
    @api value;
}