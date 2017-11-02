import Meteor, { getLoginToken } from 'utils/Meteor';

type QueryParameters = {
    [param: string]: string|boolean|number|null;
};

type FetcherOptions<FetcherData = {[key: string]: any}> = {
    route: string,
    query?: QueryParameters;
    onChange?: Function;
    transformData?: (data: any) => FetcherData;
};

export default class Fetcher<FetcherData = any> {

    public data: FetcherData;

    private rawData: any;
    private route: string;
    private query: QueryParameters = {};

    constructor({route, query, onChange, transformData}: FetcherOptions<FetcherData>) {
        this.route = route;
        this.query = query || this.query;
        this.onChange = onChange || this.onChange;
        this.transformData = transformData || this.transformData;
        this.data = {} as FetcherData;
    }

    public async fetch() {
        const baseUrl = !process.env.REACT_APP_DEV ? '/' : 'http://localhost:3000/';

        try {
            const response = await window.fetch(`${baseUrl}${this.route}/?${this.getQueryParams()}`);
            const responseJson = await response.json();

            this.rawData = responseJson;
            this.data = this.transformData(this.rawData);
            this.onChange();

        } catch (err) {
            throw new Error(err);
        }
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

}
