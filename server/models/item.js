import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: { type: 'String', required: true },
  picture: { type: 'String' },
  since: { type: 'Date', default: Date.now, required: true },
  lastModif: { type: 'Date', default: Date.now, required: true },
  cuid: { type: 'String', required: true }
});

// on every save, add the date
itemSchema.pre('save', function(next) {
  this.lastModif = new Date();
  next();
});

export default mongoose.model('Item', itemSchema);
