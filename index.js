require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./routes/user");
const app = express();
const cors= require('cors');




app.use(cors());
app.use(bodyParser.json());
app.use("/user",userRouter);



const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`)
})