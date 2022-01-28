const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"bank"
})

exports.withdraw = (req,res)=>{
    const {account_no,withdraw} = req.body;
    db.query('SELECT * FROM accounts where account_id = ?',[account_no],(error,results)=>{
        if(error){
            console.log(error);
            return res.render('withdraw.hbs',{
                msg:'Some error occured! Try again!'
            })
        }
        if(results.length==0){
            return res.render('withdraw.hbs',{
                msg:'Account Does not exist'
            })

        }
        if(results.length==1){
            console.log(typeof(withdraw));
            if(withdraw > results[0].balance){
                return res.render('withdraw.hbs',{
                    msg:'Insufficient balance!'
                })

            }
            
            
            
            
            const final = results[0].balance - parseInt(withdraw);
            console.log("Money withdrawn is "+withdraw);
            
            if(withdraw >=100 && withdraw % 100==0 ){
                db.query('Update accounts set balance = ? where account_id =? ',[final,account_no],(err,ress)=>{
                    if(err){
                        console.log(err);
                        return res.render('withdraw.hbs',{
                            msg:'Some error occured!Try again!'
                        })

                    }
                    if(ress){
                        return res.render('withdraw.hbs',{
                            msg:`${withdraw}Rs Has been successfully withdrawn!Your account balance is now ${final}Rs for account_no ${account_no}`
                        })

                    }
                })
            }else{
                return res.render('withdraw.hbs',{
                    msg:'Money chosen to be withdrawn too less or not in 100s '
                })
            }
        }

    }) 

}

exports.deposit = (req,res)=>{
    const {account_no,deposit} = req.body;
    db.query('SELECT * FROM accounts where account_id = ?',[account_no],(error,results)=>{
        if(error){
            console.log(error);
            return res.render('deposit.hbs',{
                msg:'Some error occured! Try again!'
            })
        }
        if(results.length==0){
            return res.render('deposit.hbs',{
                msg:'Account Does not exist'
            })

        }
        if(results.length==1){
            
            let dep = parseInt(deposit);
            console.log(typeof(dep));
            const final = results[0].balance + dep;
            console.log("Deposit is "+deposit);
            if(deposit >=100 && deposit % 100==0){
                db.query('Update accounts set balance = ? where account_id =? ',[final,account_no],(err,ress)=>{
                    if(err){
                        console.log(err);
                        return res.render('deposit.hbs',{
                            msg:'Some error occured!Try again!'
                        })

                    }
                    if(ress){
                        return res.render('deposit.hbs',{
                            msg:`${deposit}Rs Has been successfully deposited!Your account balance is now ${final}Rs for account_no ${account_no}`
                        })

                    }
                })
            }else{
                return res.render('deposit.hbs',{
                    msg:'Money chosen to be deposited too less or not in 100s '
                })
            }
            
        }

    }) 

}

exports.balance = (req,res)=>{
    const {account_no} = req.body;
    db.query('SELECT * FROM accounts where account_id= ?',[account_no],(error,results)=>{
        if(error){
            console.log(error);
            return res.render('balance.hbs',{
                msg:'Some error occured! Try again!'
            })
        }
        if(results.length==0){
            return res.render('balance.hbs',{
                msg:'Account Does not exist'
            })

        }
        if(results.length==1){
            return res.render('balance.hbs',{
                msg:`Your account balance is ${results[0].balance}Rs for account_no ${account_no}`
            })
        }

    }) 
}

exports.pregister = (req,res)=>{
    const listt = [];
    console.log(req.body)
    const{email,type,balance} = req.body;
    console.log(email);
    db.query('SELECT * from users where email = ?',[email],(error,results)=>{
        if(error){
            console.log(error);
            return res.render('pregister.hbs',{
                msg:'Some error occured! Try again!'
            })
        }
        if(results.length==0){
            return res.render('pregister.hbs',{
                msg:'Enter Valid Email!'
            })
            
        }
        
        if(results.length==1){
            const account_no = Math.floor(Math.random()*90000) + 10000;
            console.log('Account no:'+account_no);
            
            
            
            //let account_no = parseInt(a_no);
            db.query("Insert into accounts VALUES(?,?,?,?)",[email,account_no,type,balance],(err,result)=>{
                if(err){
                    console.log(err);
                    return res.render('pregister.hbs',{
                        msg:'Some error occured! Try again!'
                    })
                }
                if(result){
                    return res.render('pregister.hbs',{
                        msg:`Bank Account Creation Successful! Youre account No is ${account_no}`
                        
                    })

                }


            })

        }

    })
    
    

}

exports.login = (req,res)=>{
    //console.log(req.body);
    const{email,password} = req.body;
    //const hashed = await bcrypt.hash(password,8);
    db.query('SELECT * from users where email = ?',[email],async(error,results)=>{
        if(error){
            return res.render('login.hbs',{
                message:'Some error occured! Pls type in credentials again!'
                
            })
        

        }
        if(results.length==0){
            return res.render('login.hbs',{
                message:'User doesnt exist!'
                
            })

        }
        if(results.length==1){
            //console.log(hashed);
            //console.log(results[0].password);
            bcrypt.compare(password, results[0].password, function(err, ress) {
                //console.log(ress);
                if(err){
                    return res.render('login.hbs',{
                        message:'Some error occured! Pls type in credentials again!'
                        
                    })

                }
                if(ress){
                    req.session.userId = results[0].id;
                    req.session.name = results[0].name;
                    //console.log(req.session.name);
                    //console.log(userId);
                    //console.log(req.session.userId);
                    return res.render('profile.hbs',{
                        user_name:req.session.name
                    })
                }
                else{
                    return res.render('login.hbs',{
                        message:'Invalid Password!!'
                        
                    })

                }

            });
        }
    })
    
}


exports.register = (req,res)=>{
    
    //console.log(req.body);

    const {name,email,password,confirmpassword} = req.body;

    db.query('SELECT * from users where email = ?',[email],async(error,results)=>{
        //console.log(results[0].id);
        if(error){
            console.log(error);
            return res.render('register.hbs',{
                message:'An error has occurred!Please try again!'
            })
        }
        if(results.length > 0){
            return res.render('register.hbs',{
                message:'This email has already been registered!'
            })
        }
        else if(password !== confirmpassword){
            return res.render('register.hbs',{
                message:'Passwords do not match!'
            })

        }
        let hashedPassword = await bcrypt.hash(password,8);
        console.log(hashedPassword);

        db.query("Insert into users SET ?",{name:name,email:email,password:hashedPassword},(error,results)=>{
            if(error){
                console.log(error);
                return res.render('register.hbs',{
                    message:'An error has occurred!Please try again!'
                })
                
            }
            else{
                
                return res.render('register.hbs',{
                    smessage:'User Successfully Registered!You can Login now!'
                })
            }

        })
    })

    
}
