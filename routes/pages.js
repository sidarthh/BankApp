const express = require('express');
const mysql = require("mysql");
const router = express.Router();
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"bank"
})

const redirectlogin = (req,res,next)=>{
    if(!req.session.userId){
        res.redirect('/')
    }else{
        next()
    }
}
router.get('/',(req,res)=>{
    const {userId,name} = req.session;
    res.render("index.hbs");
})

router.get('/register',(req,res)=>{
    res.render("register.hbs");
})

router.get('/profile/register',redirectlogin,(req,res)=>{
    res.render('pregister.hbs');
})

router.get('/profile/balance',redirectlogin,(req,res)=>{
    res.render('balance.hbs');
})
router.get('/profile/withdraw',redirectlogin,(req,res)=>{
    res.render('withdraw.hbs');
})
router.get('/profile/deposit',redirectlogin,(req,res)=>{
    res.render('deposit.hbs');
})

router.get('/login',(req,res)=>{
    res.render("login.hbs");
})

router.get('/profile',redirectlogin,(req,res)=>{
    
    res.render("profile.hbs",{
        user_name:req.session.name
    });
    

    
})

router.get('/logout',redirectlogin,(req,res)=>{
    req.session.destroy(err =>{
        if(err){
            console.log("error occured!");
        }
        res.clearCookie();
        res.redirect('/');
    })
    
})

module.exports = router;
