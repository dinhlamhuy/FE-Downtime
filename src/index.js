import React from 'react';
import "./utils/font";
import "./scss/style.scss";
import App from './App';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from "react-router-dom";
import store from "./redux/store";

import global_en from "./transtations/en/global.json";
import global_vn from "./transtations/vn/global.json";
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';

const languages = localStorage.getItem('languages');

i18next.init({
  interpolation: { escapeValue: false },
  lng: languages === null ? "EN" : languages,
  resources: {
    EN: {
      global: global_en,
    },
    VN: {
      global: global_vn,
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18next}>
      <Router>
        <App />
      </Router>
    </I18nextProvider>
  </Provider>
);

