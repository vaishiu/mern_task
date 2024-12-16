const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const transactionsRoutes = require('./routes/transactions');

const app = express();
app.use(express.json());

mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/transactions', transactionsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
