const express = require('express');
const bodyParser = require('body-parser');
const articleRoute = require('./routes/article');
const morgan = require('morgan');



const app = express();


//This take care of CORs....
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

app.use('/article', articleRoute);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);  
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
  next();
});


module.exports = app;