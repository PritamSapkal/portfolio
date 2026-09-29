require('dotenv').config();

const cors = require('cors');
const express = require('express');
const path = require('path');
const contactHandler = require('./api/contact');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.static(__dirname));

app.post('/api/contact', contactHandler);

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => {
  console.log(`Contact server listening on port ${PORT}`);
});
