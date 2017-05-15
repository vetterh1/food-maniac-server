import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const kindSchema = new Schema({
  name: { type: 'String', required: true },
  since: { type: 'Date', default: Date.now, required: true },
  lastModif: { type: 'Date', default: Date.now, required: true },
});

// on every save, add the date
kindSchema.pre('save', function (next) {
  this.lastModif = new Date();
  next();
});

// Add id field in query answers (not only _id)
kindSchema.set('toJSON', { virtuals: true, });

export default mongoose.model('Kind', kindSchema);
