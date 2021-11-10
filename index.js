const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()

const cors = require('cors')
app.use(cors())
app.use(express.json())

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rf28w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();

      const database = client.db("triangle-bike");
      const bikeCollection = database.collection("bikes");
      const orderCollection = database.collection("orderItem");
      const userCollection = database.collection("users");
      const reviewCollection = database.collection("review");

    app.get('/bikes', async (req, res) => {
        const cursor = bikeCollection.find({})
        const allBikes = await cursor.toArray()
        res.send(allBikes)
    })

    app.get('/bikes/:id', async (req, res) => {
        const id = req.params.id 
        const query = {_id : ObjectId(id)}
        const result = await bikeCollection.findOne(query)
        res.send(result)
    })
    app.post('/users', async(req, res) => {
        const data = req.body
        const user = await userCollection.insertOne(data)
        res.json(user)
    })
    app.post('/review', async(req, res) => {
        const data = req.body
        const review = await reviewCollection.insertOne(data)
        res.json(review)
    })
    app.get('/review', async(req, res) => {
        const review = await reviewCollection.find({}).toArray()
        res.send(review)
    })
    app.put('/users', async(req, res) => {
        const data = req.body
        const filter = {email : data.email}
        const options = { upsert: true };
        const updateDoc = {
            $set: data,
        }
        const user = await userCollection.updateOne(filter, updateDoc, options);
        res.json(user)
    })

    app.put('/users/admin', async(req, res) => {
        const data = req.body
        console.log(data);
        const filter = {email : data.email}
        const updateDoc = {
            $set: {
                role : 'admin'
            },
        }
        const user = await userCollection.updateOne(filter, updateDoc);
        res.json(user)
    })
    app.post('/bikes', async (req, res) => {
        const data = req.body
        const result = await bikeCollection.insertOne(data)
        res.json(result)
    })

    app.post('/orderItems', async (req, res) => {
        const data = req.body
        console.log(data);
        const result = await orderCollection.insertOne(data)
        res.json(result)
    })
      
    app.get('/orderItems', async (req, res) => {
        const query = req.query
        console.log(query);
        let result = {}
        if (query) {
            result = await orderCollection.find(query).toArray()
        }
        else{
            result = await orderCollection.find({}).toArray()
        }
        res.send(result)
    })
    
    


    app.post('/users', async (req, res) => {
      const data = req.body 
      const users = await userCollection.insertOne(data)
      res.send(users)
    })

    } 
    finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req , res) => {
    res.send('Triangle Bike Site')
})

app.listen(port, () => {
    console.log('server running on ' ,port);
})