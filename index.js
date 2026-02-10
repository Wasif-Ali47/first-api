const express = require('express')
const userRouter = require('./routes/user')
const userAuthRouter = require('./routes/userAuthRoutes')
const cors = require('cors')
const MongoDBConnect = require('./connection/connection');
const { logReqRes } = require('./middlewares');

const app = express();
app.use(express.json());
app.use(cors());

// mongo db connection
MongoDBConnect("mongodb+srv://Wasif_Ali:wasif_cluster0_password@wasifcluster.qd6bhlo.mongodb.net/users_management?appName=WasifCluster");
// response for home screen ===============
app.get("/", async (req, res) => {
    return res.send("hello! You're at a home page");
});


app.use("/api/users", userRouter);
app.use("/auth", userAuthRouter)


module.exports = app;