const express = require("express");
const bodyParser = require("body-parser");
const axios = require('axios');
const multer = require("multer");
const app = express();
const path = require("path");
const sharp = require("sharp");

app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/uploads',express.static(path.join(__dirname,'/uploads')));

var name="";
var isLoggedIn = false;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

app.get("/", function(req,res)
{
    res.render("home");
})

app.get("/login", function(req,res)
{
    res.render("login");
})

app.get("/register", function(req,res)
{
    res.render("register");
})

app.get("/home",function(req,res)
{
    if(!isLoggedIn)
    {
        res.redirect("/");
    }
    res.render("mainPage" , {Uname:name});
})

app.post("/register", async function(req,res)
{
    name = req.body.name;
    const pass = req.body.pass;
    const email = req.body.email;
    var status = await axios.post("http://localhost:4000/register", null,
    {
        params:
        {
            name,
            pass,
            email
        }
    }).then((response)=>
    {
        if(response.data=="success")
        {
            isLoggedIn=true;
            res.redirect("/home")
        }
        else if(response.data=="fail")
        {
            res.redirect("/register")
        }
        else if(response.data=="User Already Added")
        {
            res.redirect("/login");
        }
    }).catch(err=>{
            console.log();
        })
})

app.post("/login", async function(req,res)
{
    const email = req.body.email;
    const pass = req.body.pass;
    var status = await axios.post("http://localhost:4000/login" , null,
    {
        params:
        {
            email,
            pass
        }

    }).then((response)=>
        {
            if(response.data=="User Found")
            {
                isLoggedIn=true;
                res.redirect("/home")
            }
            else if(response.data=="Incorrect password")
            {
                res.redirect("/login")
            }
            else if(response.data=="Email not Registered")
            {
                res.redirect("/register")
            }
        }).catch(err=>
            {
                console.log();
            })
})

app.post('/upload', upload.single('image'), (req, res, next) => {
    try {
        sharp(req.file.path).resize(200, 200).toFile('uploads/' + 'thumbnails-' + req.file.originalname, (err, resizeImage) => {
            if (err) {
                console.log(err);
            } else {
                console.log(resizeImage);
            }
        })
        return res.status(201).json({
            message: 'File uploded successfully'
        });
    } catch (error) {
        console.error(error);
    }
});

app.listen(3000 ,function(req,res)
{
	console.log("Started");
});