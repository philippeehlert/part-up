import { renderToString } from 'react-dom/server';

export const renderToTranslatableString = (thing: JSX.Element) => {
    return renderToString(thing).replace('__', '||');
};
