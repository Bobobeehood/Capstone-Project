
//const express = require("express");
//const router = express.Router();
const db = require('../db/index');
const jwt = require('jsonwebtoken');



exports.createArticle = (req, res) => {
  let token = req.headers.token || req.headers.authorization;
  if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
  }
  const authData = jwt.verify(token, process.env.TOKEN_SECRET);
  const data = {
      articleId: req.params.id,
      title: req.body.title,
      article: req.body.article,
      authorId: authData.id,
  };
  db.connect((err, db, done) => {
      const query = 'INSERT INTO articles(id, title, article, authorId) VALUES($1,$2,$3, $4) RETURNING *';
      const values = [data.articleId, data.title, data.article, data.authorId];
      db.query(query, values, (error, result) => {
          done();
          if (error) {
              res.status(400).json({
                  status: 'error',
                  error: 'Your Post is Unsuccessful!',
              });
          } else {
              res.status(202).send({
                  status: 'success',
                  result: result.rows[0],
              });
          }
      });
  });
};

exports.getArticleById = (req, res) => {
  // eslint-disable-next-line radix
  const articleId = parseInt(req.params.id);
  db.connect((err, db, done) => {
      const query = 'SELECT articleId, title, article, authorid, flagged, createdon FROM articles WHERE articleId = $1';
      db.query(query, [articleId], (error, result) => {
          done();
          if (error) {
              res.status(400).json({
                  status: 'error',
                  error: 'There is no article with such Id!',
              });
          }
          if (result.rows < '1') {
              res.status(404).send({
                  status: 'error',
                  error: 'Article with that id was not found',
              });
          } else {
              const query1 = 'SELECT articleId, authorid, comment FROM comments WHERE articleId = $1';
              db.query(query1, [articleId])
                  .then((data) => {
                      const comments = data.rows[0];
                      Object.assign(result.rows[0], { comments });
                      res.status(200).send({
                          status: 'success',
                          data: result.rows,
                      });
                      // eslint-disable-next-line no-console
                  }).catch((e) => console.log(e));
          }
      });
  });
};

exports.updateArticle = (req, res) => {
  // eslint-disable-next-line radix
  const articleId = parseInt(req.params.id);
  let token = req.headers.token || req.headers.authorization;
  if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
  }
  const authData = jwt.verify(token, process.env.TOKEN_SECRET);
  const data = {
      title: req.body.title,
      article: req.body.article,
      authorId: authData.id,
  };
  db.connect((err, db, done) => {
      db.query(
          'UPDATE articles SET title=$2, article=$3, authorid=$4 WHERE articleid = $1',
          [articleId, data.title, data.article, data.authorId],
          (error) => {
              done();
              if (error) {
                  res.status(400).json({
                      status: 'error',
                      error: 'An error occurred with your query',
                  });
              } else {
                  res.status(202).send({
                      status: 'success',
                  });
              }
          },
      );
  });
};




exports.getArticle = (req, res) => {
  const query = {
    text: 'SELECT * FROM articles WHERE id=$1;',
    values: [req.params.id],
  };
  db.query(query)
    .then((result) => {
      res.status(200).json({
        status: 'success',
        data: {
          id: result.rows[0].id,
          createdOn: result.rows[0].createdOn,
          title: result.rows[0].title,
          article: result.rows[0].article,
          comments: [
            {
              commentId: 1,
              authorId: 1,
              comment: 'Hello',
            },
          ],
        },
      });
    })
    .catch(() => {
      res.status(400).json({
        status: 'error',
        message: 'Article post not found',
      });
    });
};

  

  

exports.deleteArticle = (req, res) => {
  const queryOne = {
    text: 'SELECT * FROM articles WHERE id=$1;',
    values: [req.params.id],
  };

  db.query(queryOne)
    .then((result) => {
      const token = req.headers.authorization.split(' ')[1];
      if (jwt.verify(token, 'I_KNOW').userId === result.rows[0].authorId) {
        const query = {
          text: 'DELETE FROM articles WHERE id=$1;',
          values: [req.params.id],
        };
        db.query(query)
          .then(() => {
            res.status(200).json({
              status: 'success',
              data: {
                message: 'Article successfully deleted',
                title: result.rows[0].title,
                article: result.rows[0].article,
              },
            });
          })
          .catch((err) => {
            res.status(500).json({
              status: 'error',
              message: 'Article delete failed',
              result: err,
            });
          });
      } else {
        res.status(400).json({
          status: 'error',
          message: 'Authenticated user cannot delete article',
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        status: 'error',
        message: 'Article not found',
      });
    });
};


  

