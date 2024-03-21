import React from 'react';
import ReactDOM from 'react-dom';
import Framework7React from 'framework7-react';
import Framework7 from '@js/framework7-custom';
import '@styles/framework7-custom.less';
import '@styles/icons.css';
import '@styles/app.less';
import App from '@components/App';
import i18n from './assets/lang/i18n';
import 'lodash';
import '@js/helpers';

const globalAny: any = global;
globalAny.i18next = i18n;

Framework7.use(Framework7React);
ReactDOM.render(React.createElement(App), document.getElementById('app'));
