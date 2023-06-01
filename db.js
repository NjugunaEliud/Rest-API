const { MongoClient } = require('mongodb');

let dbConnection;
let uri="mongodb+srv://Kamaa:Kamaa@cluster0.dih52we.mongodb.net/?retryWrites=true&w=majority"

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db('bookstore');
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb();
      });
  },
  getDb: () => dbConnection,
};
