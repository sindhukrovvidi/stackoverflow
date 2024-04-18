// Application server

const express = require("express");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const keys = require('./config/keys');

const { MONGO_URL, port, CLIENT_URL } = require("./config");
const cors = require("cors");

mongoose.connect(MONGO_URL);

const app = express();
const unauthorizedPaths = ['/users/login', 'users/register', '/question/getQuestion'];

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, keys.secretOrKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
}

app.use(
    cors({
        credentials: true,
        origin: [CLIENT_URL],
    })
);

app.use(express.json());

app.use((req, res, next) => {
    if (unauthorizedPaths.includes(req.path)) {
        return next();
    }
    verifyToken(req, res, next);
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