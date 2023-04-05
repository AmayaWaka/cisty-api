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
exports.getTourStats = async (req, res) => {
    try{
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte:4.5 } }
            },
            { 
                $group: {
                    _id: "$difficulty",
                    numTours: { $sum: 1 },
                    numRatings: { $sum: "$ratingsQuantity" },
                    avgRating: { $avg: "$ratingsAverage" },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" }
                }
             },
             {
                $sort: { avgPrice: 1 }
             }
        ]);
        res.status(200)
        .json({
            status: "Success",
            data: {
                stats
            }
        });        
    }catch(err){
        res.status(404).json({
            status: "Failed",
            message: err            
        });       
    }
};

exports.getMonthlyPlan = async (req, res) => {
    try{
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            //Using start dates to group our documents
            {
                $unwind: "$startDates"
            },
            {
                //Filtering documents to select only from the requested parameters
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$startDates" },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: "$name" }
                }
            },
            {
                $addFields: {month: "$_id"}
            },
            {
                $project: {
                    _id: 0
                }

            },
            {
                $sort: { numTourStarts: -1 }
            },
            {
                $limit: 12
            }

        ]);
        // console.log(plan);
        res.status(200).json({
            status: "Success",
            data: {
                plan
            }           
        }); 
    }catch(err){
        res.status(404)
        .json({
            status: "Failed",
            message: err
        });
    }
}