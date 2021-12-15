interface Cookie {
    key: string;
    value: string;
}

function toCookie(str: string): Cookie {
    const eq = str.indexOf('=');
    if (eq >= 1) {
        const key = str.substring(0, eq);
        const value = str.substring(eq+1);
        return {
            key,
            value
        };
    } else {
        return {
            key: str,
            value: undefined
        };
    }
}
function getCookies(): Cookie[] {
    return document.cookie.split(';').map(toCookie);
}

function getCookie(key: string): Cookie {
    return getCookies().filter((c) => c.key === key)[0];
}

export function getUsername(): string {
    const c = getCookie('dominionstats-username')
    if (c && typeof c.value === 'string') {
        return decodeURIComponent(c.value);
    } else {
        return undefined;
    }
}

export function loggedIn(): boolean {
    if (getUsername() !== undefined) {
        return true;
    }
    return false;
}