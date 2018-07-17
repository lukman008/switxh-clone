var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient();
const assert = require('assert');
const url = 'mongodb://luqman:meleoron43@ds231961.mlab.com:31961/heroku_39xp0czl';
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://broker.shiftr.io', {
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: 'P_monitor',
  password: 'monitor10'
});
const dbName = 'heroku_39xp0czl';

const connection = MongoClient.connect(url);


client.on('connect', function () {
  client.subscribe('klempy/Energy_monitr', function (err, granted) {
    client.publish('klempy/Energy_monitr', 'Hello mqtt from NODEJS');
    connection.then(function (db) {
      db = db.db(dbName);
      db.createCollection('Switxh', function (err, collection) {
        collection.findOne({ _id: 'dd-swx-001' }, function (err, result) {
          assert.strictEqual(err, null);
          client.publish('klempy/Energy_monitr', JSON.stringify(result));
        });
      });
    });
  });
});





router.get('/', function (req, res, next) {
  connection.then(function (db) {
    db = db.db(dbName);
    db.createCollection('Switxh', function (err, collection) {
      assert.strictEqual(null, err);
      collection.findOne({ _id: 'dd-swx-001' }, function (err, result) {
        assert.strictEqual(err, null);
        res.json(result);
      });
    });
  });
});

router.get('/app', function (req, res, next) {
  var query;
  console.log(req.query);
  try {
    query = JSON.parse(req.query);
  } catch (err) {
    console.log(err);
  }


  connection.then(function (db) {
    db = db.db(dbName);
    db.createCollection('Switxh', function (err, collection) {
      assert.strictEqual(null, err);
      collection.update({ _id: "dd-swx-001" }, { a: query.a, b: query.b, c: query.c, d: query.d, dateModified: Date.now(), caller: "app" }, { upsert: true }, function (err, result) {
        assert.strictEqual(err, null);
        collection.findOne({ _id: 'dd-swx-001' }, function (err, result) {
          assert.strictEqual(err, null);
          res.json(result);
        });
      });
    });
  });
});

router.get('/hw', function (req, res, next) {
  var query;
  console.log(req.query);
  try {
    query = JSON.parse(req.query);
  } catch (err) {
    console.log(err);
    res.end("Invalid parameters");
    return;
  }
  connection.then(function (db) {
    db = db.db(dbName);
    db.createCollection('Switxh', function (err, collection) {
      assert.strictEqual(null, err);
      collection.update({ _id: "dd-swx-001" }, { power: query.power, voltage: query.voltage, dateModified: Date.now(), caller: "hw" }, { upsert: true }, function (err, result) {
        assert.strictEqual(err, null);
        collection.findOne({ _id: 'dd-swx-001' }, function (err, result) {
          assert.strictEqual(err, null);
          res.json(result);
        });
      });
    });
  });
});

module.exports = router;
