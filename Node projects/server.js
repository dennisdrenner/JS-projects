const { urlencoded } = require('express');
const express = require('express');
const app = express();

app.use(express.static("public")); 
app.use(urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get("/", (req,res) => {
    res.render('index',{text: "World!"});
    });


const userRouter = require("./routes/users");

app.use("/users" , userRouter);


app.listen(3000);

