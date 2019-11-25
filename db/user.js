const db = require("./index");

module.exports = () => {
  const createUsersTab = async () => {
    try {
      await db.query(`CREATE TABLE IF NOT EXISTS users (
            userId serial PRIMARY KEY,
            first_name VARCHAR (128) NOT NULL,
            last_name VARCHAR (128) NOT NULL,
            email VARCHAR (128) UNIQUE NOT NULL,
            password VARCHAR (150) NOT NULL,
            gender VARCHAR (15) NOT NULL,
            job_role VARCHAR (128) NOT NULL,
            department VARCHAR (128) NOT NULL,
            address VARCHAR (128) NOT NULL,
            isAdmin BOOLEAN )`);
    } catch (error) {
      console.log(error);
    }
  };
  createUsersTab();
};