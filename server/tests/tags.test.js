
const supertest = require("supertest");

const Tag = require("../models/tags");
const Question = require("../models/questions");
const { default: mongoose } = require("mongoose");
const User = require("../models/userProfile");

const mockTags = [{ name: "tag1" }, { name: "tag2" }];

const mockQuestions = [
  { tags: [mockTags[0], mockTags[1]] },
  { tags: [mockTags[0]] },
];

let server;
let token;
let connectSidValue = null;

describe("GET /getTagsWithQuestionNumber", () => {
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

  it("should return tags with question numbers", async () => {
    Tag.find = jest.fn().mockResolvedValueOnce(mockTags);

    Question.find = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockResolvedValueOnce(mockQuestions),
    }));

    const response = await supertest(server)
      .get("/tag/getTagsWithQuestionNumber")
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);

    expect(response.status).toBe(200);

    expect(response.body).toEqual([
      { name: "tag1", qcnt: 2 },
      { name: "tag2", qcnt: 1 },
    ]);
    expect(Tag.find).toHaveBeenCalled();
    expect(Question.find).toHaveBeenCalled();
  });

  it("should return tags matching the provided ids", async () => {
    const mockTags = [
      { _id: new mongoose.Types.ObjectId(), name: "tag1" },
      { _id: new mongoose.Types.ObjectId(), name: "tag2" },
    ];
    Tag.find = jest.fn().mockResolvedValueOnce(mockTags);
  
    const tagIds = mockTags.map((tag) => tag._id);
    const response = await supertest(server)
      .post("/tag/getTagsWithIds")
      .send({tagIds})
      .set("x-csrf-token", token)
      .set("Cookie", [`connect.sid=${connectSidValue}`]);
  
    expect(response.status).toBe(200);
    expect(Tag.find).toHaveBeenCalledWith({ _id: { $in: tagIds } }, { name: 1 });
  });
});
