const User = require("../model/User");
const jwt = require("jsonwebtoken");
//? error handling during signup and signin
const handleErrors = (err) => {
  //console.log(err.message, err.code, "code");
  let errors = {
    username: "",
    email: "",
    password: "",
  };

  //? signin page errors
  if (err.message === "incorrect username") {
    errors.username = "that username is not registered";
  }
  if (err.message === "incorrect email") {
    errors.username = "username and email donot match";
    errors.email = "username and email donot match";
  }
  if (err.message === "incorrect password") {
    errors.password = "that password is not correct";
  }

  // duplicate error code //? signup page errors
  if (err.code === 11000) {
    errors.email = "that email is already taken";
    return errors;
  }
  // signup validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

//? jwt
const maxAge = 3 * 24 * 60 * 60; //? 3 days

const createToken = (id) => {
  return jwt.sign({ id }, "anish-dai-secret", { expiresIn: maxAge });
};

//? signup post
module.exports.signup_post = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ created: "created", user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors });
  }
};

//? signin post
module.exports.login_post = async (req, res) => {
  const { username, email, password } = req.body;

  // checking if inputs has length or not
  if (!username.length && !email.length && !password.length) {
    res.json({
      errors: {
        username: "please enter username",
        email: "please enter email",
        password: "please enter password",
      },
    });
    return;
  } else if (username.length && !email.length && !password.length) {
    res.json({
      errors: {
        email: "please enter email",
        password: "please enter password",
      },
    });
    return;
  } else if (username.length && email.length && !password.length) {
    res.json({
      errors: {
        password: "please enter password",
      },
    });
    return;
  } else if (!username.length && email.length && !password.length) {
    res.json({
      errors: {
        username: "please enter username",
        password: "please enter password",
      },
    });
    return;
  } else if (!username.length && email.length && password.length) {
    res.json({
      errors: {
        username: "please enter username",
      },
    });
    return;
  } else if (username.length && !email.length && password.length) {
    res.json({
      errors: {
        email: "please enter email",
      },
    });
    return;
  } else if (!username.length && !email.length && password.length) {
    res.json({
      errors: {
        username: "please enter username",
        email: "please enter email",
      },
    });
    return;
  }

  try {
    const user = await User.login(username, email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: "ok" });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors });
  }
};

module.exports.dashboard_get = (req, res) => {
  res.json({ user: res.locals.user });
};

module.exports.logout_post = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.json({ loggedOut: true });
};
