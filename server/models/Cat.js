// using code from DomoMaker E by Aidan Kaufman
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let CatModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const CatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  happiness: {
    type: Number,
    default: 0,
    min: 0,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

CatSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  happiness: doc.happiness,
  _id: doc._id,
});

CatSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return CatModel.find(search).select('name age happiness').exec(callback);
};

// finds a cat by its ID
CatSchema.statics.findByID = (_id, callback) => {
  const search = {
    _id: convertId(_id), // AIDAN
  };

  console.dir(search);

  return CatModel.findOne({ _id }).select('name age happiness').exec(callback);
};

CatModel = mongoose.model('Cat', CatSchema);

module.exports.CatModel = CatModel;
module.exports.CatSchema = CatSchema;

