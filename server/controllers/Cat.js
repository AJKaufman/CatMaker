// using code from DomoMaker E
const models = require('../models');

const Cat = models.Cat;

const makerPage = (req, res) => {
  Cat.CatModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), cats: docs });
  });
};

const makeCat = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Name and age, please!' });
  }

  // assign a new cat _id for each cat

  const catData = {
    name: req.body.name,
    age: req.body.age,
    happiness: 0,
    owner: req.session.account._id,
  };

  const newCat = new Cat.CatModel(catData);

  const catPromise = newCat.save();

  catPromise.then(() => res.json({ redirect: '/maker' }));

  catPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Cat already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return catPromise;
};

// lets you select a specific cat
const select = (req, res) => {
  console.log('controller.select');

  return Cat.CatModel.findByID(req.body._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    const newCat = docs;
    console.dir(`new cat = ${newCat}`);
    newCat.happiness += 1;
    console.dir(`new cat = ${docs.happiness}`);
    const savePromise = newCat.save();

    savePromise.then(() => res.json({
      happiness: newCat.happiness,
    }));

    savePromise.catch((saveError) => {
      res.json(saveError);
    });

    return res.json({ catInfo: newCat });
  });
};

// gets the cats in the form of an array called docs
const getCats = (request, response) => {
  const req = request;
  const res = response;

  return Cat.CatModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ cats: docs });
  });
};

// gets one cat as an aobject
const getThisCat = (request, response) => {
  const req = request;
  const res = response;

  return Cat.CatModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ cats: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getCats = getCats;
module.exports.getThisCat = getThisCat;
module.exports.makeCat = makeCat;
module.exports.select = select;
