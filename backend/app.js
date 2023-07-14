
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");


const ErrorHandler = require("./middleware/error");
const path = require("path");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());
app.use(fileUpload({useTempFiles: true}));
if(process.env.NODE_ENV!=="PRODUCTION"){
    require("dotenv").config({
        
        path:"./config/.env"
    })}

// Route imports
const user = require("./routes/UserRoute");
const table = require("./routes/tableRoute");
const product = require("./routes/ProductRoute");
const { checkKeyService } = require("./middleware/Check");

app.use("/api/v2", user);
app.use("/api/v2",product);
app.use("/api/v2",table);
app.use(express.static(path.join(__dirname,"../frontend/build")));

app.use(ErrorHandler);
module.exports = app