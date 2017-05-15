import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: 'String', required: true },
  since: { type: 'Date', default: Date.now, required: true },
  lastModif: { type: 'Date', default: Date.now, required: true },
});

// on every save, add the date
categorySchema.pre('save', function (next) {
  this.lastModif = new Date();
  next();
});

// Add id field in query answers (not only _id)
categorySchema.set('toJSON', { virtuals: true, });

export default mongoose.model('Category', categorySchema);
