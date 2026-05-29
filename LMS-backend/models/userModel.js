const mongoose =require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phoneNo: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: Number,
      default: 0,
    },
    answer:{
      type:String,
      required:true
    }
  },
  { timeStamps: true }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
