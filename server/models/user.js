var mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  login: { type: 'String', required: true },
  first: { type: 'String', required: true },
  last: { type: 'String', required: true },
  since: { type: 'Date', default: Date.now, required: true },
  lastModif: { type: 'Date', default: Date.now, required: true },
  role: ['String'],
  nbPosts: { type: 'Number', default: 0, required: true },
  mark: { type: 'Number', default: 0, required: true },
  cuid: { type: 'String', required: true },
});

// on every save, add the date
userSchema.pre('save', function(next) {
  this.lastModif = new Date();
  next();
});

module.exports = mongoose.model('User', userSchema);
