const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express=require("express");
const {chats}=require("./data/data");
const dotenv=require("dotenv");
const connectDB=require("./config/db");
const userRoutes=require("./routes/userRoutes")
const chatRoutes=require("./routes/chatRoutes")
const messageRoutes=require("./routes/messageRoutes")
const {notFound,errorHandler}=require("./middleware/errorMiddleware")

dotenv.config();

connectDB();
const app=express();

app.use(express.json()); //to accept JSON Data

app.get('/',(req,res)=>{
    res.send("API is Running Successfully");
});

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

app.use(notFound)
app.use(errorHandler)

const PORT=process.env.PORT || 5000

app.listen(PORT,console.log(`Server Started on PORT ${PORT}`));