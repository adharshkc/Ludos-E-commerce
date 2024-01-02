const mongoose = require('mongoose')

const adminSchema = mongoose.Schema({
    email: {
        type: String,
        minLength:[7, "email must contain minimum 7 characters"]
    }
})