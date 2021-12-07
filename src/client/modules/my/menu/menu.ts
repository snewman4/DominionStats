import { LightningElement } from 'lwc';
import { navigate } from 'my/router';

export default class Menu extends LightningElement {
    menuItemClicked(evt: Event): void {
        evt.preventDefault();
        evt.stopPropagation();

        console.log("Menu Item clicked: ", evt.target);
        const href = (evt.target as any).href;
        navigate(href);
    }
}