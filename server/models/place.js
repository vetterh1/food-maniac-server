import mongoose from 'mongoose';
import Item from './item';

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  name: { type: 'String', required: true },
  location: { type: {type:String}, coordinates: [Number] },
  since: { type: 'Date', default: Date.now, required: true },
  lastModif: { type: 'Date', default: Date.now, required: true },
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
  cuid: { type: 'String', required: true }
});

// on every save, add the date
placeSchema.pre('save', function(next) {
  this.lastModif = new Date();
  next();
});

export default mongoose.model('Place', placeSchema);

