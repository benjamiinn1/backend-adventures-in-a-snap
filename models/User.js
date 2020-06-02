const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  firstName: String,
  lastName: String,
  email: String,
  instructor: Boolean,
});

mongoose.model("users", userSchema);
