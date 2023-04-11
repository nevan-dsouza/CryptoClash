require('dotenv').config();

// console.log(process.env.DB_URI);

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "placeholder_URI";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("room");
  // perform actions on the collection object
  client.close();
});
