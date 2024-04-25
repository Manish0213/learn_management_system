const express = require("express");
const app = express();

const userRoute = require("./routes/User");
const profileRoute = require("./routes/Profile");
const paymentRoute = require("./routes/Payment");
const courseRoute = require("./routes/Course");
const contactRoute = require("./routes/Contact")

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 3000;

//database connect
database.connect();

//middleWares
app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        origin:"*",
        credentials:true,
    })
)

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp",
})
)

//cloudinary connect
cloudinaryConnect();

//api route mount
app.use("/api/v1/StudyNotion/auth",userRoute);
app.use("/api/v1/StudyNotion/profile",profileRoute);
app.use("/api/v1/StudyNotion/course",courseRoute);
app.use("/api/v1/StudyNotion/payment",paymentRoute);
app.use("/api/v1/StudyNotion/reach", contactRoute)

//default route
app.get("/", (req,res) => {
    return res.json({
        success:true,
        message:'Your server is up and running....',
    });
});

//Start server
app.listen(PORT, () => {
    console.log(`App is running on PORT: ${PORT}`)
})