const { Pool } = require("pg");

const connection = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_URL,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});

module.exports = connection;