import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState } from "react";
import { useReport } from "../dashboardReports/DashboardReportsProvider"
import ReportsDropdown from '../reportsDropdown/ReportsDropdown';
import { DatePicker, Empty, Skeleton, Space } from 'antd';
import { convertDataForPolarAreaYearMonths, getCardDepositForMonthsInYear } from '../../assests/utils/reportDataManipulation';

export default function CardDepositCharts() {
    const {transactions, reportAccount, isLoaded} = useReport();
    const [cardDeposits, setCardDeposits] = useState([]);
    const [reportCardDeposits, setReportCardDeposits] = useState([]);
    const [chartData, setChartData] = useState({
        series: [], labels: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [monthYear, setMonthYear] = useState({
        year: new Date().getFullYear(),
    });

    useEffect(() => {
        if (isLoaded && isLoading) {
            const currentCardDeposits = transactions.filter(transaction => transaction.type === "Deposit");
            
            const accountReportTransactions = getCardDepositForMonthsInYear({
                arr: currentCardDeposits,
                reportAccountId: reportAccount.reportAccountId,
                year: monthYear.year,
            });

            const dataForChart = convertDataForPolarAreaYearMonths(accountReportTransactions);
            setChartData(dataForChart);
            setCardDeposits(currentCardDeposits);
            setReportCardDeposits(accountReportTransactions);
            setTimeout(() => {
                setIsLoading(false);

            }, 300);
        } else {
            const accountReportTransactions = getCardDepositForMonthsInYear({
                arr: cardDeposits,
                reportAccountId: reportAccount.reportAccountId,
                year: monthYear.year,
            });
            const dataForChart = convertDataForPolarAreaYearMonths(accountReportTransactions);

            setChartData(dataForChart);
            setReportCardDeposits(accountReportTransactions);
        }
    }, [reportAccount, isLoaded, monthYear]);

    const onChangeDate = (value) => {
        if (value) {
            setMonthYear({
                month: value["$M"],
                year: value["$y"],
            });


        } else {
            setMonthYear({
                year: new Date().getFullYear(),
            })
        }
    }

    const options = {
        "chart": {
            "animations": {
                "enabled": false
            },
            "background": "",
            "dropShadow": {
                "enabled": true
            },
            "foreColor": "#000000",
            "fontFamily": "Roboto",
            "height": 413,
            "id": "6cSlM",
            "toolbar": {
                "show": false
            },
            "type": "polarArea",
            "width": 610
        },
        "plotOptions": {
            "bar": {
                "borderRadius": 10
            },
            "radialBar": {
                "hollow": {
                    "background": "#fff"
                },
            },
        },
        "colors": [
            "#00E0C0",
            "#523B7E",
            "#0467B1",
            "#0093CF",
            "#00BBD2"
        ],
        "dataLabels": {
            "enabled": false,
            "style": {
                "fontWeight": 700,
                fontSize: "18px",
                textAlign: "center"
            }
        },
        "grid": {
            "padding": {
                "top": 20,
                "right": 25,
                "left": 20
            }
        },
        "labels": chartData.labels,
        "legend": {
            "fontSize": 24,
            "fontWeight": 500,
            "offsetY": 0,
            "itemMargin": {
                "vertical": 0
            }
        },
        "series": chartData.series,
        "tooltip": {
            "fillSeriesColor": true,
            "theme": "dark",
            enabled: true,
            "fillSeriesColor": true,
            "style": {
                "fontWeight": 700,
                fontSize: "22px"
            },
            y: {formatter: function (values, {}) {
                const amount = values.toFixed(2) + " BGN";
                return amount;
            }},
        },
        "xaxis": {
            "labels": {
                "trim": true,
                "style": {}
            },
            "title": {
                "style": {
                    "fontWeight": 700
                }
            }
        },
        "yaxis": {
            "tickAmount": 6,
            "labels": {
                "style": {}
            },
            "title": {
                "rotate": 90,
                "style": {
                    "fontWeight": 700
                }
            }
        },
        "theme": {
            "palette": "palette5"
        },
    }

    return (<>
         <div className="filter-wrapper"> 
            <ReportsDropdown/>
            <Space direction="vertical" size={12}>
                <DatePicker onChange={(value) => onChangeDate(value)} picker="year" />
            </Space>
        </div>
        { !isLoaded ? <Skeleton active/>
        :    
        <div className='ft-pie-chart-expense-wrapper'>
            <h3 className='chart-title'>Card Deposits Polar Area - {monthYear.year}</h3>
            {   isLoading ? 
                <Skeleton active />
                :
                Object.keys(reportCardDeposits).length 
                ? 

                <ReactApexChart
                options={options}
                series={options.series}
                type="polarArea"
                height={"100%"}
                width={"100%"}
                />
                :
                <div className='empty-wrapper'>
                    <Empty description={false}>
                        <h3>No Card Deposits Data</h3>
                    </Empty>                
                </div>
            }
        </div>
        }
    
    </>)
}