const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create a schema
const locationSchema = new Schema(
  {
    latitude: String,
    longitude: String,
    accuracy_radius: Number,
  },
  { collection: 'block' }
);

// we need to create a model using it
const Location = mongoose.model('Location', locationSchema);

module.exports = locationSchema;
