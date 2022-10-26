var express = require('express');

var app = express(); 

app.listen(3000);

app.get('/', function(req, res) {
    res.send("This is the home page");
});

app.get('/contact', function(req, res) {
    res.send("This is the contact page");
});

app.get('/profile/:id', function(req, res, status){
    res.status(status).send('You requested info on profile id#', + req.params.id);
    //res.send('You requested info on profile id#', + req.params.id);
});



// var http = require("http");
// var fs = require("fs");
// //const {createServer} = require("http");


// var i = 0; 

// // myReadStream.on("data", function(chunk){
// //     console.log('new chunk recieved:');
// //     myWriteStream.write(chunk); 
// //     i+=1; 
// //     console.log("-------------------------------->>>>", i);

// // });

// //myReadStream.pipe(myWriteStream);


// // let server = http.createServer((request, response) => {
// //     console.log("Request was made");
// //     response.writeHead(200, {"Content-Type": "text/html"});
// //     //response.write(pageSource2);
// //     var myReadStream = fs.createReadStream(__dirname + "/index.html", "utf8");
// //     //var myWriteStream = fs.createWriteStream(__dirname + "/writeMe.txt");
// //     myReadStream.pipe(response);
   
// // });

// let server = http.createServer((request, response) => {
//     console.log("Request was made:", request.url);
//     response.writeHead(200, {"Content-Type": "text/plain"});
//     // var myObj = {
//     //     name: "Davinci",
//     //     age: 12, 
//     //     favoriteFood: "cats",
//     // }
//     // response.end(JSON.stringify(myObj));
//     response.end('popcorn beeech!');
   
// });

// //console.log(http.createServer);

// server.listen(8000);
// console.log("Listening! port 8000");