const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

const app = require("./app");

mongoose.connect(process.env.MONGO_URI, {
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: true,
    serverSelectionTimeoutMS: 5000,
})
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log('MongoDB connection error:', err);
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));