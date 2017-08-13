const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const url = 'mongodb://localhost:27017/test';


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
})); // for parsing application/x-www-form-urlencoded


const insertUser = (db, params, callback) => {
  db.collection('users').insertOne(params, function(err, result) {
    console.log("Inserted a document into the users collection.");
    callback(err);
  });
};


const getUsers = (db, callback) => {
  const cursor = db.collection('users').find();
  const listUsers = [];
  cursor.each((err, doc) => {
    if (doc != null) {
      listUsers.push(doc);
      console.log(doc);
    } else {
      callback(err, listUsers);
    }
  });
};


app.post('/users', (req, res) => {

  MongoClient.connect(url, function(err, db) {
    insertUser(db, req.body, (err) => err ?
      res.send({
        success: false
      }) :
      res.send({
        success: true
      }));
  });

})


app.get('/users', (req, res) => {

  MongoClient.connect(url, function(err, db) {
    getUsers(db, (err, data) => err ?
      res.send({
        success: false
      }) :
      res.send({
        success: true,
        data
      }));
  });

})


app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
})
