import { api, LightningElement } from 'lwc';

const userRoute = '/user/';
export default class UserLink extends LightningElement {
    userHref = userRoute;
    userName = '';

    @api
    set user(userName: string) {
        this.userName = userName;
        this.userHref = userRoute + userName;
    }
    get user() {
        return this.userName;
    }
}