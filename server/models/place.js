var mongoose = require('mongoose')
var Item = require('./item')
const Schema = mongoose.Schema;

const placeSchema = new Schema({
  name: { type: 'String', required: true },
  location: { type: {type:String}, coordinates: [Number] },
  since: { type: 'Date', default: Date.now, required: true },
  lastModif: { type: 'Date', default: Date.now, required: true },
  items: [{ type: Number, ref: 'Item' }],
});

// on every save, add the date
placeSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.lastModif = currentDate;
  next();
});

module.exports = mongoose.model('Place', placeSchema);
