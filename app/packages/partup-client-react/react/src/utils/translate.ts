import { TranslationFunction } from 'i18next';

let translate = undefined;

if (process.env.REACT_APP_DEV) {
    translate = (...args: any[]) => window.i18next.t(...args);
} else {
    translate = (...args: any[]) => window.TAPi18n.__(...args);
}

export default translate as TranslationFunction;