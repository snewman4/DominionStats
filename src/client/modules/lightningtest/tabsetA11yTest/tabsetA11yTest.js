/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, api } from 'lwc';

export default class tabsetA11yTest extends LightningElement {
    @api tabs = [];

    @api
    getTabs() {
        return this.template.querySelectorAll('lightning-tab');
    }

    @api
    getTabBar() {
        return this.template
            .querySelector('lightning-tabset')
            .shadowRoot.querySelector('lightning-tab-bar');
    }
}
