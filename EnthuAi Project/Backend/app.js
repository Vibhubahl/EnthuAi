const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.connect("mongodb://localhost:27017/enthuAi" , { useUnifiedTopology: true, useNewUrlParser: true});

const userSchema = mongoose.Schema({
    email:String,
    name:String,
    password:String,
})

const User = mongoose.model("User",userSchema);

var email;
var name;
var pass;

app.post("/register", function(req,res)
{
    email=req.query.email;
    User.findOne({email:email}, function(err,found)
    {
        if(!found)
        {
            const user = new User({
                email:req.query.email,
                name:req.query.name,
                password:req.query.pass
            })
            user.save(function(err)
            {
                if(err)
                {
                    res.send("fail")
                }
                else
                {
                    res.send("success")
                }
            })
        }
        else
        {
            res.send("User Already Added")
        }
    })
})

app.post("/login", function(req,res)
{
    var Email=req.query.email;
    var pass=req.query.pass;
    User.findOne({email:Email}, function(err,found)
    {
        if(!err)
        {
            if(found)
            {
                if(found.password==pass)
                {
                    res.send("User Found")
                }
                else
                {
                    res.send("Incorrect password");
                }
            }
            else
            {
                res.send("Email not Registered")
            }
        }
    })
})

app.listen(4000 ,function(req,res)
{
	console.log("Started");
});
