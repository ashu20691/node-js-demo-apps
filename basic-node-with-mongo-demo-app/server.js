const express = require('express');

const bodyParser= require('body-parser');

const app = express();

const MongoClient = require('mongodb').MongoClient;

    MongoClient.connect('mongodb://localhost:27017/my-test', function(err, database)  {
    if (err) return console.log(err)
    db = database;
        var server = app.listen(9090, function () {
            var host = server.address().address
            var port = server.address().port

            console.log("Example app listening at http://%s:%s", host, port)
        })
    })


app.use(bodyParser.urlencoded({extended: true}));

// All your handlers here...



app.get('/', function(req, res) {
    res.sendFile(__dirname+'/index.html')
// Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
// Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
});

app.post('/quotes', function(req, res)  {
    db.collection('quotes').save(req.body, function(err, result) {
        if (err) return console.log(err)
        console.log('saved to database')
    res.redirect('/')
})
});





//app.get('/', (req, res) => {
//    res.sendFile("views" + '/index.html')
// Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
// Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
//})