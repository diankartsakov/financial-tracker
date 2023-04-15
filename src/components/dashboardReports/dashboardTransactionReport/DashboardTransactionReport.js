
import React, { useState } from 'react';
import { Table, DatePicker, Pagination } from 'antd';
import moment from 'moment';

export default function DashboardTransactionReport() {


  const [data, setData] = useState([
    {
      accountName: 'New Account',
      accountId: 'F3EglkLzurIu7N7mJzXa',
      amount: 1000,
      type: 'Deposit',
      category: 'Card Deposit',
      date: 'April 15, 2023 at 7:07:55 PM UTC+3',
  
    },
    {
      accountName: 'New Account',
      accountId: 'F3EglkLzurIu7N7mJzXa',
      amount: 3000,
      type: 'Deposit',
      category: 'Internal Transfer',
      date: 'April 15, 2023 at 8:07:55 PM UTC+3',
      fromAccountId: 'accountId'
    }
  ]);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter the data based on the search criteria
  const filteredData = data.filter((item) => {
    const itemDate = moment(item.date, 'MMMM D, YYYY [at] h:mm:ss A Z');
    if (fromDate && toDate) {
      return itemDate.isBetween(fromDate, toDate);
    } else if (fromDate) {
      return itemDate.isSameOrAfter(fromDate);
    } else if (toDate) {
      return itemDate.isSameOrBefore(toDate);
    }
    return true;
  });

  // Sort the data based on the selected column and direction
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const sortedData = filteredData.slice().sort((a, b) => {
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
  const columns = [{ title: 'Date', dataIndex: 'date', key: 'date', sorter: true, }, { title: 'Account Name', dataIndex: 'accountName', key: 'accountName', sorter: true, }, { title: 'Transaction Amount', dataIndex: 'amount', key: 'amount', sorter: true, }, { title: 'Category', dataIndex: 'category', key: 'category', sorter: true, },];

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
  const currentData = sortedData.slice(startIndex, endIndex);

  return (
    <div>
      <div>
        <DatePicker
          placeholder="From Date"
          onChange={(e) =>
            setFromDate(e.target.value ? moment(e.target.value) : null)
          }
        />
        <DatePicker
          placeholder="To Date"
          onChange={(value) => setToDate(value)}
        />
      </div>
      <Table
        columns={columns}
        dataSource={currentData}
        pagination={false}
        rowKey={(record) => record.accountId}
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




