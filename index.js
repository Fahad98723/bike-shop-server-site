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

    //getting all bikes from database ......
    app.get('/bikes', async (req, res) => {
        const cursor = bikeCollection.find({})
        const allBikes = await cursor.toArray()
        res.send(allBikes)
    })
    //getting species bikes from database
    app.get('/bikes/:id', async (req, res) => {
        const id = req.params.id 
        const query = {_id : ObjectId(id)}
        const result = await bikeCollection.findOne(query)
        res.send(result)
    })
    //getting review of users from database
    app.get('/review', async(req, res) => {
        const review = await reviewCollection.find({}).toArray()
        res.send(review)
    })
    //finding admin or not from database
    app.get('/users/:email', async (req, res) => {
        const email = req.params.email
        const query =  {email :  email}
        const user = await userCollection.findOne(query)
        let isAdmin = false
        if (user?.role === 'admin') {
            isAdmin = true
        }
        else{
            isAdmin = false
        }
        res.send({admin : isAdmin})
    })
    //getting order items from database
    app.get('/orderItems', async (req, res) => {
        const query = req.query
        let result = {}
        if (query) {
            result = await orderCollection.find(query).toArray()
        }
        else{
            result = await orderCollection.find({}).toArray()
        }
        res.send(result)
    })
    
    //getting users from data base 
    app.get('/users', async (req, res) => {
        const users = await userCollection.find({}).toArray()
        res.send(users)
    })
    //add users data on database
    app.post('/users', async(req, res) => {
        const data = req.body
        const user = await userCollection.insertOne(data)
        res.json(user)
    })
    //add review of users on database
    app.post('/review', async(req, res) => {
        const data = req.body
        const review = await reviewCollection.insertOne(data)
        res.json(review)
    })
    //add bikes on database
    app.post('/bikes', async (req, res) => {
        const data = req.body
        const result = await bikeCollection.insertOne(data)
        res.json(result)
    })
    //adding orderitems on database
    app.post('/orderItems', async (req, res) => {
        const data = req.body
        const result = await orderCollection.insertOne(data)
        res.json(result)
    })
    //adding users on database
    app.post('/users', async (req, res) => {
        const data = req.body 
        const users = await userCollection.insertOne(data)
        res.send(users)
      })
  
    //if your data already had saved in the database then we don't want save it again
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

    //making users admin 
    app.put('/users/admin', async (req, res) => {
        const data = req.body
        const filter = {email : data.email}
        const updateDoc = {
            $set: {
                role : 'admin'
            },
        }
        const user = await userCollection.updateOne(filter, updateDoc);
        res.json(user)
    })
    //user  orders status update
    app.put('/orderItems/:id', async (req, res) => {
        const id = req.params.id
        const data = req.body
        const query = {_id : ObjectId(id)}
        const option = {upsert : true}
        const updateDoc = {
            $set : {
                name : data.name,
                address : data.address,
                email : data.email,
                bikeName : data.bikeName,
                price : data.price,
                image : data.image,
                phone : data.phone,
                zip : data.zip,
                status : data.status
            }
        }
        const result = await orderCollection.updateOne(query, updateDoc, option)
        res.json(result)
    })
    
    
    //deleting species bikes from database
    app.delete('/bikes/:id', async (req, res) => {
        const id = req.params.id
        const query = {_id : ObjectId(id)}
        const result = await bikeCollection.deleteOne(query)
        res.json(result)
    })
    
    //deleting species orderitems from database
    app.delete('/orderItems/:id', async (req, res) => {
        const id = req.params.id
        const query = {_id : ObjectId(id)}
        const result = await orderCollection.deleteOne(query)
        res.json(result)
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