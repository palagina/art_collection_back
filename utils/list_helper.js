const lodash = require("lodash")

const dummy = posts => {
  posts = 1
  return posts
}

const totalLikes = posts => {
  let likes = []
  posts.forEach(post => likes.push(post.likes))
  const reducer = (sum, item) => sum + item
  const likeSum = likes.reduce(reducer, 0)
  return likeSum
}

const favoritePost = posts => {
  let max = 0
  let favPost = {}
  posts.forEach(post => {
    if (post.likes > max) {
      max = post.likes
      favPost = {
        title: post.title,
        author: post.author,
        likes: post.likes
      }
    }
  })
  return favPost
}

const mostPosts = posts => {
  let authorsCount = []
  posts.forEach(post => {
    const findName = lodash.find(authorsCount, ["author", post.author])
    if (findName === undefined) {
      authorsCount = lodash.concat(authorsCount, {
        author: post.author,
        count: 1
      })
    } else {
      const index = lodash.findIndex(authorsCount, ["author", post.author])
      authorsCount[index].count++
    }
  })
  const mostPosts = lodash.maxBy(authorsCount, function(o) {
    return o.count
  })
  return mostPosts
}

const mostLikes = posts => {
  let authorsCount = []
  posts.forEach(post => {
    const findName = lodash.find(authorsCount, ["author", post.author])
    if (findName === undefined) {
      authorsCount = lodash.concat(authorsCount, {
        author: post.author,
        likes: post.likes
      })
    } else {
      const index = lodash.findIndex(authorsCount, ["author", post.author])
      authorsCount[index].likes = authorsCount[index].likes + post.likes
    }
  })
  const mostLikes = lodash.maxBy(authorsCount, function(o) {return o.likes})
  console.log(mostLikes)
  return mostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoritePost,
  mostPosts,
  mostLikes
}
