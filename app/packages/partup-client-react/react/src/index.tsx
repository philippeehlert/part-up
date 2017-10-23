import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const checker = setInterval(() => {
  const root = document.getElementById('react-root');
  console.log('setInterval');

  if (root) {
    console.log('RENDER REACT');
    ReactDOM.render(
      <App />,
      root as HTMLElement
    );
    clearInterval(checker);

  }
}, 500)
