const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()



const app = express()
app.use(bodyParser.json());
app.use(cors())
const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g5hnt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emajhon").collection("products");
  app.post('/addProducts', (req, res) => {
      const product = req.body;
       productsCollection.insertOne(product)
      .then(result => {
         res.send(result.insertedCount)
      })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.get('/product/:key', (req, res) => {
    productsCollection.find({key:req.params.key})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })

  app.post('/productByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: {$in: productKeys}})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })


});


app.listen(port)