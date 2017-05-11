import mongoose from 'mongoose';

const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  kind: { type: Schema.Types.ObjectId, ref: 'Kind', required: true },
  name: { type: 'String', required: true },
  picture: { type: 'String' }, // just an id here. the pic is stored externally in a folder (ex: storage/picture/items)
  since: { type: 'Date', default: Date.now, required: true },
  lastModif: { type: 'Date', default: Date.now, required: true },

  testMode: { type: 'Boolean', required: false, default: false },
});
itemSchema.plugin(mongoosePaginate);

// on every save, add the date
itemSchema.pre('save', function (next) {
  this.lastModif = new Date();
  next();
});

export default mongoose.model('Item', itemSchema);
