import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDash } from '../../pages/dashboardPage/DashboardProvider';

const LogarithmicBarChart = () => {
    const {accountsArr} = useDash();
    // console.log(accountsArr);
    const accountData = accountsArr.map(acc => {
        return {name: acc.name, amount: acc.amount}
    });

    var options = {
        series: accountData.map(account => account.amount),
        chart: {
          width: '50%',
          height: "100%",
          type: 'donut',
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 270,
            width: "50%",
            height: "100%",
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
            },
            title: {formater: (seriesName) => "",},
          }
        },
        legend: {
          width: "50%",
          position: 'right',
          fontSize: '14px',
          fontWeight: 700,
          offsetY: 25,
          offsetX: 0,
          formatter: function (val, opts) {
            const accountIndex = opts.seriesIndex;
            const account = accountData[accountIndex];
            const amount = account.amount.toFixed(2) + " BGN";
            return `${account.name} - ${amount}`;
          },
        },
        title: {
          text: 'Accounts',
          align: "center",
          style: {
            fontSize:  '24px',
            fontWeight:  'bold',
          },
        },
        responsive: [
          {
            breakpoint: 1600,
            chart: {
                height: "100%",
            },
            options: {
              legend: {          
                offsetY: 15,
                offsetX: 0,
                position: "bottom",
                fontSize: "12px",
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
        height={"100%"}
        width={"100%"}
        />
    );
};

export default LogarithmicBarChart;
