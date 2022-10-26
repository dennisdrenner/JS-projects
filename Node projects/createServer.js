const {createServer} = require("http");
//let pageHTML = require("./ccheadshots.js");
let pageSource2 = `<h1>Hello beech!</h1><p>You asked for <code></code></p>`

let server = createServer((request, response) => {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(pageSource2);
    //response.write(`<h1>Hello beech!</h1><p>You asked for <code>${request.url}</code></p>`);
    response.end("Aiiiiiiii!!!!'");    
});

//console.log(pageHTML);

server.listen(8000);
console.log("Listening! port 8000");


    
