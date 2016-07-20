import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';

import skygear from 'skygear';
import config from 'config';
import App from './components/Main';

skygear.config({
  apiKey: config.skygear.apiKey,
  endPoint: config.skygear.endPoint
}).then(() => {
  // Render the main component into the dom
  ReactDOM.render(<App />, document.getElementById('app'));
});

