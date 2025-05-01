require('dotenv').config();
console.log('Environment variables loaded.');

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

console.log('Checking Shopify credentials...');
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!SHOPIFY_STORE || !SHOPIFY_ACCESS_TOKEN) {
  console.error('Error: Missing Shopify credentials in .env file.');
  process.exit(1);
}

console.log('Setting up middleware...');
// app.use(cors({ origin: '*' }));
// app.use(bodyParser.json());

console.log('Defining routes...');
app.get('/', (req, res) => {
  console.log('Root route hit');
  res.send('Server is running!');
});

console.log('Starting server...');
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});