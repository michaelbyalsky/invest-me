require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME || 'invests',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    define: { underscored: true },
    logging: false,
    // "seederStorage": "sequelize",
    //"seederStorageTableName": "sequelize_seeds"
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || null,
    database: process.env.DB_TEST || 'invests_test',
    host: process.env.DB_HOST || "localhost",
    dialect: 'mysql',
    define: { underscored: true },
    logging: false,
  },
  production: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME || 'invests',
    host: process.env.DB_HOST || '34.67.18.168',
    dialect: 'mysql',
    define: { underscored: true },
  },
};
