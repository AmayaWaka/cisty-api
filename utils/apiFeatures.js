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
    module.exports = APIFeatures;