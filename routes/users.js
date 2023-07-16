const { User, validate } = require("../models/user");
const bcrypt = require('bcrypt');
const router = require("express").Router();
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    console.log("body", req.body);
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with givern email already exists!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await new User({
      ...req.body,
      password: hashPassword,
    }).save();
    res
      .status(200)
      .send({ message: "User Signed up successfully", user: newUser });
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
