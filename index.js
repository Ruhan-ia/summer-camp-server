const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port =process.env.PORT || 5000 ;

app.use(express.json())
// app.use(cors())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dzmtgtr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const popularCollections = client.db('sportsDB').collection('popular')
    const cartCollections = client.db('sportsDB').collection('carts')
    app.get('/allClasses', async(req, res ) =>{
      const cursor = await popularCollections.find().toArray()
      res.send(cursor)
  })
  
    app.get('/popularClass', async(req, res ) =>{
        const cursor = await popularCollections.find().sort({number_of_students:-1}).limit(6).toArray()
        res.send(cursor)
    })
    // cart api
    app.get('/carts', async(req, res) =>{
      const email = req.query.email;
      if(!email){
        res.send([]);
      }
      const query = {email: email}
      const result = await cartCollections.find(query).toArray();
      res.send(result)
    })

   app.post('/carts', async(req, res ) =>{
    const selected = req.body
    console.log(selected)
    const result = await cartCollections.insertOne(selected)
    res.send(result)
   })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send('camp started soon')
})

app.listen(port, () =>{
    console.log(`camp is coming soon on port, ${port}`)
})