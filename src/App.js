import * as React from "react";
import ReactApexChart from "react-apexcharts";
import Searchbar from "./Searchbar";
import { MACD } from "technicalindicators";

// var macInput = {
//   values: [
//     127.75, 129.02, 132.75, 145.4, 148.98, 137.52, 147.38, 139.05, 137.23,
//     149.3, 162.45, 178.95, 200.35, 221.9, 243.23, 243.52, 286.42, 280.27,
//   ],
//   fastPeriod: 5,
//   slowPeriod: 8,
//   signalPeriod: 3,
//   SimpleMAOscillator: false,
//   SimpleMASignal: false,
// };

// console.log(MACD.calculate(macdInput));

let seriesData = [{ x: "12 jan", y: [0, 0, 0, 0] }];
let seriesBarData = [{ x: "12 jan", y: 100 }];

class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: seriesData,
        },
      ],
      options: {
        chart: {
          type: "candlestick",
          height: 290,
          id: "candles",
          toolbar: {
            autoSelected: "pan",
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: "#3C90EB",
              downward: "#DF7D46",
            },
          },
        },
        xaxis: {
          type: "datetime",
        },
      },

      seriesBar: [
        {
          name: "volume",
          data: seriesBarData,
        },
      ],
      optionsBar: {
        chart: {
          height: 160,
          type: "bar",
          brush: {
            enabled: true,
            target: "candles",
          },
          selection: {
            enabled: true,
            xaxis: {
              min: new Date("20 Jan 2017").getTime(),
              max: new Date("10 Dec 2017").getTime(),
            },
            fill: {
              color: "#ccc",
              opacity: 0.4,
            },
            stroke: {
              color: "#0D47A1",
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          bar: {
            columnWidth: "80%",
            colors: {
              ranges: [
                {
                  from: -1000,
                  to: 0,
                  color: "#F15B46",
                },
                {
                  from: 1,
                  to: 10000,
                  color: "#FEB019",
                },
              ],
            },
          },
        },
        stroke: {
          width: 0,
        },
        xaxis: {
          type: "datetime",
          axisBorder: {
            offsetX: 13,
          },
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
      },
    };
  }

  graphUI = async (sym) => {
    try {
      let data = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${sym}&interval=5min&apikey=${process.env.REACT_APP_API_KEY}`,
        {
          json: true,
          headers: { "User-Agent": "request" },
        }
      );
      data = await data.json();
      if (data) {
        const key = Object.keys(data["Time Series (Daily)"]);
        const values = Object.values(data["Time Series (Daily)"]);

        // data for graph related to stock
        seriesData = key.map((curr, i) => {
          let demo = [];
          let dem = values[i];
          for (let n in dem) {
            demo.push(dem[n]);
          }
          demo.pop();
          return {
            x: curr.toString(),
            y: demo,
          };
        });
        // data for histogram related to stock

        let macdInput = {
          values: [
            127.75, 129.02, 132.75, 145.4, 148.98, 137.52, 147.38, 139.05,
            137.23, 149.3, 162.45, 178.95, 200.35, 221.9, 243.23, 243.52,
            286.42, 280.27,
          ],
          fastPeriod: 5,
          slowPeriod: 8,
          signalPeriod: 3,
          SimpleMAOscillator: false,
          SimpleMASignal: false,
        };
        macdInput.values = values.map((curr) => {
          return curr["4. close"];
        });

        seriesBarData = key.map((curr, i) => {
          return {
            x: curr.toString(),
            y: 1,
          };
        });
        this.setState({
          series: [
            {
              data: seriesData,
            },
          ],
        });
      }
    } catch (err) {
      console.log("hello", err);
    }
  };

  render() {
    return (
      <div className="chart-box">
        <div id="chart-candlestick">
          <Searchbar graph={this.graphUI} />
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="candlestick"
            height={290}
          />
        </div>
        <div id="chart-bar">
          <ReactApexChart
            options={this.state.optionsBar}
            series={this.state.seriesBar}
            type="bar"
            height={160}
          />
        </div>
      </div>
    );
  }
}

export default ApexChart;
