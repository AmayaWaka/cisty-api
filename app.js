const fs = require('fs');
const express = require("express");
const morgan = require("morgan");
const app = express();


app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next)=>{
    console.log("Hello from middleware");
    next();
});
app.use((req, res, next)=>{
    req.requestTime = new Date().toISOString();
    next();

});


const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));



//Initializing routes
//Route handlers
const getAllTours = (req, res)=>{
    console.log(req.requestTime);
    res
    .status(200)
    .json({
        status: "Success",
        requestedAt: req.requestTime,
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
        status: "Success",
        data:{
            tour
        }
    })

}

const createTour = (req, res)=>{
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
// User handlers
const getAllUsers = (req, res) => {
    res
    .status(500)
    .json({
        status: "error",
        message: "This route is not yet defined"
    });
}
const createUser = (req, res) => {
    res
    .status(500)
    .json({
        status: "error",
        message: "This route is not yet defined"
    });
}

const getUser = (req, res) => {
    res
    .status(500)
    .json({
        status: "error",
        message: "This route is not yet defined"
    });
}

const updateUser = (req, res) => {
    res
    .status(500)
    .json({
        status: "error",
        message: "This route is not yet defined"
    });
}

const deleteUser = (req, res) => {
    res
    .status(500)
    .json({
        status: "error",
        message: "This route is not yet defined"
    });
}
    //Tours handler



//Routes

const tourRouter = express.Router();
const userRouter = express.Router();

//Mounting our router
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);


tourRouter
.route("/")
.get(getAllTours)
.post(createTour);
tourRouter
.route("/:id")
.get(getTour)
.patch(patchTour)
.delete(deleteTour);


//User routes
//Using express router

;



userRouter
.route("/")
.get(getAllUsers)
.post(createUser);

userRouter
.route("/:id")
.get(getUser)
.patch(updateUser)
.delete(deleteUser);


//Setting up our port response
//Start sever
const port = 3000;

app.listen(port, ()=>{
    console.log(`App running on port ${port}`);
});