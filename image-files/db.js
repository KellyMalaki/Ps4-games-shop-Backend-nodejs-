const mongoose = require("mongoose");

module.exports = async function connection(){
    try{
        mongoose.connect(process.env.DB);
        console.log("Connected to Database. We are good");
    } catch(error){
        console.log(error);
        console.log("Could not connect to the database. Still has an error");
    }
};