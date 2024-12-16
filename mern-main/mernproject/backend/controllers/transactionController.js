const axios = require('axios');
const Transaction = require('../models/Transaction');

const dataUrl = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

exports.initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get(dataUrl);
    const transactions = response.data;

    await Transaction.deleteMany({});
    await Transaction.insertMany(transactions);

    res.status(200).send('Database initialized');
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.listTransactions = async (req, res) => {
  const { month, page = 1, perPage = 10, search } = req.query;
  const skip = (page - 1) * perPage;
  const searchRegex = new RegExp(search, 'i');
  const monthInt = new Date(Date.parse(month + " 1, 2024")).getMonth() + 1;

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $regex: `-${String(monthInt).padStart(2, '0')}-` },
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { price: searchRegex }
      ]
    }).skip(skip).limit(Number(perPage));

    res.json(transactions);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.getStatistics = async (req, res) => {
  const { month } = req.query;
  const monthInt = new Date(Date.parse(month + " 1, 2024")).getMonth() + 1;

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $regex: `-${String(monthInt).padStart(2, '0')}-` }
    });

    const totalSaleAmount = transactions.reduce((sum, trans) => sum + (trans.sold ? trans.price : 0), 0);
    const totalSoldItems = transactions.filter(trans => trans.sold).length;
    const totalNotSoldItems = transactions.filter(trans => !trans.sold).length;

    res.json({ totalSaleAmount, totalSoldItems, totalNotSoldItems });
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.getBarChart = async (req, res) => {
  const { month } = req.query;
  const monthInt = new Date(Date.parse(month + " 1, 2024")).getMonth() + 1;

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $regex: `-${String(monthInt).padStart(2, '0')}-` }
    });

    const priceRanges = Array(10).fill(0);
    transactions.forEach(trans => {
      const rangeIndex = Math.min(Math.floor(trans.price / 100), 9);
      priceRanges[rangeIndex]++;
    });

    res.json(priceRanges.map((count, index) => ({
      range: index === 9 ? '901-above' : `${index * 100}-${(index + 1) * 100}`,
      count
    })));
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.getPieChart = async (req, res) => {
  const { month } = req.query;
  const monthInt = new Date(Date.parse(month + " 1, 2024")).getMonth() + 1;

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $regex: `-${String(monthInt).padStart(2, '0')}-` }
    });

    const categories = {};
    transactions.forEach(trans => {
      categories[trans.category] = (categories[trans.category] || 0) + 1;
    });

    res.json(Object.entries(categories).map(([category, count]) => ({ category, count })));
  } catch (error) {
    res.status(500).send('Server error');
  }
};

exports.getCombinedData = async (req, res) => {
  try {
    const statistics = await this.getStatistics(req, res);
    const barChart = await this.getBarChart(req, res);
    const pieChart = await this.getPieChart(req, res);

    res.json({ statistics, barChart, pieChart });
  } catch (error) {
    res.status(500).send('Server error');
  }
};
