const express = require("express")
const cors = require('cors');
const app = express();

require("dotenv").config()
const PORT = process.env.PORT || 3000

app.use(cors());
app.use(express.json());

const scanRoutes = require("./routes/scans")
app.use("/api/scans", scanRoutes);

const connectDB = require("./config/database");
connectDB();

app.get('/', (req,res) => {
    res.json({message : 'Accessibility Analyzer API is running:'});
});

app.listen(PORT , ()=>{
    console.log(`Server running on port ${PORT}`);
})