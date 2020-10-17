const postsRouter = require("express").Router()
const Post = require("../models/post")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

postsRouter.get("/", async (request, response, next) => {
  try {
    const posts = await Post.find({}).populate("user", { username: 1, name: 1 })
    response.json(posts.map(post => post.toJSON()))
  } catch (exception) {
    next(exception)
  }
})

postsRouter.get("/:id", async (request, response, next) => {
  try {
    const post = await Post.findById(request.params.id)
    if (post) {
      response.json(post.toJSON())
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

const getTokenFrom = request => {
  const authorization = request.get("authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7)
  }
  return null
}

postsRouter.post("/", async (request, response, next) => {
  const post = new Post(request.body)
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" })
    }
    const user = await User.findById(decodedToken.id)
    post.user = user.id

    if (!post.likes) {
      post.likes = 0
    }

    const savedPost = await post.save()
    user.posts = user.posts.concat(savedPost._id)
    await user.save()
    /* response.json(savedPost.toJSON()) */
    response.status(201).json(savedPost)

  } catch (exception) {
    next(exception)
  }
})

postsRouter.delete("/:id", async (request, response, next) => {
  const token = getTokenFrom(request)
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" })
    }
    const user = await User.findById(decodedToken.id)
    const post = await Post.findById(request.params.id)
    if ( post.user.toString() === user._id.toString() ) {
      await Post.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      response.status(403).end()
    }
  } catch (exception) {
    next(exception)
  }
})

postsRouter.put("/:id", async (request, response, next) => {
  const post = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }
  try {
    const match = await Post.findById(request.params.id)
    !post.title ? (post.likes = match.likes) : {}
    !post.author ? (post.author = match.author) : {}
    !post.url ? (post.url = match.url) : {}
    !post.likes ? (post.likes = match.likes) : {}
    const updatedPost = await Post.findByIdAndUpdate(request.params.id, post, {
      new: true
    })
    response.json(updatedPost.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = postsRouter
