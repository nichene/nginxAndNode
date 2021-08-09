const express = require("express");
var faker = require("faker");
const app = express();
const port = 3000;
const config = {
  host: "db",
  user: "root",
  password: "root",
  database: "nodedb",
};

const mysql = require("mysql");
const connection = mysql.createConnection(config);

const sql_create = `CREATE TABLE IF NOT EXISTS people(id int not null auto_increment, name varchar(255), primary key(id));`;
connection.query(sql_create);

var randomName = faker.name.findName();
const sql = `INSERT INTO people(name) values('${randomName}');`;
connection.query(sql);
connection.end();

getNames = function () {
  return new Promise(function (resolve, reject) {
    const connection = mysql.createConnection(config);
    connection.query("SELECT name FROM people;", function (err, result) {
      if (err) {
        reject(new Error("Error in select names"));
      }

      names = Object.keys(result).map(function (key) {
        var row = result[key];
        return row.name;
      });
      connection.end();
      resolve(names);
    });
  });
};

app.get("/", (req, res) => {
  nameList = getNames().then(function (results) {
    res.setHeader("Content-type", "text/html");
    html = "<h1>Full Cycle is Hella Cool !</h1>";
    html += "<ul>";
    for (var i in results) html += "<li>" + results[i] + "</li>";
    html += "</ul>";
    res.end(html);
  });
});

app.listen(port, () => {
  console.log("Rodando na porta " + port);
});
