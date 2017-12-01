import { Meteor, getLoginToken } from 'utils/Meteor';

interface QueryParameters {
    [param: string]: any
}

interface FetcherOptions<FetcherData = {[key: string]: any}> {
    route: string
    query?: QueryParameters
    onChange?: Function
    transformData?: (data: any) => FetcherData
    onResponse?: (data: any) => void
}

export class Fetcher<FetcherData = any> {

    public data: FetcherData;
    public loading: boolean = false;

    private rawData: any;
    private route: string;
    private query: QueryParameters = {};

    constructor({ route, query, onChange, transformData, onResponse }: FetcherOptions<FetcherData>) {
        this.route = route;
        this.query = query || this.query;
        this.onChange = onChange || this.onChange;
        this.onResponse = onResponse || this.onResponse;
        this.transformData = transformData || this.transformData;
        this.data = {} as FetcherData;
    }

    public async fetch(additionalQueryParams: QueryParameters = {}) {
        this.setLoading(true);

        const baseUrl = !process.env.REACT_APP_DEV ? '/' : 'http://localhost:3000/';

        const params = {
            token: getLoginToken(),
            userId: Meteor.userId(),
            ...this.query,
            ...additionalQueryParams,
        };

        try {
            const response = await window.fetch(`${baseUrl}${this.route}/?${this.toQueryParams(params)}`);
            const responseJson = await response.json();

            this.rawData = responseJson;
            this.onResponse(this.rawData); // call onresponse hook
            this.data = this.transformData(this.rawData);
            this.setLoading(false);
            this.onChange();

        } catch (err) {
            throw err;
        }
    }

    public async fetchMore(additionalQueryParams: QueryParameters, mergeData: (oldData: any, newData: any) => any) {
        this.setLoading(true);

        const baseUrl = !process.env.REACT_APP_DEV ? '/' : 'http://localhost:3000/';

        const params = {
            token: getLoginToken(),
            userId: Meteor.userId(),
            ...this.query,
            ...additionalQueryParams,
        };

        try {
            const response = await window.fetch(`${baseUrl}${this.route}/?${this.toQueryParams(params)}`);
            const responseJson = await response.json();

            this.rawData = mergeData(this.rawData, responseJson);

            this.onResponse(this.rawData); // call onresponse hook
            this.data = this.transformData(this.rawData);
            this.setLoading(false);
            this.onChange();

        } catch (err) {
            throw new Error(err);
        }

    }

    public destroy() {
        this.onChange = () => {
            //
        };
        this.transformData = (data: any) => data;
        this.data = {} as FetcherData;
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
    private onResponse: (data: any) => void = (data: any) => data;
}
