const express = require('express');
const path = require('path'); // Import the 'path' module

const app = express();
const port = process.env.PORT || 5000;

const router = express.Router();
const db = require('./database/db');




// Serve static files from the 'public' directory using an absolute path
const publicPath = path.join(__dirname, '../client'); // Calculate the absolute path
app.use(express.static(publicPath));

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.get('/randomFacts/:stateId', (req, res) => {
  const stateId = req.params.stateId;
  
  db.getRandomFactsForState(stateId, (err, randomFacts) => {
    if (err) {
      // Handle the error, e.g., send an error response
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    // Send the random facts as a JSON response
    res.json({ facts: randomFacts });
  });
});

app.get('/statefortoday', (req, res) => {
  db.getStateForToday((err, results) => {
    if (err) {
      // Handle the error, e.g., send an error response
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    // Send the random facts as a JSON response
    res.json({ gen_stateId: results });
  });
});

app.get('/get_state_data_for_the_day', (req, res) => {
  db.get_state_data_for_the_day((err, results) => {
    if (err) {
      // Handle the error, e.g., send an error response
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    // Send the random facts as a JSON response
    res.json({ all_data_for_the_day: results });
  });

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


