const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter username"],
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "please enter email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "please enter valid email address"],
  },
  password: {
    type: String,
    required: [true, "please enter password"],
    minlength: [6, "minlength password length is 6 characters"],
  },
});

// fire a function before doc is saved to db  //? to hash the password
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method for login user //? also to match the hashing password
userSchema.statics.login = async function (username, email, password) {
  const user = await this.findOne({ username });
  if (user) {
    if (user.email === email) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error("incorrect password");
    }
    throw Error("incorrect email");
  }
  throw Error("incorrect username");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
