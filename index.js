const express = require('express');
const bodyParser = require('body-parser');
const { ref } = require('./firebase.js');
const exphbs  = require('express-handlebars');

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', './views');
// Read data
ref.once('value')
  .then((snapshot) => {
    const data = snapshot.val();
    console.log(data);
  })
  .catch((error) => {
    console.error('Error reading data:', error);
  });

app.get('/', (req, res) => {
  ref.once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      console.log(data);
      res.json(data);
    })
    .catch((error) => {
      console.error('Error reading data:', error);
      res.status(500).json({ error: 'Error reading data' });
    });
});

app.get('/add', (req, res) => {
  res.render('add');
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

  ref.update(newData)
    .then(() => {
      console.log('Data updated successfully.');
      res.json(newData);
    })
    .catch((error) => {
      console.error('Error updating data:', error);
      res.status(500).json({ error: 'Failed to update data' });
    });
});

app.listen(port, () => {
  console.log(`Express started on http://localhost:${port}; press Ctrl-C to terminate.`);
});
