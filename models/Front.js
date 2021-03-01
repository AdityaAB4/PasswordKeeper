const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const frontSchema = new Schema({

  username: {
    type: String,
    required: "This field is required.",
  },
  userpassword: {
    type: String,
    required: "This field is required.",
  },
});

const Front = mongoose.model("Front", frontSchema);

module.exports = Front;
