const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const pool = require('./db'); 

const app = express();
app.use(bodyParser.json());


app.use(cors());

app.get('/', (req, res) => {
  res.send('Library Management System API');
});


const authorsRouter = require('./routes/authors');
const categoriesRouter = require('./routes/categories');
const booksRouter = require('./routes/books');
const usersRouter = require('./routes/users');
const loansRouter = require('./routes/loans');
const publishersRouter = require('./routes/publishers');


app.use('/authors', authorsRouter);
app.use('/categories', categoriesRouter);
app.use('/books', booksRouter);
app.use('/users', usersRouter);
app.use('/loans', loansRouter);
app.use('/publishers', publishersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
