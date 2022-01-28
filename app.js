const express = require("express");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require("express-session");

dotenv.config({path:"./config.env"});
const TWO_HOURS = 1000 * 60 * 60 * 2*10;
const SESS_LIFETIME = TWO_HOURS;
const SESS_NAME = 'sid';
const SESS_SECRET = 'naruto';

const app = express();

app.use(session({
    name:SESS_NAME,
    resave:false,
    saveUninitialized:false,
    secret:SESS_SECRET,
    cookie:{
        maxAge:SESS_LIFETIME,
        sameSite:true,

    }
}))

app.use(cookieparser());
const public_directory = path.join(__dirname,'./public');
app.use(express.static(public_directory));

const db = mysql.createConnection({
    host:'localhost',
    user:"root",
    password:"",
    database:"bank"
})

app.set("view-engine","hbs");

db.connect((error)=>{
    if(error){
        console.log("Error connecting to mysql database");
    }
    else{
        console.log("Successfully connected to mysql");
    }
})

//Parse url-encoded bodies as sent by html forms
app.use(express.urlencoded({extended:false}));
//Parse Json bodies 
app.use(express.json());

//define routes
app.use("/",require("./routes/pages.js"));
app.use('/auth',require("./routes/auth.js"));

app.listen(6008,()=>{
    console.log("Server started on PORT 6008");
})
