var MongoClient = require('mongodb').MongoClient;
async function query(mongourl, dbname, colname, data, e = {}) {
  var db = await MongoClient.connect(mongourl);
  var dbo = await db.db(dbname);
  var r = await dbo.collection(colname).find(data, e).toArray();
  db.close();
  return r;
}
async function update(mongourl, dbname, colname, predata, data) {
  var db = await MongoClient.connect(mongourl);
  var dbo = await db.db(dbname);
  try {
    var r = await dbo.collection(colname).updateMany(predata, data);
    db.close();
    return { status: 'success', statcode: 1, message: r };
  } catch (e) {
    return { status: 'error', statcode: 0, message: e };
  }
}
async function del() {
    
}
async function insertOne(mongourl, dbname, colname, data) {
  var db = await MongoClient.connect(mongourl);
  var dbo = await db.db(dbname);
  try {
    var r = await dbo.collection(colname).insertOne(data);
    db.close();
    return { status: 'success', statcode: 1, message: r };
  } catch (e) {
    return { status: 'error', statcode: 0, message: e };
  }
}
async function insert(mongourl, dbname, colname, data) {
  var db = await MongoClient.connect(mongourl);
  var dbo = await db.db(dbname);
  try {
    var r = await dbo.collection(colname).insertMany(data);
    db.close();
    return { status: 'success', statcode: 1, message: r };
  } catch (e) {
    return { status: 'error', statcode: 0, message: e };
  }
}
module.exports = {
  query: query,
  update: update,
  del: del,
  insert: insert,
  insertOne: insertOne
}