import { LightningElement } from 'lwc';
import { navigate } from 'my/router';
import { loggedIn } from 'my/sessionlib';

export default class Menu extends LightningElement {
    loggedIn = false;
    connectedCallback() {
        this.loggedIn = loggedIn();
    }
    menuItemClicked(evt: Event): void {
        evt.preventDefault();
        evt.stopPropagation();

        console.log("Menu Item clicked: ", evt.target);
        const href = (evt.target as any).href;
        navigate(href);
    }
}