/* eslint-disable no-undef */
const request = require("supertest");
const { default: mongoose } = require("mongoose");
const Answer = require("../models/answers");
const Question = require("../models/questions");
const User = require("../models/userProfile");

// Mock the Answer model
jest.mock("../models/answers");

let server;
let token;
let connectSidValue = null;

describe("Modify and Delete Existing Answers", () => {
  let existingAnswer;
  let updatedText = "Updated answer text";
  let updatedModifiedOn = new Date();
  const ans_by = new mongoose.Types.ObjectId();
  beforeEach(async () => {
    server = require("../server.js");

    const respToken = await request(server).get("/csrf-token");
    token = respToken.body.csrfToken;
    connectSidValue = null;
    respToken.headers["set-cookie"].forEach((cookie) => {
      if (cookie.includes("connect.sid")) {
        connectSidValue = cookie.split("=")[1].split(";")[0];
      }
    });

    const fakeUser = {
      username: "user1",
      password: "password1",
      email: "test@gmail.com",
      contact_no: 1234,
    };

    const findOneMock = jest.fn().mockResolvedValue({ email: fakeUser.email });
    User.findOne = findOneMock;

    const respRegister = await request(server)
      .post("/users/register")
      .send(fakeUser)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(respRegister.status).toBe(400);

    const findOneMockLogin = jest.fn().mockResolvedValue({ ...fakeUser });
    User.findOne = findOneMockLogin;

    const respLogin = await request(server)
      .post("/users/login")
      .send({ email: fakeUser.email, password: fakeUser.password })
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(respLogin.status).toBe(200);
    expect(respLogin.body.user.username).toBe(fakeUser.username);
    expect(respLogin.body.user.password).toBe(fakeUser.password);

    
    existingAnswer = new Answer({
      text: "Initial answer text",
      ans_by: ans_by,
      ans_date_time: new Date(),
    });
    
    Answer.create.mockResolvedValueOnce(existingAnswer);
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("/POST updateAnswer - should return 404 if answer is not found", async () => {
    const findOneAndUpdateMock = jest.fn().mockResolvedValueOnce(null);
    Answer.findOneAndUpdate = findOneAndUpdateMock;

    const nonExistingAnswerId = new mongoose.Types.ObjectId();
    const response = await request(server)
      .post(`/answer/updateAnswer/${nonExistingAnswerId}`)
      .send({ text: updatedText, modifiedOn: new Date(updatedModifiedOn) })
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(findOneAndUpdateMock).toHaveBeenCalledWith(
      { _id: nonExistingAnswerId },
      { text: updatedText, modifiedOn: new Date(updatedModifiedOn) },
      { new: true }
    );
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Answer not found");
  });

  it("/POST updateAnswer - should return 200 if answer is found and modifies answer", async () => {
    const findOneAndUpdateMock = jest
      .fn()
      .mockResolvedValueOnce(existingAnswer);
    Answer.findOneAndUpdate = findOneAndUpdateMock;

    const nonExistingAnswerId = new mongoose.Types.ObjectId();
    const response = await request(server)
      .post(`/answer/updateAnswer/${nonExistingAnswerId}`)
      .send({ text: updatedText, modifiedOn: new Date(updatedModifiedOn) })
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(findOneAndUpdateMock).toHaveBeenCalledWith(
      { _id: nonExistingAnswerId },
      { text: updatedText, modifiedOn: new Date(updatedModifiedOn) },
      { new: true }
    );
    expect(response.status).toBe(200);
  });

  it("/POST updateAnswer - should return 200 if answer is found and does not modifies answer", async () => {
    const findOneAndUpdateMock = jest
      .fn()
      .mockResolvedValueOnce(existingAnswer);
    Answer.findOneAndUpdate = findOneAndUpdateMock;

    const nonExistingAnswerId = new mongoose.Types.ObjectId();
    const response = await request(server)
      .post(`/answer/updateAnswer/${nonExistingAnswerId}`)
      .send({})
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(findOneAndUpdateMock).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("No changes detected in request body");
  });

  it("/DELETE deleteAnswer - Should delete the answer if it exists", async () => {
    const findByIdAndDeleteMock = jest.fn().mockResolvedValueOnce(new mongoose.Types.ObjectId(ans_by));
    Answer.findByIdAndDelete = findByIdAndDeleteMock;
  
    const findByIdMock = jest.fn().mockResolvedValueOnce(new mongoose.Types.ObjectId(ans_by));
    Answer.findById = findByIdMock;

    const answerId = ans_by; 
  
    const response = await request(server)
      .delete(`/answer/deleteAnswerById/${answerId}`)
      .send({})
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);
  
      expect(findByIdMock).toHaveBeenCalledWith(new mongoose.Types.ObjectId(answerId));
    expect(findByIdAndDeleteMock).toHaveBeenCalledWith(new mongoose.Types.ObjectId(answerId));
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(200);
    expect(response.body.message).toBe('Answer deleted successfully');
  });
  
  it("/DELETE deleteAnswer - Answer doesnot exists", async () => {
    const answerId = new mongoose.Types.ObjectId(); 

    const findByIdAndDeleteMock = jest.fn().mockResolvedValueOnce(answerId);
    Answer.findByIdAndDelete = findByIdAndDeleteMock;
  
    const findByIdMock = jest.fn().mockResolvedValueOnce();
    Answer.findById = findByIdMock;

    const response = await request(server)
      .delete(`/answer/deleteAnswerById/${answerId}`)
      .send({})
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);
  
      expect(findByIdMock).toHaveBeenCalledWith(answerId);
    expect(findByIdAndDeleteMock).not.toHaveBeenCalled();
    expect(response.status).toBe(404);
    expect(response.body.status).toBe(404);
    expect(response.body.message).toBe('Answer not found');
  });

});
