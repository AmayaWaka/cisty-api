const fs = require('fs');
const express = require("express");
const app = express();

const port = 3000;
const audio = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));



//Initializing routes
//Getting tours

app.get("/api/v1/audio", (req, res)=>{
res
.status(200)
.json({
    status: "Success",
    result: audio.length,

    data: {
        audio

    }

});

});

//setting up our port response

app.listen(port, ()=>{
    console.log(`App running on port ${port}`);
});