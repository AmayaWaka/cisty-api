const mongoose = require("mongoose");
//Setting up our port response
//Start sever
const dotenv = require("dotenv");

// const DB = process.env.DATABASE_LOCAL;
dotenv.config({ path: "./.env" });


mongoose.connect('mongodb://127.0.0.1:27017/cisty').then(()=>{
    console.log("DB Connected successfully");
});



const app = require('./app');
dotenv.config({ path: "./.env" });


// console.log(process.env);
const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log(`App running on port ${port}`);
});

