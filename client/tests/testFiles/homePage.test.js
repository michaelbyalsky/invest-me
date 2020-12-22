const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../../../app');
const {
  Challenge, Label, LabelChallenge, Submission, User,
} = require('../../../models');
const challengesMock = require('../../mocks/challenges');
const mockUser = require('../../mocks/users');

function generateToken(currentUser) {
  const infoForCookie = {
    id: currentUser.id,
    username: currentUser.username,
  };
  return jwt.sign(infoForCookie, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '900s',
  });
}
