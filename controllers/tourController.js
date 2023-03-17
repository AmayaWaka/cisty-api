const Tour = require("./../models/tourModel");




exports.getAllTours = (req, res)=>{
    console.log(req.requestTime);
    res
    .status(200)
    .json({
        status: "Success",
        requestedAt: req.requestTime,
        // result: tours.length,
        // data: {
        //     tours
        // }
    });
    
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
//Creating tours using async await
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