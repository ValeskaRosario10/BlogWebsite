import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app=express()
const port =3000;
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(express.json());

const db=new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "blogWebsite",
    password: "Leandra",
    port: 5432,
})
db.connect();

app.get('/', async (req, res) => {
    const result = await db.query("select * from blogs"); // Replace with your DB fetching logic
    console.log(result)
    const blogs=result.rows
    console.log(blogs)
    res.render('home.ejs', { blogs });
  });
  
// app.get("/",(req,res)=>{
//     res.render("home.ejs")
// })
app.get("/login",(req,res)=>{
    res.render("login.ejs")
})
app.get("/register",(req,res)=>{
    res.render("register.ejs")
})
app.post("/login",async(req,res)=>{
    const username=req.body.username
    const password=req.body.password
console.log(username,password)
    try{
        const result = await db.query("select password from users where username = $1",[username])
        console.log(result)
        
{        const dbpassword=result.rows[0].password
        console.log(dbpassword)
       
        if (dbpassword==password){
            res.send("U can use the page")
        }
        else{
            res.render("retry to login ")
            // console.log()
        }
    }
}
    catch(err){
        console.log(err)
        res.render("error at the start of login ")
    }
})
app.post("/register",async(req,res)=>{
    const username=req.body.username
    const interest=req.body.interest
    const password=req.body.password
    console.log(username,interest,password)
    const checkResult =await db.query("select * from users where username=$1",[username]);
    if (checkResult.rows.length>0){
        res.send("User already exist ")
        // window.alert("❌ Choose another username!");
    }
    else {
       try{
        await db.query("Insert into users (username,interest,password) values ($1,$2,$3)",[username,interest,password])
        console.log("User added ")
        res.send("✅ Success! your have succesfully registeded  " + username)
        // window.alert("✅ Success! your have succesfully registeded  " + username);

       } 
        catch(err){
            console.log("could not add user")
            console.log(err)
            res.send(" Error: Error in database!")
            // alert("❌ Error: Error in database!");
        }
    }
})


app.listen(port,()=>{
    console.log("server running on port ", port)
})

