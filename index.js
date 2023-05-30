const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
var http = require("http");
const expressHandlebars = require('express-handlebars')
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "handlebars");
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
app.set("views", "./views");
app.engine('handlebars', expressHandlebars.engine({
  defaultLayout: 'main',
}))
const admin = require('firebase-admin');
const serviceAccount = require('./mywallet-94a61-firebase-adminsdk-pl3bi-083b6e55b9.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://mywallet-94a61-default-rtdb.firebaseio.com' // Replace with your database URL
});
// Read data
const ref = admin.database().ref('/');
ref.once('value')
  .then((snapshot) => {
    const data = snapshot.val();
    console.log(data);
  })
  .catch((error) => {
    console.error('Error reading data:', error);
  });

// Write data
const newData = {
  name: {
    a:'1',
    b:'2'
  },
  age: 25,
  email: 'john@example.com'
};


//   .then(() => {
//     console.log('Data written successfully.');
//   })
//   .catch((error) => {
//     console.error('Error writing data:', error);
//   });a
// ref.child('name/a').remove()
//   .then(() => {
//     console.log('Child node removed successfully.');
//   })
//   .catch((error) => {
//     console.error('Error removing child node:', error);
//   });
// ref.update(updatedData)
//   .then(() => {
//     console.log('Data updated successfully.');
//   })
//   .catch((error) => {
//     console.error('Error updating data:', error);
//   });
app.get('/',(req,res)=>{
  const ref = admin.database().ref('/');

  ref.once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      console.log(data);

      // Send the data as a JSON response
      res.json(data);
      res.end();
    })
    .catch((error) => {
      console.error('Error reading data:', error);
      // Handle the error and send an appropriate response
      res.status(500).json({ error: 'Error reading data' });
    });
})
// app.get('/add',(req,res)=>{
//   res.render('add');
// })
app.get('/add', (req, res) => {
  res.render('add')
 
});
app.post('/add', (req, res) => {
  const { account, password } = req.body;
  
  if (!account || !password) {
    return res.status(400).json({ error: 'Missing account or password in the request body' });
  }

  // Example data to be added
  const newData = {
    [account]: {
      role: 0,
      account: account,
      password: password,
    },
  };

  // Update the database with the new data
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


app.listen(port, () =>
  console.log(
    `Express started on http://localhost:${port}; ` +
    "press Ctrl-C to terminate. "
  )
);
