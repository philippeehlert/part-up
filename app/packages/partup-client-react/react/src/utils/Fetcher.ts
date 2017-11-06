import Meteor, { getLoginToken } from 'utils/Meteor';

type QueryParameters = {
    [param: string]: any;
};

type FetcherOptions<FetcherData = {[key: string]: any}> = {
    route: string,
    query?: QueryParameters;
    onChange?: Function;
    transformData?: (data: any) => FetcherData;
    onResponse?: (data: any) => void;
};

export default class Fetcher<FetcherData = any> {

    public data: FetcherData;
    public loading: boolean = false;

    private rawData: any;
    private route: string;
    private query: QueryParameters = {};

    constructor({route, query, onChange, transformData, onResponse}: FetcherOptions<FetcherData>) {
        this.route = route;
        this.query = query || this.query;
        this.onChange = onChange || this.onChange;
        this.onResponse = onResponse || this.onResponse;
        this.transformData = transformData || this.transformData;
        this.data = {} as FetcherData;
    }

    public async fetch() {
        this.setLoading(true);

        const baseUrl = !process.env.REACT_APP_DEV ? '/' : 'http://localhost:3000/';

        try {
            const response = await window.fetch(`${baseUrl}${this.route}/?${this.getQueryParams()}`);
            const responseJson = await response.json();

            this.rawData = responseJson;
            this.onResponse(this.rawData); // call onresponse hook
            this.data = this.transformData(this.rawData);
            this.setLoading(false);

        } catch (err) {
            throw new Error(err);
        }
    }

    public destroy() {
        this.onChange = () => {};
        this.transformData = (data: any) => data;
        this.data = {} as FetcherData;
    }

    private setLoading(value: boolean) {
        this.loading = value;
        this.onChange();
    }

    private getQueryParams(): string {
        const params = {
            token: getLoginToken(),
            userId: Meteor.userId(),
            ...this.query,
        };

        return Object
            .keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
    }

    private onChange: Function = () => {};
    private transformData: (data: any) => FetcherData = (data: any) => data;
    private onResponse: (data: any) => void = (data: any) => data;

}
