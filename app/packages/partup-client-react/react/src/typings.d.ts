declare module '*.json' {
    type jsonImport = {
        [key: string]: any
    }

    const value: jsonImport;

    export default value;
}
