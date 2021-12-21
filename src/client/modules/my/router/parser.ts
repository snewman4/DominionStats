export interface RouteAttributes {
    url: string;
    [key: string]: string;
}

interface UrlBasics {
    segments: string[];
    query: Attributes;
    hash: string;
}
interface Attributes {
    [key: string]: string;
}

function querySplit(search: string): Attributes {
    return search.split('&').reduce((accum, queryStr) => {
        if (!queryStr.includes('=')) {
            accum[queryStr] = null;
        } else {
            const queryPair = singleSplit(queryStr, '=');
            accum[queryPair[0]] = queryPair[1] || '';
        }
        return accum;
    }, {});
}
function urlSplit(url: string): UrlBasics {
    const splitHash = singleSplit(url, '#');
    const splitQuery = singleSplit(splitHash[0], '?');

    return {
        segments: splitQuery[0].split('/'),
        query: splitQuery[1] ? querySplit(splitQuery[1]) : {},
        hash: splitHash[1] ? splitHash[1] : ''
    };
}

// e.g. /foo?bar=baz split ? => [ /foo, bar=baz ]
function singleSplit(str: string, needle: string): string[] {
    const idx = str.indexOf(needle);
    if (idx >= 0) {
        return [str.substring(0, idx), str.substring(needle.length + idx)];
    } else {
        return [str];
    }
}

export function parseUrl(
    spec: string,
    url: string
): RouteAttributes | undefined {
    const attributes = { url };
    const urlObj = urlSplit(url);
    const specObj = urlSplit(spec);

    if (urlObj.segments.length === specObj.segments.length) {
        urlObj.segments.forEach((seg, i) => {
            const specSeg = specObj.segments[i];
            if (specSeg.startsWith(':')) {
                attributes[specSeg.substring(1)] = seg;
            } else if (seg !== specSeg) {
                return undefined;
            }
        });
        // If the query key exists in the spec, include the URL specified value in the attributes bundle
        Object.entries(specObj.query).forEach(([key, value], i) => {
            attributes[key] = Object.entries(urlObj.query)[i][1];
        });
        // TODO: hash attributes?
        return attributes;
    } else {
        return undefined;
    }
}
