const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String    },
    email: {
        type: String,
        unique: true
    },
    profession: {
        type: String
    },
    password: {
        type: String
    },
    image: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
