var mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectID
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('websites', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'productdb' database");
        db.collection('websiteList', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'websites' collection doesn't exist. Creating it with sample data...");
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = new ObjectId(req.params.id);
    console.log('Retrieving product: ' + id);
    db.collection('websiteList', function(err, collection) {
        collection.findOne({'_id':id}, function(err, item) {
            res.send(JSON.stringify(item,false,4));
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('websiteList', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(JSON.stringify(items,false,4));
        });
    });
};

exports.addproduct = function(req, res) {
    var product = req.body;
    console.log('Adding product: ' + JSON.stringify(product));
    db.collection('websiteList', function(err, collection) {
        collection.insert(product, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.deleteproduct = function(req, res) {
    var id = new ObjectId(req.params.id);
    console.log('Deleting product: ' + id);
    db.collection('websiteList', function(err, collection) {
        collection.remove({'_id':id}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}