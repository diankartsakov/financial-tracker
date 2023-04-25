
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import "./pieChartExpense.scss"
import { useEffect, useState } from "react";
import { useReport } from "../dashboardReports/DashboardReportsProvider"
import ReportsDropdown from '../reportsDropdown/ReportsDropdown';
import { DatePicker, Empty, Skeleton, Space } from 'antd';
import { getExpensesTransactionForMonthYear, getMonthName } from '../../assests/utils/reportDataManipulation';

export default function PieChartExpense() {
    const {transactions, reportAccount, isLoaded} = useReport();
    const [expenseTransactions, setExpenseTransactions] = useState([]);
    const [reportTransactions, setReportTransactions] = useState([]);
    const [monthYear, setMonthYear] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            const currentReportExpenseTransactions = transactions.filter(transaction => transaction.type === "Expense");
            const accountReportTransactions =  getExpensesTransactionForMonthYear({
                arr: currentReportExpenseTransactions,
                reportAccountId: reportAccount.reportAccountId,
                month: monthYear.month,
                year: monthYear.year,
            });

            setExpenseTransactions(currentReportExpenseTransactions);
            setReportTransactions(accountReportTransactions);
            setIsLoading(false);
        } else {
            const accountReportTransactions =  getExpensesTransactionForMonthYear({
                arr: expenseTransactions,
                reportAccountId: reportAccount.reportAccountId,
                month: monthYear.month,
                year: monthYear.year,
            });

            setReportTransactions(accountReportTransactions);
        }
        
    }, [reportAccount, isLoaded, monthYear]);

    const onChangeDate = (value) => {
        if (value) {
            setMonthYear({
                month: value["$M"],
                year: value["$y"],
            })
        } else {
            setMonthYear({
                month: new Date().getMonth(),
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
            "foreColor": "#333",
            "fontFamily": "Roboto",
            "height": 469,
            "id": "jf3WI",
            "toolbar": {
                "show": false
            },
            "type": "pie",
            "width": 606
        },
        "series": Object.keys(reportTransactions).map(key => {
            return reportTransactions[key].reduce((acc, { amount }) => {
                return acc + amount;
            }, 0);
        }),
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
        "dataLabels": {
            "style": {
                "fontWeight": 700,
                fontSize: "22px",
            }
        },
        "fill": {
            "opacity": 1
        },
        "grid": {
            "padding": {
                "right": 25,
                "left": 15
            }
        },
        "tooltip": {
            enabled: true,
            "fillSeriesColor": true,
            "theme": "dark",
             "style": {
                "fontWeight": 700,
                fontSize: "22px"
            },
            y: {formatter: function (values, { seriesIndex, globals: {seriesNames} }) {
                const amount = reportTransactions[seriesNames[seriesIndex]].reduce((acc, {amount}) => {   
                    return acc + amount;
                    }, 0);
                return `${amount.toFixed(2)} BGN`;
              }},
        },
        "labels": Object.keys(reportTransactions),
        "legend": {
            "position": "right",
            "fontSize": 24,
            "fontWeight": 500,
            "offsetY": 0,
            "itemMargin": {
                "vertical": 0
            }
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
            "labels": {
                "style": {}
            },
            "title": {
                "style": {
                    "fontWeight": 700
                }
            }
        },
        "theme": {
            "palette": "palette4"
        },
    }

    
    return (<>
        <div className="filter-wrapper"> 
            <ReportsDropdown/>
            <Space direction="vertical" size={12}>
                <DatePicker onChange={(value) => onChangeDate(value)} picker="month" />
            </Space>

        </div>
        { !isLoaded ? <>Loading...</>
        :    
        <div className='ft-pie-chart-expense-wrapper'>
            <h3 className='chart-title'>Expense Pie Chart - {getMonthName(monthYear.month)} {monthYear.year}</h3>
            {   isLoading ? <Skeleton active/>
                :
                Object.keys(reportTransactions).length 
                ? 
                <ReactApexChart
                options={options}
                series={options.series}
                type="pie"
                height={"100%"}
                width={"100%"}
                />
                :
                <div className='empty-wrapper'>
                    <Empty description={false}>
                        <h3>No Expense Data</h3>
                    </Empty>
                </div>

            }
        </div>
        }
    </>)
}