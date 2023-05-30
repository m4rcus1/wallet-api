const admin = require('firebase-admin');
const serviceAccount = require('./mywallet-94a61-firebase-adminsdk-pl3bi-083b6e55b9.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://mywallet-94a61-default-rtdb.firebaseio.com' // Replace with your database URL
});

const db = admin.database();
const ref = db.ref('/');

module.exports = { admin, db, ref };
