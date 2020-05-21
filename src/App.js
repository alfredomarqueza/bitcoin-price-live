// Bitcoin Price Live
// 2020
// By @alfredomarqueza

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import Header from './components/Header';
import ChartParameters from './components/ChartParameters';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import 'moment/locale/es';
import 'moment/locale/ja';
import 'moment/locale/ru';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
import ru from 'date-fns/locale/ru';
import enUS from 'date-fns/locale/en-US';
import ja from 'date-fns/locale/ja';
registerLocale('es', es);
registerLocale('en-US', enUS);
registerLocale('ja', ja);
registerLocale('ru', ru);

class App extends Component {
  constructor(props) {
    super(props)
    
    moment.locale(store.getState().culture);

  }

  render() {
    return (
      <Provider store={store}>
        <div className="app">
          <Header />
          <ChartParameters />
        </div>
      </Provider>
    )
  }
}

export default App;
