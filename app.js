// init project
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// Connent to the MongoDB database
MongoClient.connect(process.env.MONGO_URI, function (err, client) {
  if (err) throw err

  const db = client.db('joe-rogan-quotes')
  
  app.get('/quotes', function(request, response) {
    let num = Number(request.query.count);
    num = !num ? 1 : num;
    
    db.collection('quotess').aggregate([{ $sample : {size : num }}, {$project: {_id: 0, quote: 1, author: 1}}]).toArray(function (err, result) {
      if (err) throw err
      response.send(result);
    })
  });
  
})

// listen for requests :)
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server has started on ${PORT}`))
