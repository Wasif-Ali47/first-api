const express = require('express')
const mongoose = require('mongoose')

const app = express();
// middleware
app.use(express.json());

// mongo db connection
let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// connect to mongodb
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send("DB connection failed");
  }
});

// create schema
const User = mongoose.models.user || mongoose.model("user", new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profession: { type: String, required: true }
}, { timestamps: true }));


// custom middleware
app.use((req, res, next) => {
    console.log("Middleware here");
    next();
})

// get users
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find({});
        return res.json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch users" });
    }
});

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
        res.json({ message: "user updated" });
    })

    // delete user by id
    .delete(async (req, res) => {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "user not found" });
        res.json({ message: "user deleted" });
    });

  

module.exports = app;