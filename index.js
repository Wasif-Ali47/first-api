const express = require('express')
const userRouter = require('./routes/user')
const userAuthRouter = require('./routes/userAuthRoutes')
const cors = require('cors')
const MongoDBConnect = require('./connection/connection');
const ensureBody = require('./middlewares/parseRequest');

const app = express();
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(ensureBody);

// mongo db connection
MongoDBConnect("mongodb+srv://Wasif_Ali:wasif_cluster0_password@wasifcluster.qd6bhlo.mongodb.net/users_management?appName=WasifCluster");
// response for home screen ===============
app.get("/", async (req, res) => {
    return res.send("hello! You're at a home page");
});

app.use("/api/users", userRouter);
app.use("/auth", userAuthRouter)


app.listen(8000, () => {
    console.log("Server is running on port 8000");
})


module.exports = app