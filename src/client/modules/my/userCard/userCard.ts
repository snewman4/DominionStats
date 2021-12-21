import { api, LightningElement } from 'lwc';

export default class UserCard extends LightningElement {
    @api username;
    @api games;
    @api wins;
    @api points;
}
