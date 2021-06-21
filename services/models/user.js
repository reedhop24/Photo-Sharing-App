const mongoose = require('mongoose');

const User = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    posts: {
        type: Array,
        required: true
    },
    followers: {
        type: Array,
        required: true
    },
    following: {
        type: Array,
        require: true
    }
});

module.exports = mongoose.model('Users', User);