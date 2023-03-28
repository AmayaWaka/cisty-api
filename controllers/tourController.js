const Tour = require("./../models/tourModel");

//Getting tours using promises
exports.getAllTours = async (req, res)=>{
    
 
    try{
        //Build query
        //1a) Filtering
        const queryObj = {...req.query};
        excludedFields = ['page', 'sort', 'limit', 'fields'];
        //looping through the excluded fields  to delete from req.query value

        excludedFields.forEach(el => delete queryObj[el]);
        //1b)Advanced filtering 
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>`$${match}`);
       
        let query = Tour.find(JSON.parse(queryStr));
        //2)Result sorting
        //Sorting by price and rating
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);           
        //Sorting by time created by deault
        }else{
            
            query = query.sort('-createdAt');
        }
        //3) Field limiting
        //Selecting specific field : projecting
        if(req.query.fields){
            //Removing commas and replacing with space to be used in the select method 
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields)

        }else{
            //Removes database version from response
            query = query.select('-__v')
        }

 
        //Executing query
        const tours = await query;
  
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