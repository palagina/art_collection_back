const config = require("./utils/config")
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const cors = require("cors")
const postsRouter = require("./controllers/posts")
const commentsRouter = require("./controllers/comments")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const { tokenExtractor, requestLogger, errorHandler, unknownEndpoint } = require("./utils/middleware")
const mongoose = require("mongoose")
const logger = require("./utils/logger")

logger.info("connecting to", config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    logger.info("connected to MongoDB")
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message)
  })

app.use(cors())
app.use(express.static("build"))
app.use(bodyParser.json())
app.use(requestLogger)
app.use(tokenExtractor)

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "test") {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
  console.log("testing");
}

app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)
app.use("/api/posts", postsRouter)
app.use("/api/posts/:id/comments", commentsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app