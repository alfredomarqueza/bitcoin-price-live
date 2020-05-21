// Bitcoin Price Predictor
// 2020
// By @alfredomarqueza

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import Header from './components/Header';
import BtcChart from './BtcChart';
import './App.css';
import { Container, Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import 'moment/locale/es';
import 'moment/locale/ja';
import 'moment/locale/ru';
import currencies from './supported-currencies.json';
import DatePicker from "react-datepicker";
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

    this.currectPriceRef = React.createRef();
    this.lastUpdateRef = React.createRef();
    this.currentPriceErrorRef = React.createRef();
    this.currectPriceContainerRef = React.createRef();

    let endDate = new Date();
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    this.state = {
      currency: "USD",
      startDate: startDate,
      endDate: endDate,
      culture: 'en-US'
    };

    moment.locale(this.state.culture);

    store.subscribe(() => {
      // When state will be updated(in our case, when culture will be fetched), 
      // we will update local component state and force component to rerender 
      // with new data.

      this.setState({
        culture: store.getState().culture
      });

      this.getCurrentPrice();
    });

  }

  //#region Events functions

  componentDidMount() {

    this.currectPriceContainerRef.current.className = "initialVisible";

    this.getCurrentPrice();

    this.interval = setInterval(this.updateCurrentPrice.bind(this), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onChangeEndDate = (date) => {
    this.setState({ endDate: date });
  }

  onChangeStartDate = (date) => {
    this.setState({ startDate: date });
  }

  onSelectCurrency = (e) => {
    this.setCurrency(e.target.value)
  }

  //#endregion

  updateCurrentPrice() {

    this.currectPriceContainerRef.current.className = "fadeOut";

    setTimeout(() => {

      this.getCurrentPrice(() => { this.currectPriceContainerRef.current.className = "fadeIn"; });

    }, 1000);

  }

  getCurrentPrice = (callback = null) => {

    fetch(`https://api.coindesk.com/v1/bpi/currentprice/${this.state.currency}.json`)
      .then(response => response.json())
      .then(currentPrice => {
        if (currentPrice.bpi[this.state.currency] != null) {

          this.currentPriceErrorRef.current.style.display = "none";
          this.currectPriceContainerRef.current.style.display = "inline";
          const rate_float = currentPrice.bpi[this.state.currency].rate_float;

          this.currectPriceRef.current.textContent = Intl.NumberFormat(this.state.culture,
            { style: 'currency', currency: this.state.currency })
            .format(rate_float);
          this.lastUpdateRef.current.textContent = moment(new Date()).format("HH:mm:ss A");
        } else {
          this.currectPriceContainerRef.current.style.display = "none";
          this.currentPriceErrorRef.current.style.display = "inline";
          this.currentPriceErrorRef.current.textContent = "Currency not found";
        }
      })
      .catch((error) => {
        this.currectPriceContainerRef.current.style.display = "none";
        this.currentPriceErrorRef.current.style.display = "inline";
        this.currentPriceErrorRef.current.textContent = error.message;
      })
      .finally(() => {
        if (callback != null)
          callback();
      })

  }

  setCurrency(currency) {
    this.setState({ currency }, () => { this.getCurrentPrice(); });
  }

  render() {
    return (
      <Provider store={store}>
        <div className="app">
          <Header />
          <Container fluid style={{ lineHeight: '32px' }}>
            <Row className="justify-content-end">
              <Col xs="content" >
                <span style={{ fontSize: 18, fontFamily: 'Arial Black' }}> Currency: </span>
              </Col>
              <Col xs={6} >
                <select className="input-element" value={this.state.currency} onChange={this.onSelectCurrency}>
                  {currencies.map((obj, index) =>
                    <option key={`${index}-${obj.country}`} value={obj.currency}> {obj.currency} - {obj.country}</option>
                  )}
                </select>
                {
                  /* this.state.currency !== 'USD' && (<div>
                    <a href="#" className="link" onClick={() => this.setCurrency('USD')} style={{color: "black", fontSize: 16, fontFamily: 'Arial Black'}}> [CLICK HERE TO RESET] </a>
                  </div>) */
                }
              </Col>
            </Row>
            <Row className="justify-content-end">
              <Col xs="content">
                <span style={{ fontSize: 18, fontFamily: 'Arial Black' }}> Start date: </span>
              </Col>
              <Col xs={6}>
                <DatePicker className="input-element"
                  selected={this.state.startDate}
                  onChange={this.onChangeStartDate}
                  dateFormat="MMMM d, yyyy"
                  locale={this.state.culture}
                  maxDate={new Date()}
                />
              </Col>
            </Row>
            <Row className="justify-content-end">
              <Col xs="content">
                <span style={{ fontSize: 18, fontFamily: 'Arial Black' }}> End date: </span>
              </Col>
              <Col xs={6}>
                <DatePicker className="input-element"
                  selected={this.state.endDate}
                  onChange={this.onChangeEndDate}
                  dateFormat="MMMM d, yyyy"
                  locale={this.state.culture}
                  maxDate={new Date()}
                />
              </Col>
            </Row>
            <Row className="justify-content-end">
              <Col xs="content">
                <span style={{ fontSize: 18, fontFamily: 'Arial Black' }}>
                  Last price:</span>
              </Col>
              <Col xs={6}>
                <span style={{ color: 'red', display: 'none' }} ref={this.currentPriceErrorRef}></span>
                <span ref={this.currectPriceContainerRef}>
                  <span className="dataLabel" ref={this.currectPriceRef}></span>
                    &nbsp;&nbsp;&nbsp;<span style={{ fontSize: 12, fontFamily: 'Arial' }} ref={this.lastUpdateRef}></span>
                </span>

              </Col>
            </Row>
          </Container>
          <br />

          <BtcChart currency={this.state.currency} culture={this.state.culture}
            startDate={this.state.startDate} endDate={this.state.endDate} />

        </div>
      </Provider>
    )
  }
}

export default App;
