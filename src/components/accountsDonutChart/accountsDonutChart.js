import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDash } from '../../pages/dashboardPage/DashboardProvider';

const LogarithmicBarChart = () => {
    const {accountsArr} = useDash();
    console.log(accountsArr);
    const accountData = accountsArr.map(acc => {
        return {name: acc.name, amount: acc.amount}
    });

    var options = {
        series: accountData.map(account => account.amount),
        chart: {
          width: 380,
          type: 'donut',
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 270,
          },
        },
        dataLabels: {
          enabled: true,
          offset: -5,
          dropShadow: {
            enabled: true,
            top: 2,
            left: 2,
            blur: 2,
            opacity: 0.15
          }
        },
        fill: {
          type: 'gradient',
        },
        tooltip: {
          enabled: true,
          y: {
            formatter: function (value, { seriesIndex }) {
              const account = accountData[seriesIndex];
              const amount = value.toFixed(2) + " BGN";
              return `${account.name} - ${amount}`;
            }
          }
        },
        legend: {
          formatter: function (val, opts) {
            const accountIndex = opts.seriesIndex;
            const account = accountData[accountIndex];
            const amount = account.amount.toFixed(2) + " BGN";
            return `${account.name} - ${amount}`;
          },
        },
        title: {
          text: 'Accounts',
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      };

    return (
        <ReactApexChart
        options={options}
        series={options.series}
        type="donut"
        height={"650px"}
        width={'650px'}
        />
    );
};

export default LogarithmicBarChart;
