const express = require('express')
const User = require('./model/usersModel')
const cors = require('cors')
const MongoDBConnect = require('./connection/connection');

const app = express();
app.use(express.json());
app.use(cors());

// mongo db connection
MongoDBConnect("mongodb+srv://Wasif_Ali:wasif_cluster0_password@wasifcluster.qd6bhlo.mongodb.net/users_management?appName=WasifCluster");
// response for home screen ===============
app.get("/", async (req, res) => {
    return res.send("hello! You're at a home page");
});

// get users =================
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find();
        console.log("users:", users)
        return res.json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch users" });
    }
});

// add new user =================
app.post("/api/users", async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({ message: "please fill all fields" })
    } else if (!body.name) {
        return res.status(400).json({ message: "Name is missing" })
    } else if (!body.email) {
        return res.status(400).json({ message: "Email is missing" })
    } else if (!body.profession) {
        return res.status(400).json({ message: "Profession is missing" })
    } else {
        const result = await User.create({
            name: body.name,
            email: body.email,
            profession: body.profession,
        });

        console.log("result:", result)
        return res.status(201).json({
            message: "user created"
        })
    }

});


app.route("/api/users/:id")

    // get user by id =================
    .get(async (req, res) => {
        const user = await User.findById(req.params.id);
        return res.json(user)
    })

    // update user by id =================
    .put(async (req, res) => {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, overwrite: true, runValidators: true }
        );

        if (!user) return res.status(404).json({ message: "user not found" });
        res.json({ message: "user updated" });
    })

    // delete user by id =================
    .delete(async (req, res) => {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "user not found" });
        res.json({ message: "user deleted" });
    });

  

module.exports = app;