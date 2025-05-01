console.log('Starting server...');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('Setting up routes...');
app.get('/', (req, res) => {
  res.send('Server is running!');
});

console.log('Starting to listen on port', PORT);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});