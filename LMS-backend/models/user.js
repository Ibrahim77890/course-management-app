const { default: mongoose } = require("mongoose");
const jwt = require('jsonwebtoken');
const course = require("./course");

const userSchema = mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        contact: {
            type: String,
        },
        role: {
            type: String,
            required: true
        },
        coursesEnrolled: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }],
        authToken: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

userSchema.methods.generateAuthToken = function(time) {
    const payload = {
    _id: this._id,
    username: this.username,
    email: this.email,
    password: this.password,
    role: this.role
    };

    const secretKey = process.env.SECRET_KEY;

    const options = {
        expiresIn: time,
    };

    const authToken = jwt.sign(payload, secretKey, options);
    return authToken;
}


const Users = mongoose.model('User', userSchema);
module.exports = Users;