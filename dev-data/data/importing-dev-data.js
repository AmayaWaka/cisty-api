const fs = require("fs");
const mongoose = require("mongoose");
//Setting up our port response
//Start sever
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");

// const DB = process.env.DATABASE_LOCAL;
dotenv.config({ path: "./.env" });


mongoose.connect('mongodb://127.0.0.1:27017/cisty').then(()=>{
    console.log("DB Connected successfully");
});
//Reading file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"));

const importData = async ()=>{
    try{
        await Tour.create(tours);
        console.log("Data successfully loaded");

    }catch(err){
        console.log(err);

    }
}
//Deleting collection
const deleteData = async ()=>{
    try{
        await Tour.deleteMany();
        console.log("Data deleted");

    }catch(err){
        console.log(err);

    }

}

if (process.argv[2] === '--import'){
    importData();
}else if (process.argv[2] === '--delete'){
    deleteData();
}
