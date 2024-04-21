/* eslint-disable no-undef */
const request = require('supertest');
const { default: mongoose } = require("mongoose");
const Answer = require("../models/answers");
const Question = require("../models/questions");
const User = require("../models/userProfile");

// Mock the Answer model
jest.mock("../models/answers");

let server;
let token;
let connectSidValue = null;

describe("POST /addAnswer", () => {
  beforeEach(async () => {
    server = require("../server.js");

    const respToken = await request(server).get('/csrf-token');
    token = respToken.body.csrfToken;
    connectSidValue = null;
    respToken.headers['set-cookie'].forEach(cookie => {
      if (cookie.includes('connect.sid')) {
        connectSidValue = cookie.split('=')[1].split(';')[0];
      }
    });

    const fakeUser = { username: 'user1', password: 'password1', email: 'test@gmail.com', contact_no: 1234 };

    const findOneMock = jest.fn().mockResolvedValue({ email: fakeUser.email });
    User.findOne = findOneMock;

    const respRegister = await request(server)
      .post('/users/register')
      .send(fakeUser)
      .set('x-csrf-token', token)
      .set('Cookie', [`connect.sid=${connectSidValue}`]);

      expect(respRegister.status).toBe(400);

      const findOneMockLogin = jest.fn().mockResolvedValue({...fakeUser});
      User.findOne = findOneMockLogin;

    const respLogin = await request(server)
      .post('/users/login')
      .send({ email: fakeUser.email, password: fakeUser.password })
      .set('x-csrf-token', token)
      .set('Cookie', [`connect.sid=${connectSidValue}`]);

    expect(respLogin.status).toBe(200);
    expect(respLogin.body.user.username).toBe(fakeUser.username);
    expect(respLogin.body.user.password).toBe(fakeUser.password);
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should add a new answer to the question", async () => {
    const mockReqBody = {
      qid: "dummyQuestionId",
      ans: { text: "This is a test answer" }
    };
    const mockAnswer = { _id: "dummyAnswerId", text: "This is a test answer" }

    Answer.create.mockResolvedValueOnce(mockAnswer);

    
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "dummyQuestionId",
      answers: ["dummyAnswerId"]
    });

    const response = await request(server)
      .post("/answer/addAnswer")
      .send(mockReqBody)
      .set('x-csrf-token', token).set('Cookie', [`connect.sid=${connectSidValue}`]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAnswer);

    expect(Answer.create).toHaveBeenCalledWith({ text: "This is a test answer" });

    expect(Question.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "dummyQuestionId" },
      { $push: { answers: { $each: ["dummyAnswerId"], $position: 0 } } },
      { new: true }
    );
  });
})