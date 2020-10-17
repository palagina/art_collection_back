const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 2,
    required: true,
    unique: true
  },
  author: {
    type: String,
    minlength: 2,
    required: true
  },
  url: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  comments: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  },
  likes: Number,
})

postSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Post", postSchema)
