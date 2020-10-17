const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const helper = require("./test_helper")
const Post = require("../models/post")
const User = require("../models/user")

describe("when there is initially some posts saved", () => {
  beforeEach(async () => {
    await Post.deleteMany({})
    const postObjects = helper.initialPosts.map(post => new Post(post))
    const promiseArray = postObjects.map(post => post.save())
    await Promise.all(promiseArray)
  })
  test("posts are returned as json", async () => {
    await api
      .get("/api/posts")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("all posts are returned", async () => {
    const response = await api.get("/api/posts")
    expect(response.body.length).toBe(helper.initialPosts.length)
  })

  test("there are four posts", async () => {
    const response = await api.get("/api/posts")
    expect(response.body.length).toBe(helper.initialPosts.length)
  })

  test("the first post is called React patterns", async () => {
    const response = await api.get("/api/posts")
    const contents = response.body.map(r => r.title)
    expect(contents).toContain("React patterns")
  })
})

describe("viewing a specific post", () => {
  test("succeeds with a valid id", async () => {
    const postsAtStart = await helper.postsInDb()
    const postToView = postsAtStart[0]
    const resultPost = await api
      .get(`/api/posts/${postToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
    expect(resultPost.body).toEqual(postToView)
  })

  test("fails with statuscode 404 if post does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId()
    console.log(validNonexistingId)
    await api.get(`/api/posts/${validNonexistingId}`).expect(404)
  })

  test("fails with statuscode 400 id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445"
    await api.get(`/api/posts/${invalidId}`).expect(400)
  })

  test("unique identifier is called id", async () => {
    const response = await api.get("/api/posts")
    expect(response.body[0].id).toBeDefined()
  })
})

describe("adding a new post", () => {
  test("a valid post can be added", async () => {
    const newPost = {
      title: "New post test",
      author: "New post",
      url: "newurlurlurl",
      likes: 0
    }
    await api
      .post("/api/posts")
      .send(newPost)
      .expect(200)
      .expect("Content-Type", /application\/json/)
    const response = await api.get("/api/posts")
    const contents = await response.body.map(r => r.title)
    expect(response.body.length).toBe(helper.initialPosts.length + 1)
    expect(contents).toContain("New post test")
  })

  test("fails with status code 400 if data invaild", async () => {
    const newPost = {
      likes: 100
    }
    await api
      .post("/api/posts")
      .send(newPost)
      .expect(400)
    const postsAtEnd = await helper.postsInDb()
    expect(postsAtEnd.length).toBe(helper.initialPosts.length)
  })

  test("likes equal to 0 by default", async () => {
    const newPost = {
      title: "New post",
      author: "New post author",
      url: "new url"
    }
    await api
      .post("/api/posts")
      .send(newPost)
      .expect(200)
      .expect("Content-Type", /application\/json/)
    const postsAtEnd = await helper.postsInDb()
    const lastPost = postsAtEnd[postsAtEnd.length - 1]
    expect(lastPost.likes).toBe(0)
  })
})

describe("deleting a post", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const postsAtStart = await helper.postsInDb()
    const postToDelete = postsAtStart[0]
    await api.delete(`/api/posts/${postToDelete.id}`).expect(204)
    const postsAtEnd = await helper.postsInDb()
    expect(postsAtEnd.length).toBe(helper.initialPosts.length - 1)
    const contents = postsAtEnd.map(r => r.title)
    expect(contents).not.toContain(postToDelete.title)
  })
})

describe("updating a post", () => {
  test("updates the likes for selected post", async () => {
    const postsAtStart = await helper.postsInDb()
    const postToUpdate = postsAtStart[0]
    const updatedPost = {
      title: postToUpdate.title,
      likes: 88
    }
    await api
      .put(`/api/posts/${postToUpdate.id}`)
      .send(updatedPost)
      .expect(200)
    const postsAtEnd = await helper.postsInDb()
    expect(postsAtEnd[0].likes).toBe(88)
  })

  test("if no new author entered, old author stays", async () => {
    const postsAtStart = await helper.postsInDb()
    const postToUpdate = postsAtStart[0]
    const updatedPost = { title: postToUpdate.title, likes: 8, url: "newurl" }
    await api
      .put(`/api/posts/${postToUpdate.id}`)
      .send(updatedPost)
      .expect(200)
      .expect("Content-Type", /application\/json/)
    const postsAtEnd = await helper.postsInDb()
    expect(postsAtEnd[0].author).toBe(postToUpdate.author)
  })
})

describe("when there is initially one user at db", () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: "root", password: "sekret" })
    await user.save()
  })

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen"
    }
    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen"
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("`username` to be unique")

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

/*   test("creation fails if the username is too short", async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: "r",
      name: "Superuser",
      passwordHash: "salainen"
    }
    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  }) */
})

afterAll(() => {
  mongoose.connection.close()
})
