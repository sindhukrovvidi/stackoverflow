const request = require("supertest");
const { default: mongoose } = require("mongoose");
const User = require("../models/userProfile");

let server;
let token;
let connectSidValue = null;

describe("UserProfile Controller", () => {
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
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  describe("POST /users/register", () => {
    it("should register a new user", async () => {
      const fakeUser = {
        username: "user1",
        password: "password1",
        email: "test@gmail.com",
        contact_no: 1234,
      };

      const findOneMock = jest.fn().mockResolvedValue(null);
      User.findOne = findOneMock;

      const response = await request(server)
        .post("/users/register")
        .send(fakeUser)
        .set("x-csrf-token", token)
        .set("Cookie", [`connect.sid=${connectSidValue}`]);

      expect(findOneMock).toHaveBeenCalledWith({ email: fakeUser.email });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User registered successfully");
    });

    it("should return 400 if user already exists", async () => {
      const fakeUser = {
        username: "user1",
        password: "password1",
        email: "test@gmail.com",
        contact_no: 1234,
      };

      const findOneMock = jest
        .fn()
        .mockResolvedValue({ email: fakeUser.email });
      User.findOne = findOneMock;

      const response = await request(server)
        .post("/users/register")
        .send(fakeUser)
        .set("x-csrf-token", token)
        .set("Cookie", [`connect.sid=${connectSidValue}`]);

      expect(findOneMock).toHaveBeenCalledWith({ email: fakeUser.email });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User already exists");
    });
  });

  describe("POST /users/login", () => {
    it("should log in a user", async () => {
      const fakeUser = {
        username: "user1",
        password: "password1",
        email: "test@gmail.com",
        contact_no: 1234,
      };

      const findOneMock = jest.fn().mockResolvedValue(fakeUser);
      User.findOne = findOneMock;

      const response = await request(server)
        .post("/users/login")
        .send({ email: fakeUser.email, password: fakeUser.password })
        .set("x-csrf-token", token)
        .set("Cookie", [`connect.sid=${connectSidValue}`]);

      expect(findOneMock).toHaveBeenCalledWith({ email: fakeUser.email });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.username).toBe(fakeUser.username);
      expect(response.body.user.password).toBe(fakeUser.password);
    });

    it("should return 404 if user not found", async () => {
      const fakeUser = {
        username: "user1",
        password: "password1",
        email: "test@gmail.com",
        contact_no: 1234,
      };

      const findOneMock = jest.fn().mockResolvedValue(null);
      User.findOne = findOneMock;

      const response = await request(server)
        .post("/users/login")
        .send({ email: fakeUser.email, password: fakeUser.password })
        .set("x-csrf-token", token)
        .set("Cookie", [`connect.sid=${connectSidValue}`]);

      expect(findOneMock).toHaveBeenCalledWith({ email: fakeUser.email });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });
  });

  describe("POST /users/logout", () => {
    it("should log out a user", async () => {
      const response = await request(server)
        .post("/users/logout")
        .set("x-csrf-token", token)
        .set("Cookie", [`connect.sid=${connectSidValue}`]);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("GET /users/getCurrentUser", () => {
    it("should return the current user", async () => {
      const fakeUser = {
        username: "user1",
        password: "password1",
        email: "test@gmail.com",
        contact_no: 1234,
      };

      const findOneMock = jest.fn().mockResolvedValue(fakeUser);
      User.findOne = findOneMock;

      const loginResponse = await request(server)
        .post("/users/login")
        .send({ email: fakeUser.email, password: fakeUser.password })
        .set("x-csrf-token", token)
        .set("Cookie", [`connect.sid=${connectSidValue}`]);

      const response = await request(server)
        .get("/users/getCurrentUser")
        .set("x-csrf-token", token)
        .set("Cookie", [`connect.sid=${connectSidValue}`]);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe(fakeUser.username);
      expect(response.body.password).toBe(fakeUser.password);
      expect(response.body.email).toBe(fakeUser.email);
      expect(response.body.contact_no).toBe(fakeUser.contact_no);
    });

    it("should return 401 if user is not logged in", async () => {
      const response = await request(server)
        .get("/users/getCurrentUser")
        .set("x-csrf-token", token)
        .set("Cookie", [`connect.sid=${connectSidValue}`]);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });
  });

  describe("GET /users/getCurrentUserDetails", () => {
    it("should return the current user details", async () => {
      const fakeUser = {
        username: "user1",
        password: "password1",
        email: "test@gmail.com",
        contact_no: 1234,
      };

      const findOneMock = jest.fn().mockResolvedValue(fakeUser);
      User.findOne = findOneMock;

      const loginResponse = await request(server)
        .post("/users/login")
        .send({ email: fakeUser.email, password: fakeUser.password })
        .set("x-csrf-token", token)
        .set("Cookie", [`connect.sid=${connectSidValue}`]);

      const response = await request(server)
        .get("/users/getCurrentUserDetails")
        .set("x-csrf-token", token)
        .set("Cookie", [`connect.sid=${connectSidValue}`]);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.username).toBe(fakeUser.username);
      expect(response.body.user.password).toBe(fakeUser.password);
      expect(response.body.user.email).toBe(fakeUser.email);
      expect(response.body.user.contact_no).toBe(fakeUser.contact_no);
    });

    it("should return 401 if user is not logged in", async () => {
      const response = await request(server)
        .get("/users/getCurrentUserDetails")
        .set("x-csrf-token", token)
        .set("Cookie", [`connect.sid=${connectSidValue}`]);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });
  });
});
