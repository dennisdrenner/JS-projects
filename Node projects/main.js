const {reverse} = require("./reverse");
const {yell} = require("./reverse");
const {dude} = require("./reverse");
//const { moduleFunction } = require("./singleFunction.js");
var logger = require("./singleFunction.js");



//const path = require("path");
//var pathObj = path.parse(__filename);

//console.log(pathObj);

//for (let key in pathObj) {
//    console.log(typeof key); 
//}

const fs = require("fs");
//var readFile = fs.readFile;
var readFile = fs.readFile.promises; 
console.log(fs.promises.readFile);
//console.log(readFile);



//let argument = process.argv[2];
//console.log(reverse(argument));
//console.log(yell);
//yell();
//dude(); 
//console.log(logger);


//logger(); 
