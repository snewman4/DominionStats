import { api, LightningElement } from 'lwc';
import { subscribe } from 'my/router';

export default class Route extends LightningElement {
    active = false;

    @api route = '';

    connectedCallback() {
        subscribe(this.onUpdate.bind(this));
    }

    onUpdate(url: string): void {
        if (new RegExp('^' + this.route + '$').test(url)) {
            console.log(`Route ${this.route} activated by ${url}`);
            this.active = true;
        } else {
            console.log(`Route ${this.route} deactivated by ${url}`);
            this.active = false;
        }
    }
}
