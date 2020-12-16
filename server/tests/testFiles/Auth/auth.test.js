const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../../../app");
const mockUser = require("../../mocks/users");
const { User, RefreshToken } = require("../../../models");
const usersArray = mockUser.slice(-2, -1);

function generateToken(currentUser) {
  const infoForCookie = {
    userId: currentUser.id,
    username: currentUser.username,
  };
  return jwt.sign(infoForCookie, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
}

describe("Register & Login Tests", () => {
  beforeAll(async () => {
    await User.destroy({ truncate: true, force: true });
    mockUser[0].password = await bcrypt.hashSync(mockUser[0].password, 10);
    await User.create(mockUser[0]);
  });

  afterAll(async () => {
    // await User.destroy({ truncate: true, force: true });
    await app.close();
  });

  test("User Can Register if the username and email Unique", async (done) => {
    const createUserResponse = await request(app)
      .post("/api/v1/auth/register")
      .send(mockUser[1]);

    expect(createUserResponse.status).toBe(201);
    done();
  });

  test("User Can Register if the username and email Unique", async (done) => {
    const createUserResponse = await request(app)
      .post("/api/v1/auth/register")
      .send(mockUser[2]);

    expect(createUserResponse.status).toBe(400);
    done();
  });

  test("User Can Register if the username and email Unique", async (done) => {
    const createUserResponse = await request(app)
      .post("/api/v1/auth/register")
      .send(mockUser[3]);

    expect(createUserResponse.status).toBe(400);
    done();
  });
});
