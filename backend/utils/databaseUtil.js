const mongo = require("mongodb");

const MongoClient = mongo.MongoClient;

const Mongo_Url = "mongodb://airbnbfinal:ritishhbansal@ac-gxzdswg-shard-00-00.wnn7bbc.mongodb.net:27017,ac-gxzdswg-shard-00-01.wnn7bbc.mongodb.net:27017,ac-gxzdswg-shard-00-02.wnn7bbc.mongodb.net:27017/?ssl=true&replicaSet=atlas-rybrcn-shard-0&authSource=admin&appName=Airbnb2";

let _db;

const client = new MongoClient(Mongo_Url, {
  tls: true,
  family: 4   
});

const mongoConnect = (callback) => {
  client.connect()
  .then(() => {
    console.log("MongoDB Connected Successfully");
    _db = client.db("TravelPlanner");  
    callback();
  })
  .catch(error => {
    console.log("Error while connecting to MongoDB:", error);
  });
};

const getdb = () => {
  if (!_db) {
    throw new Error("Database not connected");
  }
  return _db;
};

exports.mongoConnect = mongoConnect;
exports.getdb = getdb;