const mongoose = require("mongoose");
const { Schema } = mongoose;

const adventureSchema = new Schema({
  name: String,
  description: String,
  instructor: {
    id: Schema.Types.ObjectId,
    lastName: String,
    firstName: String,
  },
});

mongoose.model("Adventures", adventureSchema);
