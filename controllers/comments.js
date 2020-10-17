const commentsRouter = require("express").Router()
const Comment = require("../models/comment")

commentsRouter.get("/", async (request, response, next) => {
  try {
    const comments = await Comment.find({}).populate("user", { username: 1, name: 1 })
    response.json(comments.map(comment => comment.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

commentsRouter.post("/", async (request, response, next) => {
  const comment = new Comment(request.body)
  try {
    const savedComment = await comment.save()
    response.status(201).json(savedComment)

  } catch (exception) {
    next(exception)
  }
})

module.exports = commentsRouter
