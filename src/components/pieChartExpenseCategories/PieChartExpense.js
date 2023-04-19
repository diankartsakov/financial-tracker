
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import "./pieChartExpense.scss"
import { useEffect, useState } from "react";
import { useReport } from "../dashboardReports/DashboardReportsProvider"
import ReportsDropdown from '../reportsDropdown/ReportsDropdown';
import { DatePicker, Space } from 'antd';
import { getExpensesTransactionForMonthYear } from '../../assests/utils/reportDataManipulation';
import { logRoles } from '@testing-library/react';
const { RangePicker } = DatePicker;

export default function PieChartExpense() {
    const {transactions, reportAccount, isLoaded} = useReport();
    const [expenseTransactions, setExpenseTransactions] = useState([]);
    // const [series, setSeries] = useState([]);
    // const [monthYearSeries, setMonthYearSeries ] = useState([]);
    const [reportTransactions, setReportTransactions] = useState([]);
    const [monthYear, setMonthYear] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });

    // console.log(monthYear);

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
    // console.log(isLoaded);
    // console.log(reportTransactions);

    useEffect(() => {
        if (isLoaded) {
            const currentReportExpenseTransactions = transactions.filter(transaction => transaction.type === "Expense");
            const accountReportTransactions = currentReportExpenseTransactions
                .filter(transaction => transaction.accountId === reportAccount.reportAccountId)
                .reduce((acc, expense) => {
                    const { category, date } = expense;

                    const dateExpense = {
                        month: date.getMonth(),
                        year: date.getFullYear(),
                    }

                    const isInDateRange = dateExpense.month === monthYear.month && dateExpense.year === monthYear.year;
                   
                    if (isInDateRange) {
                        if (!acc[category]) {
                        acc[category] = [];
                        }
                        acc[category].push(expense);
                    }
                    
                    return acc;
                  }, {});

            const accountReportTransactions2 =  getExpensesTransactionForMonthYear({
                arr: currentReportExpenseTransactions,
                reportAccountId: reportAccount.reportAccountId,
                month: monthYear.month,
                year: monthYear.year,
            });

            console.log("old ->", accountReportTransactions);
            console.log("new ->", accountReportTransactions2);
            
            // const seriesData = Object.keys(accountReportTransactions).map(key => {
            //     return accountReportTransactions[key].reduce((acc, { amount }) => {
            //         return acc + amount;
            //     }, 0);
            // });    
            
            // console.log("on loading");
            // setSeries(seriesData);
            setExpenseTransactions(currentReportExpenseTransactions);
            setReportTransactions(accountReportTransactions);
        } else {
            // console.log("second use effect")
            const accountReportTransactions = expenseTransactions.filter(transaction => transaction.accountId === reportAccount.reportAccountId)
            .reduce((acc, expense) => {
                const { category,  date  } = expense;

                const dateExpense = {
                    month: date.getMonth(),
                    year: date.getFullYear(),
                }

                const isInDateRange = dateExpense.month === monthYear.month && dateExpense.year === monthYear.year;
               
                if (isInDateRange) {
                    if (!acc[category]) {
                    acc[category] = [];
                    }
                    acc[category].push(expense);
                }

                return acc;
              }, {});

            //   const seriesData =  Object.keys(accountReportTransactions).map(key => {
            //     return accountReportTransactions[key].reduce((acc, { amount }) => {
            //         return acc + amount;
            //     }, 0);
            // });    
            
            // setSeries(seriesData);
            setReportTransactions(accountReportTransactions);
        }
        

        // setIsLoading(false);
    }, [reportAccount, isLoaded, monthYear]);

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
                "fontWeight": 700
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
            y: {formatter: function (values, { seriesIndex, globals: {seriesNames} }) {
                // debugger
                // console.log(seriesIndex);
                // const account = reportTransactions[seriesNames];
                const amount = reportTransactions[seriesNames[seriesIndex]].reduce((acc, {amount}) => {   
                    return acc + amount;
                    }, 0);
                return `${amount.toFixed(2)} BGN`;
              }},
        },
        "labels": Object.keys(reportTransactions),
        "legend": {
            "position": "right",
            "fontSize": 14,
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
        <div> 
            <ReportsDropdown/>
            <Space direction="vertical" size={12}>
                <DatePicker  onChange={(value) => onChangeDate(value)} picker="month" />
            </Space>

        </div>
        { !isLoaded ? <>Loading...</>
        :    
        <div className='ft-pie-chart-expense-wrapper'>
            <h3>Pie Chart Expenses</h3>
            {
                Object.keys(reportTransactions).length 
                ? 
                <ReactApexChart
                options={options}
                series={options.series}
                type="pie"
                height={"100%"}
                width={"100%"}
                />
                // reportTransactions.map(transaction => <p key={transaction.id}>{transaction.category}-{transaction.amountString}</p>)
                :
                <p>No Expenses</p>
            }
        </div>
        }
    </>)
}