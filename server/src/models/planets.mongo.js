const mongoose = require('mongoose');

const planetsSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Planet', planetsSchema); // should be singular since mongoose will make it plural 