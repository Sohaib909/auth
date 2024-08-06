const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const path = require ('path');
const bcrypt = require('bcrypt');
const userModel = require('./models/user');
//encrypt and dcrypt
const jwt = require('jsonwebtoken')
app.use(cookieParser());
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
//old:
// app.get("/",function(req,res){

// let token = jwt.sign({email:"sohaib@gmail.com"},"secret" );
// res.cookie("token",token);
// res.send("done");
// console.log(token);




    // bcrypt.genSalt(10, function(err, salt) {
    //     bcrypt.hash("sohaib804", salt, function(err, hash) {
    //      console.log(hash)
    //     });
    // });
// })
app.get("/",function(req,res){
     res.render("index")
})
app.post("/create", function(req,res){
    let {username,email,password,age} = req.body
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(password, salt, async(err,hash) =>{
        
    let createdUser = await userModel.create({
    username,
    email,
    password: hash,
    age
    })
    let token = jwt.sign({email},"shhhhhhh");
    res.cookie("token",token);
    res.send(createdUser);
        })
     })
    
    
 })
 
 app.get("/logout", function(req, res){
    res.cookie("token","");
    res.redirect("/");
 })

 app.get("/login", function(req, res){
   res.render('login');

 })

 app.post("/login",async function(req, res){
 let user = await userModel.findOne({email:req.body.email}) 
 if(!user) return res.send("Something went wrong");
 bcrypt.compare(req.body.password, user.password,function(err,result){
    if(result){
        let token = jwt.sign({email:user.email},"shhhhhhh");
    res.cookie("token",token);
     res.send("welcom you are now logged in...");
    }
    else{
        res.send("something went wrong!");
    }
 })
  })

app.listen(3000)