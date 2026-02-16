const express = require('express');
const userRouter = require('./routes/userRoutes');
const userAuthRouter = require('./routes/userAuthRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const MongoDBConnect = require('./connection/connection');
const ensureBody = require('./middlewares/parseRequest');

const app = express();
app.use("/uploads", express.static("uploads"));
app.use(cors({
  origin: "http://192.168.100.61:3000",
  credentials: true
}));
app.use(cookieParser());
app.use(ensureBody);

// mongo db connection
MongoDBConnect("mongodb+srv://Wasif_Ali:wasif_cluster0_password@wasifcluster.qd6bhlo.mongodb.net/users_management?appName=WasifCluster");
// response for home screen ===============
app.get("/", async (req, res) => {
    return res.send("hello! You're at a home page");
});

app.use("/api/users",userRouter);
app.use("/auth", userAuthRouter)


module.exports = app