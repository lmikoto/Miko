import * as React from 'react';
import App from './containers/App';
import './index.css';
import 'antd/dist/antd.css';
import registerServiceWorker from './registerServiceWorker';

import dva from 'dva';
const app = dva();

app.model({
  namespace: 'count',
  state: 0,
  reducers: {
    add  (count) { return count + 1; },
    minus(count) { return count - 1; },
  },
});

app.router(() => <App />);

app.start('#root');

registerServiceWorker();
