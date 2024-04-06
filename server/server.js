// Application server

const express = require("express");
const mongoose = require("mongoose");

const { MONGO_URL, port, CLIENT_URL } = require("./config");
const cors = require("cors");

mongoose.connect(MONGO_URL);

const app = express();

app.use(
    cors({
        credentials: true,
        origin: [CLIENT_URL],
    })
);

app.use(express.json());

app.get("/", (_, res) => {
    res.send("Fake SO Server Dummy Endpoint");
    res.end();
});

const userProfileController = require('./controllers/userProfile');

app.use('/users', userProfileController);

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