const Tour = require("./../models/tourModel");



//Getting tours using promises
exports.getAllTours = async (req, res)=>{

    try{
        const tours = await Tour.find();
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

    }catch(err){
        res
        .status(400)
        .json({
            status:"Not Found",
            message: "Could not find the requested data"
        });
    }
    
    }

exports.getTour = (req, res) => {
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
        status: "Success"
       
    });

}
//Creating tours using async await(Promise)
exports.createTour = async (req, res)=>{

    try{
        const newTour = await Tour.create(req.body);

        res.status(201).json({
        status: "Success",
        data: {
            tour: newTour
        }
    });

    }catch(err){
        res.status(400).json({
            status: "Fail",
            message: "Invalid data sent"
        });
    
    }
}         
    
exports.updateTour = (req, res)=>{
    res.status(200)
    .json({
        status: "Success",
        // data:{
        //     tour: '<Updated tour here>'
        // }
    });
}

exports.deleteTour = (req, res)=>{
    res.status(204)
    .json({
        status: "Success",
        data: null
    });
}