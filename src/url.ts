export class Url {
    static UrlMatcher = /^(\w*)(:\/\/)?([^\s\/?#:]*)(:?)(\d*)([^\s?#]*)(\??)([^\s#]*)(#?)([\S]*)/;

    protocol: string;
    host: string;
    port: number;
    path: string;
    query: string;
    hash: string;

    static QueryStringToObject(query: string): any {
        const result: {[key: string]: any} = {};

        query.split('&').forEach((p: string) => {
            const parts = p.split('=');
            result[parts[0]] = parts.length === 1 ? true : parts[1];
        });

        return result;
    }

    static ObjectToQueryString(query: {[key: string]: any}): string {
        const parts = new Array<string>();
        for (const prop in query) {
            if (query.hasOwnProperty(prop)) {
                parts.push(`${prop}=${query[prop]}`);
            }
        }
        return parts.join('&');
    }

    constructor(url: string) {
        const matched = url.trim().match(Url.UrlMatcher);

        this.protocol = matched[1];
        this.host = matched[3];
        this.port = matched[5] ? +matched[5] : undefined;
        this.path = matched[6];
        this.query = decodeURIComponent(matched[8]);
        this.hash = matched[10];
    }

    pathParts(): string[] {
        return this.path.split('/').filter((p: string) => p.length > 0);
    }
}
