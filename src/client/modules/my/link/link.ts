import { api, LightningElement } from 'lwc';
import { navigate } from 'my/router';

export default class Link extends LightningElement {
    @api href = "#";
    @api iconName = "";
    @api label = "";

    onclick(evt: Event) {
        // We handle SPA navigations through the router
        evt.stopPropagation();
        evt.preventDefault();

        navigate(this.href);
    }
}