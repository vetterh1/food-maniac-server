var mongoose = require('mongoose')
var Item = require('./item')
var Place = require('./Place')
var User = require('./User')
const Schema = mongoose.Schema;

const markSchema = new Schema({
  item: { type: Number, ref: 'Item' },
  place: { type: Number, ref: 'Place' },
  user: { type: Number, ref: 'User' },
  since: { type: 'Date', default: Date.now, required: true },
  lastModif: { type: 'Date', default: Date.now, required: true },
  mark: { type: 'Number', required: true },
});

// on every save, add the date
markSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.lastModif = currentDate;
  next();
});

module.exports = mongoose.model('Mark', markSchema);