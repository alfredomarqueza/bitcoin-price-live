// Bitcoin Price Live
// 2019
// By @alfredomarqueza
// Base version by @MarkFChavez

import React, { Component } from 'react';
import Header from './components/Header';
import './App.css';
import { Container, Row, Col } from 'react-grid-system';
import { Line, Chart } from 'react-chartjs-2';
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

    // chart.js defaults
    Chart.defaults.global.defaultFontColor = '#000';
    Chart.defaults.global.defaultFontSize = 14;

    let endDate = new Date();
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    this.state = {
      historicalData: null,
      currentPrice: null,
      currency: "USD",
      culture: "en-US",
      startDate: startDate,
      endDate: endDate,
      currentPriceError: null,
      currentPriceLabelStyle: "initialVisible",
      lastUpdateDate: null
    };

    moment.locale(this.state.culture);

    this.onCurrencySelect = this.onCurrencySelect.bind(this);
    this.onCultureSelect = this.onCultureSelect.bind(this);

  }

  componentDidMount() {
    this.getHistoricalData();
    this.getCurrentPrice();

    this.interval = setInterval(this.updateCurrentPrice.bind(this), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateCurrentPrice() {

    this.setState({ currentPriceLabelStyle: "fadeOut" });

    this.getCurrentPrice();

    setTimeout(() => {
      this.setState({ currentPriceLabelStyle: "fadeIn" });
    }, 300);

  }

  endDate_handleChange(date) {
    this.setState({ endDate: date }, () => { this.getHistoricalData(); });
  }

  startDate_handleChange(date) {
    this.setState({ startDate: date }, () => { this.getHistoricalData(); });
  }

  getHistoricalData() {
    let startDate = moment(this.state.startDate).format("YYYY-MM-DD");
    let endDate = moment(this.state.endDate).format("YYYY-MM-DD");

    fetch(`https://api.coindesk.com/v1/bpi/historical/close.json?currency=${this.state.currency}&start=${startDate}&end=${endDate}`)
      .then(response => response.json())
      .then(historicalData => this.setState({ historicalData, historicalDataError: null }))
      .catch((error) => {
        this.setState({ historicalDataError: error.message })
      })
  }

  getCurrentPrice() {
    fetch(`https://api.coindesk.com/v1/bpi/currentprice/${this.state.currency}.json`)
      .then(response => response.json())
      .then(currentPrice => this.setState({ currentPrice, currentPriceError: null, lastUpdateDate: new Date() }))
      .catch((error) => {
        this.setState({ currentPriceError: error.message })
      })
  }

  chartOptions() {

    return {
      scales: {
        yAxes: [{
          ticks: {

            callback: ((value, index, values) => {
              return new Intl.NumberFormat(this.state.culture, { style: 'currency', currency: this.state.currency }).format(value);
            })//.bind(this)
          }
        }]
      },

      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var value = data.datasets[0].data[tooltipItem.index];
            return new Intl.NumberFormat(this.state.culture, { style: 'currency', currency: this.state.currency }).format(value);
          }.bind(this)
        }
      }
    }
  }

  formatCurrectPrice() {
    if (this.state.currentPrice != null && this.state.currentPrice.bpi[this.state.currency] != null) {

      const rate_float = this.state.currentPrice.bpi[this.state.currency].rate_float;

      return Intl.NumberFormat(this.state.culture,
        { style: 'currency', currency: this.state.currency })
        .format(rate_float);
    }

  }

  formatLastUpdate() {    
    if (this.state.lastUpdateDate != null) {
      return moment(this.state.lastUpdateDate).format("HH:mm:ss A");
    }
  }

  formatChartData() {

    const { bpi } = this.state.historicalData;
    
    return {
      labels: Object.keys(bpi).map(date => moment(date).format("ll")),
      datasets: [
        {

          label: "Bitcoin price",
          fill: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(100,71,192,0.4)',
          borderColor: 'rgba(100,71,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(100,71,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(100,71,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: Object.values(bpi)
        }
      ]
    }
  }

  setCurrency(currency) {
    this.setState({ currency }, () => { this.getHistoricalData(); this.getCurrentPrice(); });
  }

  onCurrencySelect(e) {
    this.setCurrency(e.target.value)
  }

  setCulture(culture) {    
    this.setState({ culture });
    moment.locale(culture);
  }

  onCultureSelect(e) {
    this.setCulture(e.target.value)
  }

  render() {
    return (
      <div className="app">
        <Header title="BITCOIN PRICE LIVE" />
        <Container fluid style={{ lineHeight: '32px' }}>
          <Row justify="end">
            <Col xs="content" >
              <span style={{ fontSize: 18, fontFamily: 'Arial Black' }}> Currency: </span>
            </Col>
            <Col xs={6} >
              <select className="input-element" value={this.state.currency} onChange={this.onCurrencySelect}>
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
          <Row justify="end">
            <Col xs="content">
              <span style={{ fontSize: 18, fontFamily: 'Arial Black' }}> Culture: </span>
            </Col>
            <Col xs={6}>
              <select className="input-element" value={this.state.culture} onChange={this.onCultureSelect}>
                <option value="en-US"> United States </option>
                <option value="ja"> Japan </option>
                <option value="ru"> Russia </option>
                <option value="es"> Spain </option>
              </select>
            </Col>
          </Row>
          <Row justify="end">
            <Col xs="content">
              <span style={{ fontSize: 18, fontFamily: 'Arial Black' }}> Start date: </span>
            </Col>
            <Col xs={6}>
              <DatePicker className="input-element"
                selected={this.state.startDate}
                onChange={this.startDate_handleChange.bind(this)}
                dateFormat="MMMM d, yyyy"
                locale={this.state.culture}
                maxDate={new Date()}
              />
            </Col>
          </Row>
          <Row justify="end">
            <Col xs="content">
              <span style={{ fontSize: 18, fontFamily: 'Arial Black' }}> End date: </span>
            </Col>
            <Col xs={6}>
              <DatePicker className="input-element"
                selected={this.state.endDate}
                onChange={this.endDate_handleChange.bind(this)}
                dateFormat="MMMM d, yyyy"
                locale={this.state.culture}
                maxDate={new Date()}
              />
            </Col>
          </Row>
          <Row justify="end">
            <Col xs="content">
              <span style={{ fontSize: 18, fontFamily: 'Arial Black' }}>
                Last price:</span>
            </Col>
            <Col xs={6}>
              {this.state.currentPriceError ?
                (<span>{this.state.currentPriceError}</span>) :
                (this.state.currentPrice ? (
                  <span>
                    <span className={`${this.state.currentPriceLabelStyle} dataLabel`}>{this.formatCurrectPrice()}</span>
                    &nbsp;&nbsp;&nbsp;<span style={{ fontSize: 12, fontFamily: 'Arial' }} className={this.state.currentPriceLabelStyle}>{this.formatLastUpdate()}</span>
                  </span>
                ) : (<span>Loading...</span>))
              }
            </Col>
          </Row>
        </Container>
        <br />
        {this.state.historicalDataError ?
          (<span>{this.state.historicalDataError}</span>) :
          (this.state.historicalData ? (
            <Line options={this.chartOptions()} data={this.formatChartData()} height={250} />
          ) : (<span>Loading...</span>)
          )
        }

      </div>
    )
  }
}

export default App;
