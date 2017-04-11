import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  name: { type: 'String', required: true },
  googleMapId: { type: 'String', required: true },
  location: {
    type: { type: 'String', default: 'Point' },
    coordinates: { type: ['Number'], default: [0, 0] },
  },
  since: { type: 'Date', default: Date.now, required: true },
  lastModif: { type: 'Date', default: Date.now, required: true },
  items: [
    { type: Schema.Types.ObjectId, ref: 'Item' },
  ],
});

// on every save, add the date
placeSchema.pre('save', function (next) {
  this.lastModif = new Date();
  next();
});

export default mongoose.model('Place', placeSchema);

