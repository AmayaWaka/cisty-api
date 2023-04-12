const mongoose = require("mongoose");
//Setting up our port response
//Start sever
const dotenv = require("dotenv");

// const DB = process.env.DATABASE_LOCAL;
dotenv.config({ path: "./.env" });

mongoose.connect('mongodb://127.0.0.1:27017/cisty')
.then(() => console.log("Db connected successfully"))
.catch(err => console.log("Error"));


const app = require('./app');
dotenv.config({ path: "./.env" });

// console.log(process.env);
const port = process.env.PORT || 3000
const server = app.listen(port, ()=>{
    console.log(`App running on port ${port}`);
});
//Handling unhandled rejection in asyncronous code
process.on("unhandledRejection", err => {
    console.log(err.name, err.message);
    console.log("UNHANDLED REJECTION! SHUTTING DOWN");
    server.close(() => {
        process.exit(1);
    });
});