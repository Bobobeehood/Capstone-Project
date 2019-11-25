const { Pool, Client } = require('pg')
const connectionString = 'postgressql://postgres:bobobee@localhost:5432/teamCC'
const pool = new Pool({
  connectionString: connectionString,
})
/*pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})*/
  const client = new Client({
    connectionString: connectionString
  })
  client.connect()
  .then(() => console.log('Connected to DB successfully!'))
  .catch((error) =>{
    console.log('unable to connect to DB!');
    console.error(error);
})
  .finally(() => client.end());

  const createTables = () => {
    const teamDB = `
        CREATE TABLE IF NOT EXISTS users (
            Id SERIAL PRIMARY KEY,
            firstName VARCHAR(255) NOT NULL,
            lastName VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            gender VARCHAR(20) NOT NULL,
            is_admin BOOLEAN NOT NULL,
            department VARCHAR(50) NULL,
            address VARCHAR(255) NULL,
            createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS classes (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS articles (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            article VARCHAR(255) NOT NULL,
            authorId INTEGER REFERENCES users(id),
            flagged BOOLEAN NULL,
            createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS gifs (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            imageUrl VARCHAR(255) NOT NULL,
            publicId VARCHAR(255) NOT NULL,
            authorId INTEGER REFERENCES users(Id),
            flagged BOOLEAN NULL,
            createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            comment VARCHAR(255) NOT NULL,
            articleId INTEGER REFERENCES articles(id) NULL,
            gifId INTEGER REFERENCES gifs(id) NULL,
            authorId INTEGER REFERENCES users(id),
            createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )`;
    pool.query(teamDB)
        .then((res) => {
            // eslint-disable-next-line no-console
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            // eslint-disable-next-line no-console
            console.log(err);
            pool.end();
        });
};

  module.exports = {client,
    createTables
  };
  require('make-runnable')