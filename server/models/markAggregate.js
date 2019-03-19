import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const markAggregateSchema = new Schema({
  // marks are about an item found in one place
  item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  place: { type: Schema.Types.ObjectId, ref: 'Place', required: true },
  // There are 4 different marks, only 1st one is mandatory
  markOverall: { type: 'Number', required: true },
  markFood: { type: 'Number', required: false },
  markPlace: { type: 'Number', required: false },
  markValue: { type: 'Number', required: false },
  markStaff: { type: 'Number', required: false },
  // One mark per place + item is an aggregate.
  // Its mark values are averages of all the individual marks for this place + item.
  // nbaggregatedMarksXxxx is the number of corresponding marks
  nbMarksOverall: { type: 'Number', required: true },
  nbMarksFood: { type: 'Number', required: false },
  nbMarksPlace: { type: 'Number', required: false },
  nbMarksValue: { type: 'Number', required: false },
  nbMarksStaff: { type: 'Number', required: false },
  // Place geolocation is copied in the mark for easier search (by distance)
  location: {
    type: { type: 'String', default: 'Point', required: false },
    // coordinates are LONGITUDE then latitude, NOT the opposite!
    coordinates: { type: ['Number'], default: [0, 0], required: false },
  },
  // Timestamps
  since: { type: 'Date', default: Date.now, required: true },
  lastModif: { type: 'Date', default: Date.now, required: true },

  testMode: { type: 'Boolean', required: false, default: false },
});

// on every save, add the date
markAggregateSchema.pre('save', function (next) {
  if (this) this.lastModif = new Date();
  else console.error('markAggregateSchema.pre(save) on undefined markAggregate!');
  next();
});

// Add id field in query answers (not only _id)
markAggregateSchema.set('toJSON', { virtuals: true, });

markAggregateSchema.index({ location: '2dsphere' });

export default mongoose.model('MarkAggregate', markAggregateSchema);

