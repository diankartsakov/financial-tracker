import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState } from "react";
import { useReport } from "../dashboardReports/DashboardReportsProvider"
import ReportsDropdown from '../reportsDropdown/ReportsDropdown';
import { DatePicker, Space } from 'antd';
import { convertDataToDayColumnsSeries, getDaysInMonth, getExpenseTransactionsByDaysForMonth, getExpensesTransactionForMonthYear, getMonthName } from '../../assests/utils/reportDataManipulation';

export default function StackedColumnExpense() {
    const {transactions, reportAccount, isLoaded} = useReport();
    const [expenseTransactions, setExpenseTransactions] = useState([]);
    const [reportTransactions, setReportTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [monthYear, setMonthYear] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });

    // console.log(reportTransactions);
    useEffect(() => {
        if (isLoaded && isLoading) {
            const currentReportExpenseTransactions = transactions.filter(transaction => transaction.type === "Expense");
            // console.log(currentReportExpenseTransactions);
            
            const accountReportTransactions = getExpenseTransactionsByDaysForMonth({
                arr: currentReportExpenseTransactions,
                reportAccountId: reportAccount.reportAccountId,
                month: monthYear.month,
                year: monthYear.year,
            });
            // console.log(accountReportTransactions);
            setExpenseTransactions(currentReportExpenseTransactions);
            setReportTransactions(accountReportTransactions);
            setIsLoading(false);
        } else {
            const accountReportTransactions = getExpenseTransactionsByDaysForMonth({
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
            });


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
                "enabled": false,
                "easing": "swing"
            },
            "background": "",
            "foreColor": "#333",
            "fontFamily": "Roboto",
            "height": 500,
            "id": "8HuOv",
            "stacked": true,
            "toolbar": {
                "show": false
            },
            "type": "bar",
            // "width": 597
            "width": "100%",
        },
        "plotOptions": {
            "bar": {
                "borderRadius": 10,
                "columnWidth": "80%",
                "dataLabels": {
                    "position": "center"
                }
            },
        },
        "dataLabels": {
            "enabled": false,
            "style": {
                "fontWeight": 700
            }
        },
        "grid": {
            "strokeDashArray": 20,
            "row": {},
            "column": {},
            "padding": {
                "right": 25,
                "left": 15
            }
        },
        "legend": {
            "fontSize": 14,
            "offsetY": 0,
            "markers": {
                "shape": "square",
                "size": 8
            },
            "itemMargin": {
                "vertical": 0
            }
        },
        "series": convertDataToDayColumnsSeries(reportTransactions),
        // "series": [],
        "tooltip": {
            "shared": false,
            "intersect": true,
            enabled: true,
            "fillSeriesColor": true,
            y: {formatter: function (values, {}) {
                const amount = values.toFixed(2) + " BGN";
                return amount;
            }},
        },
        "xaxis": {
            "type": "category",
            categories: getDaysInMonth(monthYear.year,monthYear.month),
            categories: [],
            "labels": {
                "trim": true,
                "style": {
                    "rotate": -45,
                    "fontSize": "12px"
                }
            },
            "tickPlacement": "between",
            "title": {
                "style": {
                    "fontWeight": 700
                }
            },
            "tooltip": {
                "enabled": false
            }
        },
        "yaxis": {
            "forceNiceScale": true,
            "decimalsInFloat": true
        },
        "theme": {
            "palette": "palette4"
        }
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
            <h3>Stacked Column Expenses - {getMonthName(monthYear.month)} {monthYear.year}</h3>
            {
                Object.keys(reportTransactions).length 
                ? 

                <ReactApexChart
                options={options}
                series={options.series}
                type="bar"
                height={"100%"}
                width={"100%"}
                />
                // reportTransactions.map(transaction => <p key={transaction.id}>{transaction.category}-{transaction.amountString}</p>)
                :
                <p>No Expenses</p>
            }
        </div>
        }
    </>);
}