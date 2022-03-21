import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {  ChakraProvider } from '@chakra-ui/react'




// components
import './app'; import { App } from './components/App';

import {appTheme} from './themes';

function render() {
  ReactDOM.render(
    <React.StrictMode>
      <ChakraProvider theme={appTheme}>
        <App/>
      </ChakraProvider>
    </React.StrictMode>
    , document.getElementById('app'));
}

render();
// Add this to the end of the existing file

