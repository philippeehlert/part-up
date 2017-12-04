import { Meteor, getLoginToken } from 'utils/Meteor';
import { uniqBy } from 'lodash';

interface QueryParameters {
    [param: string]: any;
}

interface FetcherOptions<FetcherResponseData = any, FetcherData = {[key: string]: any}> {
    route: string;
    query?: QueryParameters;
    onChange?: Function;
    transformData?: (data: FetcherResponseData) => FetcherData;
    onResponse?: (data: FetcherResponseData) => void;
}

export class Fetcher<FetcherResponseData = any, FetcherData = any> {

    public data: FetcherData;
    public loading: boolean = false;

    private rawData: Partial<FetcherResponseData>;
    private route: string;
    private query: QueryParameters = {};

    constructor({ route, query, onChange, transformData, onResponse }: FetcherOptions<FetcherResponseData, FetcherData>) {
        this.route = route;
        this.query = query || this.query;
        this.onChange = onChange || this.onChange;
        this.onResponse = onResponse || this.onResponse;
        this.transformData = transformData || this.transformData;
        this.data = {} as FetcherData;
    }

    public async fetch(additionalQueryParams: QueryParameters = {}) {

        try {
            const responseJson = await this.makeRequest(additionalQueryParams);

            return this.handleResponse(responseJson, (responseData) => responseData);

        } catch (err) {
            throw err;
        }
    }

    public async fetchMore(
        additionalQueryParams: QueryParameters,
        mergeData: (
            oldData: Partial<FetcherResponseData>,
            newData: Partial<FetcherResponseData>) => Partial<FetcherResponseData>,
        ) {

        try {
            const responseJson = await this.makeRequest(additionalQueryParams);

            return this.handleResponse(responseJson, (responseData) => mergeData(this.rawData, responseData));

        } catch (err) {
            throw err;
        }

    }

    public destroy() {
        this.onChange = () => {
            //
        };
        this.transformData = (data: any) => data;
        this.data = {} as FetcherData;
    }

    private async makeRequest(additionalQueryParams: QueryParameters) {
        const params = {
            token: getLoginToken(),
            userId: Meteor.userId(),
            ...this.query,
            ...additionalQueryParams,
        };

        const baseUrl = !process.env.REACT_APP_DEV ? '/' : 'http://localhost:3000/';

        this.setLoading(true);

        const response = await window.fetch(`${baseUrl}${this.route}/?${this.toQueryParams(params)}`);
        const responseJson = await response.json() as FetcherResponseData;

        return responseJson;
    }

    private handleResponse(responseJson: FetcherResponseData, merge: (d: FetcherResponseData) => Partial<FetcherResponseData>) {
        this.onResponse(responseJson); // call onresponse hook
        this.rawData = merge(responseJson);
        this.data = this.transformData(this.rawData);
        this.setLoading(false);
        this.onChange();

        return this.rawData;
    }

    private setLoading(value: boolean) {
        this.loading = value;
    }

    private toQueryParams(params: QueryParameters): string {
        return Object
            .keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
    }

    private onChange: Function = () => {
        //
    }

    private transformData: (data: any) => FetcherData = (data: any) => data;
    private onResponse: (data: FetcherResponseData) => void = (data: FetcherResponseData) => data;
}

export function mergeDataByKey(key: string, done: () => void, attribute: string = '_id') {
    return (oldData: any, newData: any) => {
        if (!newData[key] || !newData[key].length) {
            done();

            return {
                [key]: oldData[key],
            };
        }

        return {
            [key]: uniqBy([
                ...oldData[key],
                ...(newData[key] || []),
            ], attribute),
        };
    };
}
