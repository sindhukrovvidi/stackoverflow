const supertest = require("supertest");
const { default: mongoose } = require("mongoose");

const Question = require("../models/questions.js");
const {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
} = require("../utils/question.js");
const User = require("../models/userProfile.js");

let server;
let token;
let connectSidValue = null;

jest.mock("../models/questions");
jest.mock("../utils/question", () => ({
  addTag: jest.fn(),
  getQuestionsByOrder: jest.fn(),
  filterQuestionsBySearch: jest.fn(),
}));

const tag1 = {
  _id: "507f191e810c19729de860ea",
  name: "tag1",
};
const tag2 = {
  _id: "65e9a5c2b26199dbcc3e6dc8",
  name: "tag2",
};

const ans1 = {
  _id: "65e9b58910afe6e94fc6e6dc",
  text: "Answer 1 Text",
  ans_by: "answer1_user",
};

const ans2 = {
  _id: "65e9b58910afe6e94fc6e6dd",
  text: "Answer 2 Text",
  ans_by: "answer2_user",
};

const mockQuestions = [
  {
    _id: "65e9b58910afe6e94fc6e6dc",
    title: "Question 1 Title",
    text: "Question 1 Text",
    tags: [tag1],
    answers: [ans1],
    views: 21,
  },
  {
    _id: "65e9b5a995b6c7045a30d823",
    title: "Question 2 Title",
    text: "Question 2 Text",
    tags: [tag2],
    answers: [ans2],
    views: 99,
  },
];

describe("Tests for Question Controller", () => {
  let existingQuestion;
  let updatedText = "Updated question text";
  let updatedModifiedOn = new Date();
  const asked_by = new mongoose.Types.ObjectId();

  beforeEach(async () => {
    server = require("../server.js");

    const respToken = await supertest(server).get("/csrf-token");
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

    const respRegister = await supertest(server)
      .post("/users/register")
      .send(fakeUser)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(respRegister.status).toBe(400);

    const findOneMockLogin = jest.fn().mockResolvedValue({ ...fakeUser });
    User.findOne = findOneMockLogin;

    const respLogin = await supertest(server)
      .post("/users/login")
      .send({ email: fakeUser.email, password: fakeUser.password })
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(respLogin.status).toBe(200);
    expect(respLogin.body.user.username).toBe(fakeUser.username);
    expect(respLogin.body.user.password).toBe(fakeUser.password);
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("GET /getQuestion - should return questions by filter", async () => {
    const mockReqQuery = {
      order: "someOrder",
      search: "someSearch",
    };

    getQuestionsByOrder.mockResolvedValueOnce(mockQuestions);
    filterQuestionsBySearch.mockReturnValueOnce(mockQuestions);
    const response = await supertest(server)
      .get("/question/getQuestion")
      .query(mockReqQuery)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestions);
  });

  it("GET /getQuestionById/:qid - should return a question by id and increment its views by 1", async () => {
    const mockReqParams = {
      qid: "65e9b5a995b6c7045a30d823",
    };

    const mockPopulatedQuestion = {
      answers: [
        mockQuestions.filter((q) => q._id == mockReqParams.qid)[0]["answers"],
      ],
      views: mockQuestions[1].views + 1,
    };

    Question.findOneAndUpdate = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
    });

    Question.findOneAndUpdate.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnValue(mockPopulatedQuestion),
    }));

    const response = await supertest(server)
      .get(`/question/getQuestionById/${mockReqParams.qid}`)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPopulatedQuestion);
  });

  it("GET /getQuestionById/:qid - should return 404 when question not found", async () => {
    const mockReqParams = { qid: "65e9b5a995b6c7045a30d823" };

    Question.findOneAndUpdate = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
    });

    Question.findOneAndUpdate.mockImplementationOnce(() => ({
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnValue(null),
    }));

    let response = await supertest(server)
      .get(`/question/getQuestionById/${mockReqParams.qid}`)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Question not found");
  });

  it("POST /addQuestion - should add a new question", async () => {
    const mockTags = [tag1, tag2];

    const mockQuestion = {
      _id: "65e9b58910afe6e94fc6e6fe",
      title: "Question 3 Title",
      text: "Question 3 Text",
      tags: [tag1, tag2],
      answers: [ans1],
    };

    addTag.mockResolvedValueOnce(mockTags);
    Question.create.mockResolvedValueOnce(mockQuestion);

    const response = await supertest(server)
      .post("/question/addQuestion")
      .send(mockQuestion)
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestion);
  });

  it("/POST updateQuestion - should return 200 if question is found and modifies question", async () => {
    existingQuestion = new Question({
      title: "This is the title",
      text: "Initial answer text",
      asked_by: asked_by,
      ask_date_time: new Date(),
      views: 1,
      tags: [new mongoose.Types.ObjectId()],
      answers: [new mongoose.Types.ObjectId()],
    });

    Question.create.mockResolvedValueOnce(existingQuestion);

    const findOneAndUpdateMock = jest
      .fn()
      .mockResolvedValueOnce(existingQuestion);
    Question.findOneAndUpdate = findOneAndUpdateMock;

    const existingQuestionId = new mongoose.Types.ObjectId();
    const response = await supertest(server)
      .post(`/question/updateQuestion/${existingQuestionId}`)
      .send({ text: updatedText, modifiedOn: new Date(updatedModifiedOn) })
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(findOneAndUpdateMock).toHaveBeenCalledWith(
      { _id: existingQuestionId },
      { text: updatedText, modifiedOn: new Date(updatedModifiedOn) },
      { new: true }
    );
    expect(response.status).toBe(200);
  });

  it("/POST updateQuestion - should return 404 if question is not found", async () => {
    const findOneAndUpdateMock = jest.fn().mockResolvedValueOnce(null);
    Question.findOneAndUpdate = findOneAndUpdateMock;

    const nonExistingQuestionId = new mongoose.Types.ObjectId();
    const response = await supertest(server)
      .post(`/question/updateQuestion/${nonExistingQuestionId}`)
      .send({ text: updatedText, modifiedOn: new Date(updatedModifiedOn) })
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(findOneAndUpdateMock).toHaveBeenCalledWith(
      { _id: nonExistingQuestionId },
      { text: updatedText, modifiedOn: new Date(updatedModifiedOn) },
      { new: true }
    );
    expect(response.status).toBe(404);
  });

  it("/DELETE deleteQuestion - Should delete the question if it exists", async () => {
    const findByIdAndDeleteMock = jest
      .fn()
      .mockResolvedValueOnce(new mongoose.Types.ObjectId(asked_by));
    Question.findByIdAndDelete = findByIdAndDeleteMock;

    const findByIdMock = jest
      .fn()
      .mockResolvedValueOnce(new mongoose.Types.ObjectId(asked_by));
    Question.findById = findByIdMock;

    const questionId = asked_by;

    const response = await supertest(server)
      .delete(`/question/deleteQuestionById/${questionId}`)
      .send({})
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(findByIdMock).toHaveBeenCalledWith(
      new mongoose.Types.ObjectId(questionId)
    );
    expect(findByIdAndDeleteMock).toHaveBeenCalledWith(
      new mongoose.Types.ObjectId(questionId)
    );
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(200);
    expect(response.body.message).toBe("Question deleted successfully");
  });

  it("/DELETE deleteQuestion - Should return 404 when question is not found", async () => {
    const newQuestionId = new mongoose.Types.ObjectId();
    const findByIdAndDeleteMock = jest.fn().mockResolvedValueOnce(null);
    Question.findByIdAndDelete = findByIdAndDeleteMock;
    const findByIdMock = jest.fn().mockResolvedValueOnce(null);
    Question.findById = findByIdMock;

    const response = await supertest(server)
      .delete(`/question/deleteQuestionById/${newQuestionId}`)
      .send({})
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(findByIdMock).toHaveBeenCalledWith(newQuestionId);
    expect(findByIdAndDeleteMock).not.toHaveBeenCalled();
    expect(response.status).toBe(404);
    expect(response.body.status).toBe(404);
    expect(response.body.message).toBe("Question not found");
  });
});
