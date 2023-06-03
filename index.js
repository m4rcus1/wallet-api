const express = require('express');
const bodyParser = require('body-parser');
const { ref } = require('./firebase.js');
const exphbs = require('express-handlebars');
const cors = require('cors'); // Import the cors module

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Replace "*" with your desired origin or whitelist of origins
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

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


const generateRandomKey = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    key += characters.charAt(randomIndex);
  }

  return key;
};

// Function kiểm tra sự tồn tại của khóa trong Firebase
const checkKeyExists = async (key) => {
  try {
    const snapshot = await admin.database().ref(key).once('value');
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking key existence:', error);
    throw error;
  }
};

// Function tạo và kiểm tra khóa
const generateAndCheckKey = async (length) => {
  const key = generateRandomKey(length);
  console.log('Random Key:', key);

  try {
    const exists = await checkKeyExists(key);
    console.log(`Key '${key}' exists: ${exists}`);
  } catch (error) {
    console.error('Error:', error);
  }
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



app.post('/add', async (req, res) => {
  const { account, password } = req.body;

  if (!account || !password) {
    return res.status(400).json({ error: 'Missing account or password in the request body' });
  }
  let detail='User Detail'
  const key = generateRandomKey(28); // Generate a random key

  const newData = {
    [key]: {
      [detail]: {
        role: 0,
        userAccount: account,
        userPassword: password,
      },
    },
  };

  try {
    await ref.update(newData);
    console.log('Data updated successfully.');
    res.json(newData);
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Failed to update data' });
  }
});


app.listen(port, () => {
  console.log(`Express started on http://localhost:${port}; press Ctrl-C to terminate.`);
});
