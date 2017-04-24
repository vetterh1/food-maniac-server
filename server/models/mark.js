import mongoose from 'mongoose';
// import Item from './item';
// import Place from './place';
// import User from './user';

const Schema = mongoose.Schema;

const markSchema = new Schema({
  // ! Important Note !
  // One mark per place + item is an aggregate.
  // Its mark values are averages of all the individual marks for this place + item.
  // For this record, aggregate = true
  // and nbaggregatedMarksXxxx is the number of corresponding marks
  aggregatedMark: { type: 'Boolean', default: false, required: true },
  nbAggregatedMarksOverall: { type: 'Number', required: false },
  nbAggregatedMarksFood: { type: 'Number', required: false },
  nbAggregatedMarksPlace: { type: 'Number', required: false },
  nbAggregatedMarksStaff: { type: 'Number', required: false },
  // marks are about an item found in one place
  item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  place: { type: Schema.Types.ObjectId, ref: 'Place', required: true },
  // and given by a user (empty if it's an aggregate)
  user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  // There are 4 different marks, only 1st one is mandatory
  markOverall: { type: 'Number', required: true },
  markFood: { type: 'Number', required: false },
  markPlace: { type: 'Number', required: false },
  markStaff: { type: 'Number', required: false },
  // A mark also contains an optional comment (and later an optional picture)
  comment: { type: 'String', required: false },
  // Place geolocation is copied in the mark for easier search (by distance)
  // but ONLY for AGGREGATE marks. Individual marks don't need this information
  location: {
    type: { type: 'String', default: 'Point', required: false },
    coordinates: { type: ['Number'], default: [0, 0], required: false },
  },
  // Timestamps
  since: { type: 'Date', default: Date.now, required: true },
  lastModif: { type: 'Date', default: Date.now, required: true },
});

// on every save, add the date
markSchema.pre('save', function (next) {
  this.lastModif = new Date();
  next();
});

markSchema.index({ location: '2dsphere' });

export default mongoose.model('Mark', markSchema);

// OLD: Version with marks in array (slower and more cumbersome...)
// marks: [{
//   name: { type: 'String', required: true },
//   value: { type: 'Number', required: true },
// }],


