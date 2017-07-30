import 'reflect-metadata';
import * as moment from 'moment'
import { Url } from './url';

export namespace UrlQuery {
    const UrlQueryKey = 'UrlQueryKey';
    const Delimiter = ';';

    
    export class UrlQueryParamConfiguration {
        urlKey: string;
        readOnly: boolean;
    }

    /**
     * A property decorator that applied metadata to a class property allowing it to be
     * serialized to/from a query string
     *
     * Example usage:
     *
     * class QueryClass
     * {
     *     @UrlQueryParam(IsoDateConverter, {urlKey: 'stTm'})
     *     startTime: Date;
     *
     *     @UrlQueryParam(IntConverter) // urlKey will default to pageNumber
     *     pageNumber: number;
     *
     *     @UrlQueryParam(StringConverter)  // urlKey will default to title
     *     title: string;
     * }
     *
     * Configuration object:
     *     urlKey {string} parameter key in the URL
     *     readOnly {boolean} true if the parameter is only read from the url and not written back
     *
     * @param config {Object} configuration object
     * @param converterFactory IUrlConverter The converter to use to convert to/from a URL
     * @returns {Function} A factory function used to apply the metadata to the property
     */
    export function UrlQueryParam(converterFactory: { new (): IUrlConverter }, config?: any): (target: any, propertyKey: string) => void {
        return (target: any, propertyKey: string) => {
            const _config = config as UrlQueryParamConfiguration || new UrlQueryParamConfiguration();

            if (_config.urlKey === undefined) {
                _config.urlKey = propertyKey;
            }
            if (_config.readOnly === undefined) {
                _config.readOnly = false;
            }

            if (converterFactory == null) {
                throw new Error(`UrlQueryParam: converterFactory is undefined for urlKey '${_config.urlKey}'`);
            }

            let classData = Reflect.getMetadata(UrlQueryKey, target) as UrlQueryClassMetadata;
            if (!classData) {
                classData = new UrlQueryClassMetadata();
                Reflect.defineMetadata(UrlQueryKey, classData, target);
            }

            const urlParam = new UrlQueryParamMetadata(_config.urlKey, _config.readOnly, propertyKey, new converterFactory());

            classData.urlParams.push(urlParam);
        };
    }


    /**
     * Deserializes data from a url query string into an object of the supplied type
     *
     * @param query {Object} parameters from the URL as an object
     * @param resultType { new() : TQuery } the desired object type
     * @returns {TQuery} An object created with the parameters in the URL
     */
    export function fromQueryObject<TQuery>(query: any, resultType: { new (): TQuery }): TQuery {
        const result = new resultType();
        const urlParams = getUrlQueryParams(result);

        for (let i = 0; i < urlParams.length; i++) {
            if (!urlParams[i].converter) {
                continue;
            }

            urlParams[i].converter.fromUrl(query, result, urlParams[i]);
        }

        return result;
    }


    /**
     * Deserializes data from a url query string into an object of the supplied type
     *
     * @param params {string} parameters from the URL as a string
     * @param resultType { new() : TQuery } the desired object type
     * @returns {TQuery} An object created with the parameters in the URL
     */
    export function fromQueryString<TQuery>(query: string, resultType: { new (): TQuery }): TQuery {
        const queryObject = Url.QueryStringToObject(query);
        return fromQueryObject(queryObject, resultType);
    }


    /**
     * Converts an object decorated with UrlQueryParam to a plain object
     *
     * @param query TQuery The object to serialize
     * @returns {Object} The resulting object
     */
    export function toQueryObject<TQuery>(query: TQuery): any {
        const urlParams = getUrlQueryParams(query);
        const result = {} as Object;

        for (let i = 0; i < urlParams.length; i++) {
            if (urlParams[i].readOnly || !urlParams[i].converter) {
                continue;
            }

            urlParams[i].converter.toUrl(query, result, urlParams[i])
        }

        return result;
    }

    /**
     * Converts an object decorated with UrlQueryParam to query string
     *
     * @param query TQuery The object to serialize
     * @returns {string} The resulting string
     */
    export function toQueryString<TQuery>(query: TQuery): string {
        const queryObject = toQueryObject(query);
        return Url.ObjectToQueryString(queryObject);
    }


    /**
     * Gets url query paramter metadata from the target object
     *
     * @param target The target object with metadata
     * @returns An array of metadata on the target object
     */
    export function getUrlQueryParams(target: any): Array<UrlQueryParamMetadata> {
        const meta = Reflect.getMetadata(UrlQueryKey, target) as UrlQueryClassMetadata;
        if (!meta) {
            return new Array<UrlQueryParamMetadata>();
        }
        return meta.urlParams;

    }

    export class UrlQueryClassMetadata {
        urlParams = new Array<UrlQueryParamMetadata>();
    }

    export class UrlQueryParamMetadata {
        constructor(public urlKey: string, public readOnly: boolean, public propertyKey: string, public converter: IUrlConverter) {
        }
    }

    export interface IUrlConverter {
        toUrl: (source: any, target: any, pi: UrlQueryParamMetadata) => void;
        fromUrl: (source: any, target: any, pi: UrlQueryParamMetadata) => void;
    }

    export class StringConverter implements IUrlConverter {
        toUrl(source: any, target: any, pi: UrlQueryParamMetadata): void {
            if (!source.hasOwnProperty(pi.propertyKey) || source[pi.propertyKey] === undefined) {
                return;
            }

            if (source[pi.propertyKey]) {
                target[pi.urlKey] = source[pi.propertyKey];
            }
        }

        fromUrl(source: any, target: any, pi: UrlQueryParamMetadata): void {
            const value = source.hasOwnProperty(pi.urlKey) ? source[pi.urlKey] : undefined;
            if (value) {
                target[pi.propertyKey] = value;
            }
        }
    }

    export class IntConverter implements IUrlConverter {
        toUrl(source: any, target: any, pi: UrlQueryParamMetadata): void {
            if (!source.hasOwnProperty(pi.propertyKey) || source[pi.propertyKey] === undefined) {
                return;
            }

            target[pi.urlKey] = source[pi.propertyKey].toString();
        }

        fromUrl(source: any, target: any, pi: UrlQueryParamMetadata): void {
            const value = source.hasOwnProperty(pi.urlKey) ? source[pi.urlKey] : undefined;
            if (value !== undefined) {
                target[pi.propertyKey] = parseInt(value, 10);
            }
        }
    }

    export class BoolConverter implements IUrlConverter {
        toUrl(source: any, target: any, pi: UrlQueryParamMetadata): void {
            if (!source.hasOwnProperty(pi.propertyKey) || source[pi.propertyKey] === undefined) {
                return;
            }

            if (source[pi.propertyKey] !== undefined && source[pi.propertyKey] === true) {
                target[pi.urlKey] = 't';
            }
        }

        fromUrl(source: any, target: any, pi: UrlQueryParamMetadata): void {
            const value = source.hasOwnProperty(pi.urlKey) ? source[pi.urlKey] : undefined;
            if (value !== undefined) {
                target[pi.propertyKey] = (value === 'True' || value === 'true' || value === 't') ? true : false;
            }
        }
    }

    export class IsoDateConverter implements IUrlConverter {
        toUrl(source: any, target: any, pi: UrlQueryParamMetadata): void {
            if (!source.hasOwnProperty(pi.propertyKey) || source[pi.propertyKey] === undefined) {
                return;
            }

            target[pi.urlKey] = moment(source[pi.propertyKey]).toISOString();
        }

        fromUrl(source: any, target: any, pi: UrlQueryParamMetadata): void {
            const value = source.hasOwnProperty(pi.urlKey) ? source[pi.urlKey] : undefined;
            if (value !== undefined) {
                target[pi.propertyKey] = moment(value).toDate();
            }

        }
    }

    export class IntArrayConverter implements IUrlConverter {
        toUrl(source: any, target: any, pi: UrlQueryParamMetadata): void {
            if (!source.hasOwnProperty(pi.propertyKey) || source[pi.propertyKey] === undefined
                || !(source[pi.propertyKey] instanceof Array) || (source[pi.propertyKey] as any[]).length === 0) {
                return;
            }

            target[pi.urlKey] = (source[pi.propertyKey] as any[]).join(Delimiter);
        }

        fromUrl(source: any, target: any, pi: UrlQueryParamMetadata): any {
            const value = source.hasOwnProperty(pi.urlKey) ? source[pi.urlKey] : undefined;
            if (value !== undefined) {
                const array: number[] = [];

                if (value.length > 0) {
                    const elements = value.split(Delimiter);
                    elements.forEach((e: string) => array.push(parseInt(e, 10)));
                }

                target[pi.propertyKey] = array;
            }
        }
    }

    export class StringArrayConverter implements IUrlConverter {
        toUrl(source: any, target: any, pi: UrlQueryParamMetadata): void {
            if (!source.hasOwnProperty(pi.propertyKey) || source[pi.propertyKey] === undefined
                || !(source[pi.propertyKey] instanceof Array) || (source[pi.propertyKey] as any[]).length === 0) {
                return;
            }

            target[pi.urlKey] = (source[pi.propertyKey] as any[]).join(Delimiter);
        }

        fromUrl(source: any, target: any, pi: UrlQueryParamMetadata): any {
            const value = source.hasOwnProperty(pi.urlKey) ? source[pi.urlKey] : undefined;
            if (value !== undefined) {
                const array: string[] = [];

                if (value.length > 0) {
                    const elements = value.split(Delimiter);
                    elements.forEach((e: string) => array.push(e));
                }

                target[pi.propertyKey] = array;
            }
        }
    }
}
