const mongoose = require("mongoose");
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    
    fullname: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    role: {
        type: String,
        required: true,
        enum: ['student', 'faculty', 'admin']
    },
    idno: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    }
});

userSchema.virtual('confirmPassword')
    .get(function () {
        return this._confirmPassword;
    })
    .set(function (value) {
        this._confirmPassword = value;
    });

userSchema.pre('save', async function(next){
    const user = this;

    if (user.isModified('password') && user.password !== user._confirmPassword) {
        return next(new Error('Passwords do not match'));
    }

    if(!user.isModified('password'))
    {
        next();
    }

    try{
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.password, salt);
        user.password = hashPassword;
    }
    catch(error){
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);