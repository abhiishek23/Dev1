//.env has to be  denined in the folder where we are running node that  is the base folder 
const mongoose = require("mongoose")
const dotenv = require("dotenv");
dotenv.config()
//using the above 2 line we are accessing the .env folder here 
//here i am establishing database connection 
const DBconnection = async () => {
    const MongoUrl = process.env.MONGODB_URL
    try {
        await mongoose.connect(MongoUrl)
        console.log("DB connection esatblished")
    }
    catch (error) {
        console.log("Error while connecting to MongoDB", error)
    }
}
module.exports = { DBconnection }