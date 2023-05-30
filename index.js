const express = require('express');
const bodyParser = require('body-parser');
const { ref } = require('./firebase.js');
const exphbs = require('express-handlebars');
const cors = require('cors'); // Import the cors module

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for all routes

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Read data
const readData = () => {
  return ref
    .once('value')
    .then((snapshot) => snapshot.val())
    .catch((error) => {
      console.error('Error reading data:', error);
      throw error;
    });
};

app.get('/', async (req, res) => {
  try {
    const data = await readData();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Error reading data' });
  }
});

app.get('/add', (req, res) => {
  try {
    res.render('add');
  } catch (error) {
    console.error('Error rendering template:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/add', (req, res) => {
  const { account, password } = req.body;

  if (!account || !password) {
    return res.status(400).json({ error: 'Missing account or password in the request body' });
  }

  const newData = {
    [account]: {
      role: 0,
      account: account,
      password: password,
    },
  };

  ref
    .update(new
