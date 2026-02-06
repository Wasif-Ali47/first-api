const express = require('express')
const mongoose = require('mongoose')

// mongo db connection

mongoose.connect("mongodb+srv://Wasif_Ali:wasif_cluster0_password@wasifcluster.qd6bhlo.mongodb.net/First_API?appName=WasifCluster")
// mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo connected "))
    .catch(err => console.log("Mongo connection failed ", err))

const app = express();

// middleware
app.use(express.json());

// schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profession: {
        type: String,
        required: true
    },
}, { timestamps: true });

const User = mongoose.model("user", userSchema);

// custom middleware
app.use((req, res, next) => {
    console.log("Middleware here");
    next();
})

// get users
app.get("/api/users", async (req, res) => {
    var users = await User.find({});
    return res.json(users)
})

// add new user
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

    // get user by id
    .get(async (req, res) => {
        const user = await User.findById(req.params.id);
        return res.json(user)
    })

    // update user by id
    .put(async (req, res) => {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, overwrite: true, runValidators: true }
        );

        if (!user) return res.status(404).json({ message: "user not found" });
        res.json({ message: "user updated"});
    })

    // delete user by id
    .delete(async (req, res) => {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "user not found" });
        res.json({ message: "user deleted" });
    });
