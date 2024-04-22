const supertest = require('supertest');
const mongoose = require('mongoose');
const Question = require('../models/questions');
const UserProfile = require('../models/userProfile');

let server;
let token;
let connectSidValue;

beforeEach(async () => {
  server = require('../server.js');
  const respToken = await supertest(server).get('/csrf-token');
  token = respToken.body.csrfToken;
  connectSidValue = null;
  respToken.headers['set-cookie'].forEach((cookie) => {
    if (cookie.includes('connect.sid')) {
      connectSidValue = cookie.split('=')[1].split(';')[0];
    }
  });
});

afterEach(async () => {
  server.close();
  await mongoose.disconnect();
});

describe('updateVotes', () => {
  it('should return 400 in response status if user has already voted in the same way', async () => {
    const userId = new mongoose.Types.ObjectId();
    const questionId = new mongoose.Types.ObjectId();
    const voteValue = 1;

    const mockQuestion = {
      _id: questionId,
      votes: [{ userId, value: voteValue }],
    };

    const findByIdMock = jest.fn().mockResolvedValue(mockQuestion);
    Question.findById = findByIdMock;

    const mockUserProfile = { _id: userId };
    const userProfileFindByIdMock = jest.fn().mockResolvedValue(mockUserProfile);
    UserProfile.findById = userProfileFindByIdMock;

    const response = await supertest(server)
      .post('/vote/updateVotes')
      .send({ qid: questionId, userId, voteValue })
      .set('x-csrf-token', token)
      .set('Cookie', [`connect.sid=${connectSidValue}`]);

    expect(response.body.status).toBe(400);
    expect(response.body.message).toBe('User has already voted in the same way');
  });

  it('should update the vote value if user has voted differently before', async () => {
    const userId = new mongoose.Types.ObjectId();
    const questionId = new mongoose.Types.ObjectId();
    const voteValue = -1;

    const mockQuestion = {
      _id: questionId,
      votes: [{ userId, value: 1 }],
    };

    const findByIdMock = jest.fn().mockResolvedValue(mockQuestion);
    Question.findById = findByIdMock;

    const mockUserProfile = { _id: userId };
    const userProfileFindByIdMock = jest.fn().mockResolvedValue(mockUserProfile);
    UserProfile.findById = userProfileFindByIdMock;

    const findOneAndUpdateMock = jest.fn().mockResolvedValue({
      _id: questionId,
      votes: [{ userId, value: voteValue }],
    });
    Question.findOneAndUpdate = findOneAndUpdateMock;

    const response = await supertest(server)
      .post('/vote/updateVotes')
      .send({ qid: questionId, userId, voteValue })
      .set('x-csrf-token', token)
      .set('Cookie', [`connect.sid=${connectSidValue}`]);

    expect(response.status).toBe(200);
    expect(findOneAndUpdateMock).toHaveBeenCalledWith(
      { _id: questionId, 'votes.userId': userId },
      { $set: { 'votes.$.value': voteValue } },
      { new: true }
    );
  });

  it('should add a new vote if user has not voted before', async () => {
    const userId = new mongoose.Types.ObjectId();
    const questionId = new mongoose.Types.ObjectId();
    const voteValue = 1;

    const mockQuestion = {
      _id: questionId,
      votes: [],
    };

    const findByIdMock = jest.fn().mockResolvedValue(mockQuestion);
    Question.findById = findByIdMock;

    const mockUserProfile = { _id: userId };
    const userProfileFindByIdMock = jest.fn().mockResolvedValue(mockUserProfile);
    UserProfile.findById = userProfileFindByIdMock;

    const findOneAndUpdateMock = jest
      .fn()
      .mockResolvedValueOnce({
        _id: questionId,
        votes: [{ userId, value: voteValue }],
      })
      .mockResolvedValueOnce({
        _id: questionId,
        votes: [{ userId, value: voteValue }]
      });
    Question.findOneAndUpdate = findOneAndUpdateMock;

    const response = await supertest(server)
      .post('/vote/updateVotes')
      .send({ qid: questionId, userId, voteValue })
      .set('x-csrf-token', token)
      .set('Cookie', [`connect.sid=${connectSidValue}`]);

    expect(response.status).toBe(200);
    expect(findOneAndUpdateMock).toHaveBeenCalledWith(
      { _id: questionId },
      { $push: { votes: { userId, value: voteValue } } },
      { new: true }
    );
  });

  it('should return 404 if question or user not found', async () => {
    const userId = new mongoose.Types.ObjectId();
    const questionId = new mongoose.Types.ObjectId();
    const voteValue = 1;

    const findByIdMock = jest.fn().mockResolvedValue(null);
    Question.findById = findByIdMock;

    const userProfileFindByIdMock = jest.fn().mockResolvedValue(null);
    UserProfile.findById = userProfileFindByIdMock;

    const response = await supertest(server)
      .post('/vote/updateVotes')
      .send({ qid: questionId, userId, voteValue })
      .set('x-csrf-token', token)
      .set('Cookie', [`connect.sid=${connectSidValue}`]);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Question or user not found');
  });
});