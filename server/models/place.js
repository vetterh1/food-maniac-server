import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  name: { type: 'String', required: true },
  googleMapId: { type: 'String', required: true },
  googlePhotoUrl: { type: 'String', required: false },
  location: {
    type: { type: 'String', default: 'Point' },
    // coordinates are LONGITUDE then latitude, NOT the opposite!
    coordinates: { type: ['Number'], default: [0, 0] },
  },
  since: { type: 'Date', default: Date.now, required: true },
  lastModif: { type: 'Date', default: Date.now, required: true },
  items: [
    { type: Schema.Types.ObjectId, ref: 'Item' },
  ],

  testMode: { type: 'Boolean', required: false, default: false },
});

// on every save, add the date
placeSchema.pre('save', function (next) {
  this.lastModif = new Date();
  next();
});

// Add id field in query answers (not only _id)
placeSchema.set('toJSON', { virtuals: true, });

placeSchema.index({ location: '2dsphere' });

export default mongoose.model('Place', placeSchema);

