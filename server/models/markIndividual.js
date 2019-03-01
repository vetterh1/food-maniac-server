import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const markIndividualSchema = new Schema({
  // marks are about an item found in one place for one user
  item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  place: { type: Schema.Types.ObjectId, ref: 'Place', required: true },  
  // ink to the average mark for this item+place by all users
  markAggregate: { type: Schema.Types.ObjectId, ref: 'MarkAggregate', required: true },
  // and are given by a user
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  // There are 4 different marks, only 1st one is mandatory
  markOverall: { type: 'Number', required: true },
  markFood: { type: 'Number', required: false },
  markPlace: { type: 'Number', required: false },
  markStaff: { type: 'Number', required: false },
  // A mark also contains an optional comment (and later an optional picture)
  comment: { type: 'String', required: false },
  // Timestamps
  since: { type: 'Date', default: Date.now, required: true },
  lastModif: { type: 'Date', default: Date.now, required: true },

  testMode: { type: 'Boolean', required: false, default: false },
});

// on every save, add the date
markIndividualSchema.pre('save', function (next) {
  if (this) this.lastModif = new Date();
  else console.error('markIndividualSchema.pre(save) on undefined markIndividual!');
  next();
});

// Add id field in query answers (not only _id)
markIndividualSchema.set('toJSON', { virtuals: true, });

export default mongoose.model('MarkIndividual', markIndividualSchema);
