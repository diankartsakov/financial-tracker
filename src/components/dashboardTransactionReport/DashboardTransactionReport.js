
import React, { useEffect, useState } from 'react';
import { Table, DatePicker, Pagination, Space } from 'antd';
import moment from 'moment';
import { useDash } from '../../pages/dashboardPage/DashboardProvider';
import { useReport } from '../dashboardReports/DashboardReportsProvider';
import ReportsDropdown from '../reportsDropdown/ReportsDropdown';


export default function DashboardTransactionReport() {
  const {transactions, reportAccount, isLoaded} = useReport();
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monthYear, setMonthYear] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
});

  const { accountsArr } = useDash();
  // const accountIds = accountsArr.map(account => {
  //   return account.accountId;
  // });


  useEffect (()=> {

    const resultData = transactions.filter(transaction => {

      return transaction.accountId == reportAccount.reportAccountId;
    })

    console.log(resultData);


  },[reportAccount, monthYear]);

  useEffect(() => {

    transactions.forEach((transaction) => {
        
      if(transaction.type === 'Expense'){
          transaction.category = `${transaction.type} / ${transaction.category}`;
      }
      if(transaction.type === 'Transfer'){

          transaction.toAccountId ?
          transaction.category = 'Outgoing Transfer':
          transaction.category = 'Incoming Transfer';
      }

     transaction.amountString = `${transaction.amount.toFixed(2)} BGN`;


  });

    // console.log("useEffectRender");
    // Filter the data based on the search criteria
    const filteredData = transactions.filter((item) => {

      if (fromDate && toDate) {

        return item.date.valueOf() >= fromDate.valueOf() &&
          item.date.valueOf() <= toDate.valueOf() ?
          true :
          false;

      } else if (fromDate) {

        return item.date.valueOf() >= fromDate.valueOf() ?
          true :
          false;

      } else if (toDate) {

        return item.date.valueOf() <= toDate.valueOf() ?
          true :
          false;
      }
      return true;
    });

    setFilteredTransactions(filteredData);
  }, [fromDate, toDate, transactions]);


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
        });
    }
};


  // Sort the data based on the selected column and direction
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const sortedData = filteredTransactions.slice().sort((a, b) => {
    if (!sortColumn || !sortDirection) {
      return 0;
    }
    const columnA = a[sortColumn];
    const columnB = b[sortColumn];
    let result = 0;
    if (columnA > columnB) {
      result = 1;
    } else if (columnA < columnB) {
      result = -1;
    }
    return sortDirection === 'asc' ? result : -result;
  });

  // Set up the columns for the table
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => moment(a.date).valueOf() - moment(b.date).valueOf(),
      render: (date) => moment(date).format("MMMM D, YYYY [at] h:mm:ss A Z")
    },
    {
      title: 'Account Name',
      dataIndex: 'accountName',
      key: 'accountName',
      sorter: (a, b) => a.accountName.localeCompare(b.accountName)
    },
    {
      title: 'Transaction Amount',
      dataIndex: 'amountString',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: 'Category',
      dataIndex: 'mixedCategory',
      key: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category)
    }
  ];

  // Handle column sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Calculate pagination settings
  const pageSize = 20;
  const total = sortedData.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = sortedData.slice(startIndex, endIndex).map((item) => ({
    ...item,
  }));

  return (
    <div>
         <div className="filter-wrapper"> 
            <ReportsDropdown/>
            <Space direction="vertical" size={12}>
                <DatePicker onChange={(value) => onChangeDate(value)} picker="month" />
            </Space>
        </div>
      <Table
        columns={columns}
        dataSource={currentData}
        pagination={false}
        rowKey={(record) => record.id}
        onHeaderCell={(column) => ({
          onClick: () => handleSort(column.dataIndex),
        })}
        sortDirections={['ascend', 'descend']}
        loading={false}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}




