const mongoose = require("mongoose")

require("dotenv").config();

const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URL , {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    })
    .then(console.log("MongoDB Connected"))
    .catch((error) => {
        console.log('Database connection failed: ', error.message);
        process.exit(1);
    })
}

module.exports = connectDB;