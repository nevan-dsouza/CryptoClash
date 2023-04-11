require('dotenv').config();

// console.log(process.env.DB_URI);

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://nevan-dsouza:dkTVqsEL8YR2Uamb@cyrptoclash.frozmvu.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("room");
  // perform actions on the collection object
  client.close();
});