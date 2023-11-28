import React from 'react';
import { render } from 'react-dom'
import App from './App';
let el = document.getElementById('root') as HTMLElement;
render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  el
)
