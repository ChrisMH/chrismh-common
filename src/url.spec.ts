import { Url } from './url';

describe('Url', () => {

    it('decodes a url', () => {
        let url = new Url('http://address.com:1923/the/123/path?a=1&b=2#24')


        expect(url.protocol).toBe('http');
        expect(url.host).toBe('address.com');
        expect(url.port).toBe(1923);
        expect(url.path).toBe('/the/123/path');
        expect(url.query).toBe('a=1&b=2');
        expect(url.hash).toBe('24');
    });
});
