import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState } from "react";
import { useReport } from "../dashboardReports/DashboardReportsProvider"
import ReportsDropdown from '../reportsDropdown/ReportsDropdown';
import { DatePicker, Empty, Space } from 'antd';
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

    useEffect(() => {
        if (isLoaded && isLoading) {
            const currentReportExpenseTransactions = transactions.filter(transaction => transaction.type === "Expense");
            
            const accountReportTransactions = getExpenseTransactionsByDaysForMonth({
                arr: currentReportExpenseTransactions,
                reportAccountId: reportAccount.reportAccountId,
                month: monthYear.month,
                year: monthYear.year,
            });
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
            "fontSize": 22,
            "fontWeight": 600,
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
        "tooltip": {
            "shared": false,
            "intersect": true,
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
            "type": "category",
            categories: getDaysInMonth(monthYear.year,monthYear.month),
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
            <h3 className='chart-title'>Stacked Column Expenses - {getMonthName(monthYear.month)} {monthYear.year}</h3>
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
                :
                <div className='empty-wrapper'>
                    <Empty description={false}>
                        <h3>No Expense Data</h3>
                    </Empty>
                    
                </div>
            }
        </div>
        }
    </>);
}