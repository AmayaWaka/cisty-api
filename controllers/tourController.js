const Tour = require("./../models/tourModel");
//Created separate module to handle api features
const APIFeatures = require("./../utils/apiFeatures");
//Alias function
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = "5",
    req.query.sort = "-ratingsAverage, price";
    req.query.fields = "name, price, ratingsAverage, summary, difficulty";
    next();

}
//Introducing classes to make our features more reusable


//Getting tours using promises
exports.getAllTours = async (req, res)=>{
    try{
        
        //Executing query
        const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
         
        const tours = await features.query;
  
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
//Getting tour using promises
exports.getTour = async (req, res) => {
    try{
        const tour = await Tour.findById(req.params.id);
        res
        .status(200)
        .json({
        status: "Success",
        data: {
            tour
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
//Creating tours using async await(Promise)
exports.createTour = async (req, res)=>{

    try{
        const tour = await Tour.create(req.body);

        res.status(201).json({
        status: "Success",
        data: {
            tour
        }
    });

    }catch(err){
        res.status(400).json({
            status: "Fail",
            message: err
        });
    
    }
}         
    //Updating documents using promises
exports.updateTour = async (req, res)=>{

    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {

            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: "Success",
            data: {
                tour
            }
        })

    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });

    }
}

exports.deleteTour = async (req, res)=>{
    try{
         await Tour.findByIdAndDelete(req.params.id);

    res.status(204)
    .json({
        status: "Success",
        data: null
    });

    }catch(err){
        res.status(404).json({
            status: "Failed",
            message: err            
        });
    }    
}
