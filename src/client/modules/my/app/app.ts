import { LightningElement } from 'lwc';
import { getUsername } from 'my/sessionlib';

export default class App extends LightningElement {
    username = '';
    loggedIn = false;

    connectedCallback() {
        const un = getUsername();
        if (un) {
            this.loggedIn = true;
            this.username = un;
        }
    }
}