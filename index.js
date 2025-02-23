import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app=express()
const port =3000;
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(express.json());
app.use(express.json());
// app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
// app.set('view engine', 'ejs');
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
    // console.log(result)
    const blogs=result.rows
    // console.log(blogs)
    res.render('home.ejs', { blogs, message: "Some blogs on the website" });
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
app.get("/backpg",async(req,res)=>{
    try{
        const result = await db.query("select * from blogs"); // Replace with your DB fetching logic
    // console.log(result)
    const blogs=result.rows
    res.render('myblog.ejs', { blogs })
    }
    catch(err){
        console.log(err)
    }
})
app.post("/login",async(req,res)=>{
    const username=req.body.username
    const password=req.body.password
console.log(username,password)
    try{
        const result = await db.query("select password from users where username = $1",[username])
        // console.log(result)
        if (result.rows.length<=0){
            res.send("Please register ")
        }
        else
{        const dbpassword=result.rows[0].password
        console.log(dbpassword)
       
        if (dbpassword==password){
            const result = await db.query("select * from blogs"); // Replace with your DB fetching logic
    // console.log(result)
            const blogs=result.rows
            res.render('myblog.ejs', { blogs })
         
        }
        else{
            res.send("retry to login ")
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
app.post("/addBlog",async(req,res)=>{
    const title=req.body.title
    const interest=req.body.interest
    const summary=req.body.summary
    const author=req.body.username
    // const img=req.body.img
    const blogcontent=req.body.blogcontent
    const pdate=new Date();
    // const author="Valy"
    console.log(title,interest,summary)
    console.log(blogcontent,pdate,author)
    try{
        const result= await db.query("Insert into blogs (title,blogcontent,author,pdate,interest,summary) values ($1,$2,$3,$4,$5,$6)" ,[title,blogcontent,author,pdate,interest,summary])
     
            return res.json({
                success:true,
                message:"Blog added successfully ! "
            })

        console.log("User added ")
    }
    catch(err){
        console.log("Error came" , err)
        res.status(500).json({
            success:false,
            message:"An error occureed while addeing the blog"
        })
    }
})
app.get("/blog/:id", async(req,res)=>{
    const id=req.params.id;
    console.log(id)
    try{
        const details=await db.query ("select * from blogs where id =$1",[id])
    console.log(details)
    }
    catch(err){
        console.log("Error ",err)
    }
})
app.get('/blogs/domain/:domain', async (req, res) => {
    const domain = req.params.domain.toLowerCase();
    try {
        // Query to fetch blogs by domain
        const data =await db.query( 'SELECT * FROM blogs WHERE interest = $1',[domain]);
        console.log(data)
        const blogs=data.rows
        const message = blogs.length === 0 ? "No blogs found" : "Here's your blog of interest";
        
        res.render('home.ejs', { blogs, message });
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).send('Internal Server Error');
      }
    });
app.get('/readblog/:id', async (req, res) => {
    const blogid = req.params.id;
    console.log(blogid);
    
    try {
        const data = await db.query('SELECT * FROM blogs WHERE id = $1', [blogid]);
        const blog = data.rows[0];
        
        if (!blog) {
            return res.status(404).render('404.ejs', { message: 'Blog not found' });
        }
    
        res.render("blogPage.ejs", { blog });
    } catch (err) {
        console.error('Error fetching blog:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port,()=>{
    console.log("server running on port ", port)
})

