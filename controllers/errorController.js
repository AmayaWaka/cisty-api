const AppError = require("./../utils/appError");
//Handling cast error
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}
//Handling development errors
const sendErrorDev = (err, res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
});
};
//Handling production errors
const sendErrorProd = (err, res)=>{
    //Operational, trusted error send message to client
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
    });
    //Programming or other unknown error: Don't leak error details
    }else{
        //Logging the error
        console.error("Error", err);
        //Send generic message

        res.status(500).json({
            status: "error",
            message: "Something went very wrong"
        });
    }
};
module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if(process.env.NODE_ENV === "development"){
        sendErrorDev(err, res);
    }else if(process.env.NODE_ENV === "production"){
        let error = { ...err };
        if(error.name === "CastError") error = handleCastErrorDB(error);
        sendErrorDev(error, res);
    }
}