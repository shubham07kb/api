const mongo = require('./mongo');
const mysql = require('./mysql');
const postgre = require('./postgre');
async function insertOne(dbvar, tablename, data, e = {}) {
    if (dbvar.type == 'mongodb') {
        res = await mongo.insertOne(dbvar.url, dbvar.dbname, tablename, data, e);
    } else if (dbvar.type == 'mysql') {
        res = await mysql.insertOne(env);
    } else if (dbvar.type == 'postgre') {
        res = await postgre.insertOne(env);
    }
    return res;
}
async function update(dbvar, tablename, predata, data) {
    if (dbvar.type == 'mongodb') {
        res = await mongo.update(dbvar.url, dbvar.dbname, tablename, predata, data);
    } else if (dbvar.type == 'mysql') {
        res = await mysql.update(env);
    } else if (dbvar.type == 'postgre') {
        res = await postgre.update(env);
    }
    return res;
}
async function del(db, env) {
    if (dbvar.type == 'mongodb') {
        res = await mongo.del(env);
    } else if (dbvar.type == 'mysql') {
        res = await mysql.del(env);
    } else if (dbvar.type == 'postgre') {
        res = await postgre.del(env);
    }
    return res;
}
async function query(dbvar, tablename, data, e = {}) {
    if (dbvar.type == 'mongodb') {
        res = await mongo.query(dbvar.url, dbvar.dbname, tablename, data, e);
    } else if (dbvar.type == 'mysql') {
        res = await mysql.query(env);
    } else if (dbvar.type == 'postgre') {
        res = await postgre.query(env);
    }
    return res;
}
function generateUniqueID(characters, length) { let uniqueID = ''; const charactersLength = characters.length; for (let i = 0; i < length; i++){uniqueID += characters.charAt(Math.floor(Math.random() * charactersLength));} return uniqueID; }
module.exports = {
    insertOne: insertOne,
    update: update,
    del: del,
    query: query,
    mongoInsertMany: mongo.insertMany,
    mongoUpdateMany: mongo.updateMany,
    generateUniqueID: generateUniqueID
}