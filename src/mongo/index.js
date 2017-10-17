const mongoose = require('mongoose');

// Use native promises
mongoose.Promise = global.Promise;

const Author = require('./author');
const Book = require('./book');

const db = mongoose.connect('mongodb://localhost/mongoose_basics', {
  useMongoClient: true,
});

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log('Successfully connected');

  const jamieAuthor = new Author({
    _id: new mongoose.Types.ObjectId(),
    name: {
      firstName: 'Jamie',
      lastName: 'Munro',
    },
    biography: 'Jamie is the author of ASP.NET MVC 5 with Bootstrap and Knockout.js.',
    twitter: 'https://twitter.com/endyourif',
    facebook: 'https://www.facebook.com/End-Your-If-194251957252562/',
  });

  jamieAuthor.save(err => {
    if (err) throw err;

    console.log('Author successfully saved.');

    const mvcBook = new Book({
      _id: new mongoose.Types.ObjectId(),
      title: 'ASP.NET MVC 5 with Bootstrap and Knockout.js',
      author: jamieAuthor._id,
      ratings: [
        {
          summary: 'Great read',
        },
      ],
    });

    mvcBook.save(err => {
      if (err) throw err;

      console.log('Book successfully saved.');
    });

    const knockoutBook = new Book({
      _id: new mongoose.Types.ObjectId(),
      title: 'Knockout.js: Building Dynamic Client-Side Web Applications',
      author: jamieAuthor._id,
    });

    knockoutBook.save(err => {
      if (err) throw err;

      console.log('Book successfully saved.');
    });
  });
});
