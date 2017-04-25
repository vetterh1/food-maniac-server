import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const markIndividualSchema = new Schema({
  // marks are about an item found in one place, but we use the aggregate to link to that couple
  markAggregate: { type: Schema.Types.ObjectId, ref: 'MarkAggregate', required: true },
  // and are given by a user (empty if it's an aggregate)
  user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
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
});

// on every save, add the date
markIndividualSchema.pre('save', function (next) {
  if (this) this.lastModif = new Date();
  else console.error('markIndividualSchema.pre(save) on undefined markIndividual!');
  next();
});

export default mongoose.model('MarkIndividual', markIndividualSchema);
