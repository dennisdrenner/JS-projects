let { readFile } = require("fs");
//let { readFile2 } = require("fs").promises;


readFile("./testFile.txt", "utf8", (error,text) => {
    if (error) throw error;
    console.log("The file contains:", text);
});

readFile("./testFile.txt",  (error,buffer) => {
    if (error) throw error;
    console.log("The file contained ", buffer.length, "bytes. The first byte is: ", buffer[0], "All the buffer looks like this: ", buffer);
});



console.log("promises ", readFile);

console.log('module', module);
