import React, { Component } from 'react';
import store from './redux/store';
import { Line, Chart } from 'react-chartjs-2';
import moment from 'moment';


class BtcChart extends Component {
    constructor(props) {
        super(props)

        // chart.js defaults
        Chart.defaults.global.defaultFontColor = '#000';
        Chart.defaults.global.defaultFontSize = 14;

        this.state = {
            historicalData: null,
            historicalDataError: null,
            culture: store.getState().culture
        };

        store.subscribe(() => {

            this.setState({
                culture: store.getState().culture
            });
        });

    }

    componentDidMount() {
        this.getHistoricalData();
    }

    componentDidUpdate(prevProps, prevState) {                                  // Check when props change to fetch historical data        

        if (prevProps.currency !== this.props.currency ||
            prevProps.startDate.getTime() !== this.props.startDate.getTime() ||
            prevProps.endDate.getTime() !== this.props.endDate.getTime()) {

            this.getHistoricalData();
        }
    }

    getHistoricalData() {
        let startDate = moment(this.props.startDate).format("YYYY-MM-DD");
        let endDate = moment(this.props.endDate).format("YYYY-MM-DD");

        fetch(`https://api.coindesk.com/v1/bpi/historical/close.json?currency=${this.props.currency}&start=${startDate}&end=${endDate}`)
            .then(response => response.json())
            .then(historicalData => this.setState({ historicalData, historicalDataError: null }))
            .catch((error) => {
                this.setState({ historicalDataError: error.message })
            })
    }

    chartOptions() {

        return {
            scales: {
                yAxes: [{
                    ticks: {

                        callback: ((value, index, values) => {
                            return new Intl.NumberFormat(this.state.culture, { style: 'currency', currency: this.props.currency }).format(value);
                        })//.bind(this)
                    }
                }]
            },

            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var value = data.datasets[0].data[tooltipItem.index];
                        return new Intl.NumberFormat(this.state.culture, { style: 'currency', currency: this.props.currency }).format(value);
                    }.bind(this)
                }
            }
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

    render() {
        return (
            <>
                {this.state.historicalDataError ?
                    (<span>{this.state.historicalDataError}</span>) :
                    (this.state.historicalData ? (
                        <Line options={this.chartOptions()} data={this.formatChartData()} height={250} />
                    ) : (<span>Loading...</span>)
                    )

                }
            </>
        )
    }
}


export default BtcChart;