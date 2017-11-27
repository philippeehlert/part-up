import { TranslationFunction } from 'i18next';

let t = undefined;

if (process.env.REACT_APP_DEV) {
    t = (...args: any[]) => window.i18next.t(...args);
} else {
    t = (...args: any[]) => window.TAPi18n.__(...args);
}

export const translate = t as TranslationFunction;
