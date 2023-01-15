const path = require('path');
const express = require('express');
const app = express();

const connectDB = require('./config/db');

connectDB();
app.use(express.json());

app.use('/api/alumni', require('./routes/api/alumni'));
app.use('/api/article', require('./routes/api/article'));

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
