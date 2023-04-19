import React from 'react';
import ReactApexChart from 'react-apexcharts';
import "./accountsDonutChart.scss";

import { useDash } from '../../pages/dashboardPage/DashboardProvider';


export default function AccountsDonutChart() {
      const {accountsArr} = useDash();

    const accountData = accountsArr.map(acc => {
        return {name: acc.name, amount: acc.amount}
    });

    const options = {
        "chart": {
            "animations": {
                "enabled": false
            },
            "background": "#F5F5F5",
            "dropShadow": {
                "top": 0
            },
            "foreColor": "black",
            "fontFamily": "Roboto",
            "height": 501,
            "id": "OcvDT",
            "toolbar": {
                "show": true,
            },
            "type": "donut",
            "width": 604
        },
        "series": accountData.map(account => account.amount),
        "plotOptions": {
            "bar": {
                "borderRadius": 10
            },
            "radialBar": {
                "hollow": {
                    "background": "#fff"
                },
            },
            "pie": {
                "donut": {
                    "size": "70%",
                }
            }
        },
        "dataLabels": {
            enabled: true,
            "style": {
                "fontWeight": 700
            },
            "background": {
                "foreColor": "#0B0B0B",
                "opacity": 1
            },
            dropShadow: {
                enabled: true,
                top: 2,
                left: 2,
                blur: 2,
                opacity: 0.15
              }
        },
        "tooltip": {
            enabled: true,
            "fillSeriesColor": true,
            y: {formatter: function (values, { seriesIndex }) {
                // debugger
                const account = accountData[seriesIndex];
                const amount = account.amount.toFixed(2) + " BGN";
                // console.log(amount);
                return `${amount}`;
              }},
        },
        "fill": {
            "opacity": 1
        },
        "grid": {
            "borderColor": "#6e7eaa",
            "padding": {
                "right": 0,
                "left": 0
            }
        },
        title: {
            text: 'Accounts',
            align: "center",
            style: {
              fontSize:  '24px',
              fontWeight:  'bold',
            },
        },
        "labels": accountData.map(account => account.name),
        
        "legend": {
            "fontSize": 16,
            "fontWeight": 500,
            "offsetX": 0,
            "offsetY": 0,
            "position": "bottom",
            "itemMargin": {
                "vertical": 0
            },
            formatter: function (val, opts) {
                const accountIndex = opts.seriesIndex;
                const account = accountData[accountIndex];
                const amount = account.amount.toFixed(2) + " BGN";
                return `${account.name} - ${amount}`;
        },
        "theme": {
            "palette": "palette4"
        },
    }
}


    return <ReactApexChart
            options={options}
            series={options.series}
            type="donut"
            height={"100%"}
            width={"100%"}
            />
}
