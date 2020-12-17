const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../../../app");
const { mockUsersForAuth: mockUser, loginUsers } = require("../../mocks/usersMock");
const { User, RefreshToken } = require("../../../models");

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
    const copyUser = mockUser[0];
    await User.destroy({ truncate: true, force: true });
    copyUser.password = await bcrypt.hashSync(copyUser.password, 10);
    await User.create(copyUser);
  });

  afterAll(async () => {
    // await User.destroy({ truncate: true, force: true });
    await app.close();
  });

  test("Check validation", async (done) => {
    const createUserResponse = await request(app)
      .post("/api/v1/auth/register")
      .send(mockUser[4]);
    expect(createUserResponse.status).toBe(400);
    done();
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

  test("User Can Login With Correct Details", async (done) => {
    const invalidLoginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "supposed@gmail.com", password: "toFail123" });
    expect(invalidLoginResponse.status).toBe(403);

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send(loginUsers[0]);

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.headers["set-cookie"][0].split("=")[0]).toBe(
      "accessToken"
    );
    expect(loginResponse.headers["set-cookie"][1].split("=")[0]).toBe(
      "refreshToken"
    );

    const refreshTokenInDB = loginResponse.headers["set-cookie"][1]
      .split("=")[1]
      .split(";")[0];
    const validRefreshTokenInDB = await RefreshToken.findOne({
      where: {
        token: refreshTokenInDB,
      },
    });
    expect(validRefreshTokenInDB.username).toBe(mockUser[0].username);
    expect(loginResponse.body.success).toBe(true);

    done();
  });

  test("User get new access token", async (done) => {
    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send(loginUsers[0]);
    expect(loginResponse.status).toBe(200);
    const accessToken = loginResponse.headers["set-cookie"][0]
      .split("=")[1]
      .split(";")[0];
    const refreshToken = loginResponse.headers["set-cookie"][1]
      .split("=")[1]
      .split(";")[0];
    const validateToken = await request(app)
      .get("/api/v1/auth/validate-token")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(validateToken.status).toBe(200);

    const notValidateToken = await request(app)
      .get("/api/v1/auth/validate-token")
      .set("Authorization", "Bearer hkdfhaskjfhdsakjfhkdshfkds");
    expect(notValidateToken.status).toBe(408);

    const newAccessTokenRes = await request(app)
      .post("/api/v1/auth/token")
      .send({ token: refreshToken });
    expect(newAccessTokenRes.status).toBe(200);
    const newAccessToken = newAccessTokenRes.headers["set-cookie"][0]
      .split("=")[1]
      .split(";")[0];
    expect(newAccessToken.length > 0).toBe(true);
    done();
  });

  test('User Can Logout', async (done) => {
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send(loginUsers[0]);
    expect(loginResponse.status).toBe(200);

    const refreshToken = loginResponse.headers['set-cookie'][1].split('=')[1].split(';')[0];

    const logOutResponse = await request(app)
      .post('/api/v1/auth/logout')
      .send({ token: refreshToken });
    expect(logOutResponse.status).toBe(200);

    const deleteToken = await RefreshToken.findOne({
      where: {
        token: refreshToken,
      },
    });

    expect(deleteToken).toBe(null);

    done();
  });
});
