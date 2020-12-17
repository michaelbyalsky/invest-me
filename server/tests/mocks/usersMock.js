const mockUser = [
  {
    id: 1,
    firstName: "michael",
    lastName: "byalsky",
    username: "miki213",
    email: "michaelbyalsky@gmail.com",
    password: "123456",
    birthDate: new Date("04/01/1996"),
    permission: "admin",
  },
  {
    id: 2,
    firstName: "Warren",
    lastName: "Buffett",
    username: "warren213",
    email: "warren@gmail.com",
    password: "123456",
    birthDate: new Date("04/01/1946"),
  },
  {
    id: 3,
    firstName: "Warren",
    lastName: "Buffett",
    username: "warren213",
    email: "warren1@gmail.com",
    password: "123456",
    birthDate: new Date("04/01/1946"),
  },
  {
    id: 4,
    firstName: "Warren",
    lastName: "Buffett",
    username: "warren214",
    email: "warren@gmail.com",
    password: "123456",
    birthDate: new Date("04/01/1946"),
  },
];

const mockUsersForAuth = [
  {
    firstName: "michael",
    lastName: "byalsky",
    username: "miki213",
    email: "michaelbyalsky@gmail.com",
    password: "123456",
    birthDate: new Date("04/01/1996"),
    permission: "admin",
  },
  {
    firstName: "Warren",
    lastName: "Buffett",
    username: "warren213",
    email: "warren@gmail.com",
    password: "123456",
    birthDate: new Date("04/01/1946"),
  },
  {
    firstName: "Warren",
    lastName: "Buffett",
    username: "warren213",
    email: "warren1@gmail.com",
    password: "123456",
    birthDate: new Date("04/01/1946"),
  },
  {
    firstName: "Warren",
    lastName: "Buffett",
    username: "warren214",
    email: "warren@gmail.com",
    password: "123456",
    birthDate: new Date("04/01/1946"),
  },
  {
    firstName: "Warren",
    lastName: "Buffett",
    username: "warren214",
    email: "warren",
    password: "123456",
    birthDate: new Date("04/01/1946"),
  },
];

const loginUsers = [
  { email: "michaelbyalsky@gmail.com", password: "123456" },
  { email: "warren1@gmail.com", password: "123456" },
];

module.exports.mockUsersForAuth = mockUsersForAuth;
module.exports.mockUser = mockUser
module.exports.loginUsers = loginUsers;
