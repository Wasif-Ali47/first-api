const express = require('express')
const fs = require('fs')
var users = require("./dummyUsers.json")

const app = express();

// middleware
app.use(express.json());

// run the server on loacalhost
app.listen(8000, () => console.log("server started"))

// get users
app.get("/api/users", (req, res) => {
    return res.json(users)
})

// add new user
app.post("/api/users", (req, res) => {
    const body = req.body;
    users.push({ id: users.length + 1, ...body });
    fs.writeFile("./dummyUsers.json", JSON.stringify(users), (err, data) => {
        return res.json({ message: "user added" });
    })
});


app.route("/api/users/:id")

    // get user by id
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find(user => user.id == id)
        return res.json(user)
    })

    // delete user by id
    .delete((req, res) => {
        const id = Number(req.params.id);
        const newUsers = users.filter(user => user.id !== id);
        if (newUsers.length == users.length) {
            return res.json({ message: "user not found" })
        }
        users = newUsers;
        fs.writeFile(
            "./dummyUsers.json",
            JSON.stringify(users, null, 2),
            (err) => {
                if (err) return res.json({ message: "failed to delete user" });
                return res.json({ message: "user deleted" })
            });
    })

    // edit user by id
    .patch((req, res) => {
        const id = Number(req.params.id);
        const body = req.body;

        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            return res.json({ message: "user not found" });
        }

        users[userIndex] = {
            ...users[userIndex],
            ...body
        };

        fs.writeFile(
            "./dummyUsers.json",
            JSON.stringify(users, null, 2),
            () => { }
        );

        return res.json({ message: "user updated successfully" });
    });







