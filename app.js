const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();
if(process.env.NODE_ENV === "production"){
    app.use(morgan('prod'));
   
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));


app.use((req, res, next)=>{
    req.requestTime = new Date().toISOString();

    next();

});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);


//Handling all the verbs
app.all("*", (req, res, next)=>{

    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.status = "fail";
    // err.statusCode = 404;
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;