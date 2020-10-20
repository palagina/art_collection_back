<h1>ARTICLES COLLECTION</h1>

<p>Deployed <a href="https://article-collection-mp.herokuapp.com/">HERE</a></p>
<p>Frontend source code <a href="https://github.com/palagina/art_collection_front">HERE</a></p>

<p>A single page CRUD React application that use REST APIs built with Node.js.</p>
<p>What is used: React, React Router, React hooks, Redux, Redux Thunk, Node, Axios, MongoDB, Mongoose, Express, Bcrypt, JSON server, CORS, ESLint, Jest, Cypress, Mongo-mock, Supertest, Cross-env, JSON Web Token, Prop-types.
</p>
<img src="/img/preview.jpg" width="500">

<h3>Login</h3>
<p>Login to try the app can be done with the username and password indicated on the login page.
User data is stored in MongoDB database. Passwords are hashed by Bcrypt. User authentication is done via JsonWebToken.</p>

<h3>Database</h3>
<p>MongoDB contains collections for posts, users and comments. All the data comes through validation via Mongoose.js schemas.</p>

<h3>Basic Functionality</h3>
<p>The user can add, edit, delete, like and comment the articles. When adding a new article, its name and author are required, url however is optional. To edit an existing articile, the user can add the name of the article name that is already in the database and add the new author or url for it.</p>
<p>State management is implemented with Redux, to enable asynchronous actions Redux Thunk is used. RESTfull API is built with Node and Express. The data from the web server is fetched via Axios. Cross-origin resource sharing implemented with the use of Node's CORS middleware.</p>

<h3>Testing</h3>
<p>Testing for frontend are performed with Jest, for backend - with Mongo-mock and Supertest. E2E tests are performed via Cypress.</p>

<h3>Other notes</h3>
<p>Styling is done with Semantic UI</p>
<p>ESLint is used for static code analysis.</p>

<p>For cross-platform compatibility cross-env package was used.</p>
