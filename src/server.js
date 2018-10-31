var express = require('express');
var app = express();
var fs = require("fs");
var config = JSON.parse(fs.readFileSync("config.json"));
var bodyParser = require('body-parser');
var mariadb = require('mariadb');
var cors = require('cors')
var serverConfig = config.databaseConfig;
var pool = mariadb.createPool(serverConfig);

var cors = require('cors');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 5000;

var router = express.Router();

router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const results = await conn.query("Select * from series ORDER BY name");
        res.json(results);
        console.log("Sent", results.length, "items of all types.");
    } catch(err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});

router.get('/type/:type', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const results = await conn.query("SELECT * FROM series WHERE typ = ? ORDER BY name", [req.params.type]);
        res.json(results);
        console.log("Sent", results.length, "items of type", req.params.type, ".");
    } catch(err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});

router.get('/genre/:genre', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const results = await conn.query("SELECT * FROM series WHERE genre = ? ORDER BY name", [req.params.genre]);
        res.json(results);
        console.log("Sent", results.length, "items of genre", req.params.genre, ".");
    } catch(err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});

router.get('/:type/:genre', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const results = await conn.query("SELECT * FROM series WHERE typ = ? AND genre = ? ORDER BY name", [req.params.type, req.params.genre]);
        res.json(results);
        console.log("Sent", results.length, "items of type", req.params.type, "and genre", req.params.genre, ".");
    } catch(err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});

app.use('/media', router);

app.listen(port);
console.log('Server on port ' + port);