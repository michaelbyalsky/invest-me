const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../../app");
const {mockUser, loginUsers} = require("./usersMock");
const { User, RefreshToken } = require("../../models");

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
    const copyUser = mockUser[0]
    await User.destroy({ truncate: true, force: true });
    copyUser.password = await bcrypt.hashSync(copyUser.password, 10);
    await User.create(copyUser);
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

  test('User Can Login With Correct Details', async (done) => {
    const invalidLoginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'supposed@gmail.com', password: 'toFail123' });
    expect(invalidLoginResponse.status).toBe(403);

    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send(loginUsers[0]);

    expect(loginResponse.status).toBe(200);
    console.log(loginResponse.headers['set-cookie']);
    expect(loginResponse.headers['set-cookie'][0].split("=")[0]).toBe('accessToken');
    expect(loginResponse.headers['set-cookie'][1].split("=")[0]).toBe('refreshToken');

    const refreshTokenInDB = loginResponse.headers['set-cookie'][1].split('=')[1].split(';')[0];
    const validRefreshTokenInDB = await RefreshToken.findOne({
      where: {
        token: refreshTokenInDB,
      },
    });
    expect(validRefreshTokenInDB.username).toBe(mockUser[0].username);
    expect(loginResponse.body.success).toBe(
      true,
    );

    done();
  });
});
