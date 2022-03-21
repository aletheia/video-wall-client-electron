import * as React from 'react';
import * as ReactDOM from 'react-dom';

// components
import './app'; import { App } from './components/App';

function render() {
  ReactDOM.render(<App>Hello from React!</App>, document.getElementById('app'));
}

render();
// Add this to the end of the existing file

