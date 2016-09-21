var mongoose = require('mongoose')
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: { type: 'String', required: true },
  picture: { type: 'String', required: true },
  since: { type: 'Date', default: Date.now, required: true },
  lastModif: { type: 'Date', default: Date.now, required: true },
});

// on every save, add the date
itemSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.lastModif = currentDate;
  next();
});

module.exports = mongoose.model('Item', itemSchema);
