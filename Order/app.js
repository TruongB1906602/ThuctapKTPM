
const express = require("express");
const app = express()
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());
app.use(fileUpload({useTempFiles: true, limit: '500mb'}));

if(process.env.NODE_ENV!=="PRODUCTION"){
    require("dotenv").config({
        
        path:"./config/.env"
    })}

// Route imports
const order = require("./routes/orderRoutes");
const { checkKeyService } = require("./middleware/Check");
app.use("/api/v3",checkKeyService,order);

module.exports = app