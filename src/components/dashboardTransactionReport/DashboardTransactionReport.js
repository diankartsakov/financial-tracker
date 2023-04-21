
import React, { useEffect, useState } from 'react';
import { Table, DatePicker, Pagination, Space } from 'antd';
import moment from 'moment';
import { useReport } from '../dashboardReports/DashboardReportsProvider';
import ReportsDropdown from '../reportsDropdown/ReportsDropdown';


const { RangePicker } = DatePicker;

export default function DashboardTransactionReport() {
  const { transactions, reportAccount, isLoaded } = useReport();
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {

    const resultData = transactions.filter(transaction => {

      return transaction.accountId === reportAccount.reportAccountId;

    });

    // Filter the data based on the search criteria
    const filteredData = resultData.filter((item) => {


      if (selectedDates.length === 2) {
        // If a range of dates is selected, show items within that range

        return item.date.valueOf() >= selectedDates[0].valueOf() &&
          item.date.valueOf() <= selectedDates[1].valueOf() ?
          true :
          false;

      } else {
        // If no dates are selected, show all items
        return true;
      }
      
    });

    setFilteredTransactions(filteredData);
  }, [reportAccount, selectedDates]);


  const onChangeDate = (dates, dateStrings) => {

    console.log(dates);

    if (dates) {
      // Set the start time of the first selected date to 00:00:00
      const startTime = dates[0].toDate().setHours(0, 0, 0, 0);
      // Set the end time of the second selected date to 23:59:59
      const endTime = dates[1].toDate().setHours(23, 59, 59, 999);
      setSelectedDates([startTime, endTime]);
    } else {
      setSelectedDates([]);
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
        <ReportsDropdown />
        <Space direction="vertical" size={12}>
          <RangePicker onChange={onChangeDate} />
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




