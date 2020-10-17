const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    minlength: 2,
  },
  timestamp: {
    type: String,
    minlength: 10,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
})

commentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Comment", commentSchema)
