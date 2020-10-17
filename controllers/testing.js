const testingRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  await User.deleteMany({})
  await Post.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter