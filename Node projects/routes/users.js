
const { application } = require("express");
const express = require("express");
const router = express.Router(); 


//router.use(logger); 

router.get("/", (req, res) => {
    res.send("User List");
});

router.get("/new", (req, res) => {
    res.render("users/new", {firstName: "test name"});
});

router.post("/", (req,res) => { 
    const isValid = false; 
    if (isValid) {
        users.push({firstName: req.body.firstName});
        res.redirect(`/users/${users.length-1}`) 
    }
    else {
        console.log('error');
        res.render('users/new', {firstName: req.body.firstName});
    }
    //console.log(req.body.firstName);
    //res.send("hi");
})

router.get("/:id", (req,res) => {
    //console.log('hoooooo', req.user);
    //res.send(req.user.name);
    res.send(`${req.user.name}  Get user with ID ${req.params.id}`);
})

router.put("/:id", (req,res) => {
    //console.log(req.params.id);
    res.send(`Update user with ID ${req.params.id}`);
});

router.delete("/:id", (req,res) => {
    //console.log(req.params.id);
    res.send(`Delete user with ID ${req.params.id}`);
});

const users = [{name:"Jimmy"}, {name: "Fuckface"}];

router.param("id", (req, res, next, id) =>  {
    req.user = users[id];
    next(); 
    });

function logger (req, res, next) {
    console.log('original URL', req.originalUrl); 
    console.log("I am the logger!");
    next(); 
    }
    

    

module.exports = router;  