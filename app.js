const fs = require('fs');
const express = require("express");
const app = express();

const port = 3000;
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/tours-simple.json`));





app.get("/api/v1/cisty", (req, res)=>{
res
.status(200)
.json({ message: 'Hello from the server side', app: "Cisty-api" });

});

app.listen(port, ()=>{
    console.log(`App running on port ${port}`);
});