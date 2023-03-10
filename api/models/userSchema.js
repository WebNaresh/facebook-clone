const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: isEmail } = require("validator/lib/isemail");
const User = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Please Enter Your name"],
      maxLength: [30, "name cannot exceed 30 characters"],
      minLength: [4, "name should have more than 4 characters"],
      unique: true,
    },
    userEmail: {
      type: String,
      required: [true, "Please Enter E-mail"],
      validate: [isEmail, "Please fill a valid email address"],
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      // required: [true, "Please Enter Password"],
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationShip: {
      type: Number,
      enum: [1, 2, 3],
    },
  },
  { timestamps: true }
);

User.pre("save", async function (next) {
  console.log(!this.isModified("password"));
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
User.methods.getJWTToken = function () {
  return jwt.sign({ user: this }, process.env.jWT_SECRETE, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", User);
