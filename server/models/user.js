import mongoose from 'mongoose';

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

  testMode: { type: 'Boolean', required: false, default: false },
});

// on every save, add the date
userSchema.pre('save', function (next) {
  this.lastModif = new Date();
  next();
});

// Add id field in query answers (not only _id)
userSchema.set('toJSON', { virtuals: true, });

export default mongoose.model('User', userSchema);
