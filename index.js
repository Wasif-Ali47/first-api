const express = require('express')
const mongoose = require('mongoose')

// mongo db connection

mongoose.connect(process.env.MONGO_URI)
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

// run the server on loacalhost
// app.listen(8000, () => console.log("server started"))
module.exports = app;






























//     // custom middleware
// app.use((req, res, next) => {
//     console.log("Middleware here");
//     next();
// })

// // get users
// app.get("/api/users", (req, res) => {
//     return res.json(users)
// })

// // add new user
// app.post("/api/users", async (req, res) => {
//     const body = req.body;
//     if (!body) {
//         return res.status(400).json({ message: "please fill all fields" })
//     } else if (!body.name) {
//         return res.status(400).json({ message: "Name is missing" })
//     } else if (!body.email) {
//         return res.status(400).json({ message: "Email is missing" })
//     } else if (!body.profession) {
//         return res.status(400).json({ message: "Profession is missing" })
//     } else {
//         users.push({ id: users.length + 1, ...body });
//         fs.writeFile("./dummyUsers.json", JSON.stringify(users), (err, data) => {
//             return res.status(201).json({ message: "user added" });
//         })
//     }

// });


// app.route("/api/users/:id")

//     // get user by id
//     .get((req, res) => {
//         const id = Number(req.params.id);
//         const user = users.find(user => user.id == id)
//         return res.json(user)
//     })

//     // delete user by id
//     .delete((req, res) => {
//         const id = Number(req.params.id);
//         const newUsers = users.filter(user => user.id !== id);
//         if (newUsers.length == users.length) {
//             return res.json({ message: "user not found" })
//         }
//         users = newUsers;
//         fs.writeFile(
//             "./dummyUsers.json",
//             JSON.stringify(users, null, 2),
//             (err) => {
//                 if (err) return res.json({ message: "failed to delete user" });
//                 return res.json({ message: "user deleted" })
//             });
//     })

//     // edit user by id ==
//     .patch((req, res) => {
//         const id = Number(req.params.id);
//         const body = req.body;

//         const userIndex = users.findIndex(u => u.id === id);
//         if (userIndex === -1) {
//             return res.json({ message: "user not found" });
//         }

//         users[userIndex] = {
//             ...users[userIndex],
//             ...body
//         };

//         fs.writeFile(
//             "./dummyUsers.json",
//             JSON.stringify(users, null, 2),
//             () => { }
//         );

//         return res.json({ message: "user updated successfully" });
//     });
