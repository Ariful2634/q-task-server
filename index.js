const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// middleware

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.stv3jdc.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)

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


    const qtaskCollection = client.db("qtaskDB").collection("task")

    app.post('/task', async (req, res) => {
        const newTask = req.body;
        const result = await qtaskCollection.insertOne(newTask)
        res.send(result)
      })

      app.get('/task', async (req, res) => {
        const cursor = qtaskCollection.find()
        const result = await cursor.toArray()
        res.send(result)
      })


    //   for change status
      app.put('/task/status/:id',  async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) }
        const options = { upsert: true };
        const updateStatus = req.body;
        const status = {
            $set: {

                status: updateStatus.status,


            }
        }
        const result = await qtaskCollection.updateOne(filter, status, options)
        res.send(result)
    })


      // find

      app.get('/tasks/:id', async (req, res) => {

        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await qtaskCollection.findOne(query)
        res.send(result)
  
      })
  
      // update
  
      app.put('/update/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) }
        const options = { upsert: true };
        const updateTask = req.body;
        const update = {
          $set: {
            task: updateTask.task,
            priority: updateTask.priority,
  
          }
        }
        const result = await qtaskCollection.updateOne(filter,update,options)
        res.send(result)
      })


    // for delete
    app.delete('/task/:id', async(req,res)=>{
        const id  = req.params.id;
          const query ={_id: new ObjectId(id)}
          const result = await qtaskCollection.deleteOne(query)
          res.send(result)
      })







    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("QTask server is running")
  })
  
  app.listen(port, () => {
    console.log(`QTask server is running on PORT:${port} `)
  })