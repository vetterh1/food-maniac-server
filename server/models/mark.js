import mongoose from 'mongoose';
import Item from './item';
import Place from './place';
import User from './user';

const Schema = mongoose.Schema;

const markSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  place: { type: Schema.Types.ObjectId, ref: 'Place', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  since: { type: 'Date', default: Date.now, required: true },
  lastModif: { type: 'Date', default: Date.now, required: true },
  marks: [{
    name: { type: 'String', required: true },
    value: { type: 'Number', required: true },
  }],
  cuid: { type: 'String', required: true },
});

// on every save, add the date
markSchema.pre('save', function(next) {
  this.lastModif = new Date();
  next();
});

export default mongoose.model('Mark', markSchema);
