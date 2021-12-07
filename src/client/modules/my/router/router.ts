import { parseUrl } from './parser';
import type { RouteAttributes } from './parser';

type RouteCallback = (url: string) => void;

function getCurrentLocation(): string {
    return window.location.pathname + window.location.search + window.location.hash
}

function updateCurrentLocation(): void {
    currentLocation = getCurrentLocation();
}

function notifySubscribers() {
    const location = getCurrentLocation();
    subscribers.forEach((sub) => {
        sub(location);
    });
}

const subscribers: RouteCallback[] = [];
let currentLocation = getCurrentLocation();
window.addEventListener('popstate', () => {
    notifySubscribers();
});


export function subscribe(callback: RouteCallback): void {
    subscribers.push(callback);
    callback(currentLocation);
}

export function navigate(url: string): void {
    window.history.pushState({}, "", url);
    updateCurrentLocation();
    notifySubscribers();
}

/**
 * Use a route spec to parse the current URL into a bag of attributes
 * @param spec express-like route
 * @returns Object of attributes such that `url` is always included, and named attributes from the spec have their single-segment value set
 */
export function parse(spec: string): RouteAttributes {
    return parseUrl(spec, getCurrentLocation());
}