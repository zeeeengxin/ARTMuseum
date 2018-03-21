var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
   text: String,
   author: {
      id: { // id is a reference to a user model's id
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   }
});

module.exports = mongoose.model("Comment", commentSchema);