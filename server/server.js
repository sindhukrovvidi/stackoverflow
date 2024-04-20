// Application server

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const csurf = require('csurf');
const mongoose = require("mongoose");
const cors = require('cors');
const { MONGO_URL, port, CLIENT_URL } = require("./config");
mongoose.connect(MONGO_URL);

const app = express();

// Set up middleware
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',    
  resave: false,
  saveUninitialized: true
}));
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(csurf());

app.get('/csrf-token', (req, res) => {
    console.log("This is the server code ", req.csrfToken())
  res.json({ csrfToken: req.csrfToken() });
});

// Check login status route
app.get('/check-login', (req, res) => {
  const user = req.session.user;
  res.json({ loggedIn: !!user, user });
});


app.get("/", (_, res) => {
    res.send("Fake SO Server Dummy Endpoint");
    res.end();
});

const userProfileController = require('./controllers/userProfile');
const questionController = require('./controllers/questionController');
const tagController = require("./controllers/tag");
const answerController = require("./controllers/answer");

app.use('/users', userProfileController);
app.use('/question', questionController);
app.use("/tag", tagController);
app.use("/answer", answerController);

let server = app.listen(port, () => {
    console.log(`Server starts at http://localhost:${port}`);
});

process.on("SIGINT", () => {
    server.close();
    mongoose.disconnect();
    console.log("Server closed. Database instance disconnected");
    process.exit(0);
});

module.exports = server