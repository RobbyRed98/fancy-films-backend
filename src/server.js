var express    = require('express');        
var app        = express();
var fs         = require("fs");
var config     = JSON.parse(fs.readFileSync("config.json"));                
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var serverConfig = config.databaseConfig;
var connection = mysql.createConnection(serverConfig);
 
connection.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 5000;       

var router = express.Router();

router.get('/', function(req, res) {
    connection.query("Select * from series", (error,results,fields)=>{
        res.json(results);
    });   
});

router.get('/type/:type', function(req, res) {
    connection.query("SELECT * FROM series WHERE typ = ?", [req.params.type] ,(error,results,fields)=>{
        res.json(results);
    });
});

router.get('/genre/:genre', function(req, res) {
    connection.query("SELECT * FROM series WHERE genre = ?", [req.params.genre] ,(error,results,fields)=>{
        res.json(results);
    });
});  

router.get('/:type/:genre', function(req, res) {
    connection.query("SELECT * FROM series WHERE typ = ? AND genre = ?", [req.params.type, req.params.genre], (error,results,fields)=>{
        res.json(results);
    });
});

app.use('/series', router);

app.listen(port);
console.log('Server on port ' + port);