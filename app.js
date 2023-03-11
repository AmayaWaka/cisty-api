const fs = require('fs');
const express = require("express");
const app = express();
app.use(express.json());


const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));



//Initializing routes
//Tour routes
const getAllTours = (req, res)=>{
    res
    .status(200)
    .json({
        status: "Success",
        result: tours.length,
        data: {
            tours
        }
    });
    
    }

const getTour = (req, res) => {
    const id = req.params.id * 1;

    //Getting a specific tour from an object in an array
    //Handling an error or wrong input
    if(id > tours.length){
        return res.status(404)
        .json({
            status: "fail",
            message: "Invalid request"
        });
    }
    const tour = tours.find(el => el.id === id);
    res.status(200)
    .json({
        status: "Succes",
        data:{
            tour
        }
    })

}

const postTour = (req, res)=>{
    const newId = tours[tours.length-1].id+1;
    const newTour = Object.assign({id: newId}, req.body);

    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        err=>{
            res.status(201).json({
                status: "Success",
                data: {
                    tour: newTour
                }
            });
        }         
    );
}
const patchTour = (req, res)=>{
    if (req.params.id * 1 > tours.length){
        return res.status(404).json({
            status: "fail",
            message: "Invalid Input"
        });
    }

    res.status(200)
    .json({
        status: "Success",
        data:{
            tour: '<Updated tour here>'
        }
    });
}

const deleteTour = (req, res)=>{
    if (req.params.id * 1 > tours.length){
        return res.status(404).json({
            status: "fail",
            message: "Invalid Input"
        });
    }

    res.status(204)
    .json({
        status: "Success",
        data: null
    });
}







    //Tours handlers

app.get("/api/v1/tours", getAllTours);

app.post("/api/v1/tours", postTour);
//Getting a specific tour using id
app.get("/api/v1/tours/:id", getTour);
//Patching an article
app.patch("/api/v1/tours/:id", patchTour);
//Deleting a tour
app.delete("/api/v1/tours/:id", deleteTour);

//setting up our port response
const port = 3000;

app.listen(port, ()=>{
    console.log(`App running on port ${port}`);
});