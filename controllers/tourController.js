const Tour = require("./../models/tourModel");
//Alias function
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = "5",
    req.query.sort = "-ratingsAverage, price";
    req.query.fields = "name, price, ratingsAverage, summary, difficulty";
    next();

}
//Introducing classes to make our features more reusable
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter(){
        //Build query
        //1a) FilteringString
        const queryObj = {...this.queryString};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        //looping through the excluded fields  to delete from req.query value

        excludedFields.forEach(el => delete queryObj[el]);
        //1b)Advanced filtering 
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>`$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
       
        // let query = Tour.find(JSON.parse(queryStr));
        return this;
        
    }
    sort(){
        //2)Result sorting
        //Sorting by price and rating
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);           
        //Sorting by time created by deault
        }else{
            
            this.query = this.query.sort('-createdAt');
        }
        return this;
        
    }
    limitFields(){
        if(this.queryString.fields){
            //Removing commas and replacing with space to be used in the select method 
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);

 
        }else{
            //Removes database version from response
            this.query = this.query.select('-__v')
        }
        return this;
    }
    paginate(){
        //Pagination
        //Converts page query to a number seats the default valu if not specified
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        //Setting the skip value formulae
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;       
    }
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
