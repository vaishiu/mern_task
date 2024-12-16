import React, { useState, useEffect } from 'react';
import TransactionsTable from './components/transactionTable';
import BarChart from './components/barchart';
import PieChart from './components/piechart';

const App = () => {
  const [month, setMonth] = useState('March');
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [barChart, setBarChart] = useState([]);
  const [pieChart, setPieChart] = useState([]);

  const fetchTransactions = async () => {
    const response = await fetch(`/api/transactions/list?month=${month}`);
    const data = await response.json();
    setTransactions(data);
  };

  const fetchStatistics = async () => {
    const response = await fetch(`/api/transactions/statistics?month=${month}`);
    const data = await response.json();
    setStatistics(data);
  };

  const fetchBarChart = async () => {
    const response = await fetch(`/api/transactions/bar-chart?month=${month}`);
    const data = await response.json();
    setBarChart(data);
  };

  const fetchPieChart = async () => {
    const response = await fetch(`/api/transactions/pie-chart?month=${month}`);
    const data = await response.json();
    setPieChart(data);
  };

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchBarChart();
    fetchPieChart();
  }, [month]);

  return (
    <div className="container">
      <h1>Transactions Dashboard</h1>
      <select onChange={(e) => setMonth(e.target.value)} value={month}>
        <option value="January">January</option>
        <option value="February">February</option>
        <option value="March">March</option>
        <option value="April">April</option>
        <option value="May">May</option>
        <option value="June">June</option>
        <option value="July">July</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="October">October</option>
        <option value="November">November</option>
        <option value="December">December</option>
      </select>

      <TransactionsTable transactions={transactions} />
      <div className="statistics">
        <h2>Statistics</h2>
        <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
        <p>Total Sold Items: {statistics.totalSoldItems}</p>
        <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
      </div>
      <BarChart data={barChart} />
      <PieChart data={pieChart} />
    </div>
  );
};

export default App;
