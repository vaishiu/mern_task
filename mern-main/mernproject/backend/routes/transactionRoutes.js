const express = require('express');
const {
  initializeDatabase,
  listTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData
} = require('../controllers/transactionsController');

const router = express.Router();

router.get('/initialize', initializeDatabase);
router.get('/list', listTransactions);
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChart);
router.get('/pie-chart', getPieChart);
router.get('/combined', getCombinedData);

module.exports = router;
