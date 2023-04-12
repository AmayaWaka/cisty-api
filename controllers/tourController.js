const Tour = require("./../models/tourModel");
//Created separate module to handle api features
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");

//Alias function
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = "5",
    req.query.sort = "-ratingsAverage, price";
    req.query.fields = "name, price, ratingsAverage, summary, difficulty";
    next();
}
//Getting tours using promises
exports.getAllTours = catchAsync(async (req, res, next)=>{
      
        //Executing query
        const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
         
        const tours = await features.query;
  
        res.status(200).json({
            status: "Success",
            requestedAt: req.requestTime,
            result: tours.length,
            data: {
                tours
            }
        });    
    });
//Getting tour using promises
exports.getTour = catchAsync(async (req, res, next) => {   
        const tour = await Tour.findById(req.params.id);
        res
        .status(200)
        .json({
        status: "Success",
        data: {
            tour
        }       
    });          
});
//Catching asynchronous errors

//Creating tours using async await(Promise)
exports.createTour = catchAsync(async (req, res, next)=>{
    const tour = await Tour.create(req.body);
        res.status(201).json({
        status: "Success",
        data: {
            tour
        }
    } );
})         
    //Updating documents using promises
exports.updateTour = catchAsync(async (req, res, next)=>{

    
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {

            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: "Success",
            data: {
                tour
            }
        });    
});

exports.deleteTour = catchAsync(async (req, res, next)=>{
    
         await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: "Success",
        data: null
    });    
});
exports.getTourStats = catchAsync(async (req, res, next) => {
   
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
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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
})