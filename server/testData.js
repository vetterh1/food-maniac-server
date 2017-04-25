/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "mongoose" }] */
/* eslint-disable no-console */
/* eslint-disable max-len */

import mongoose from 'mongoose';
import Item from './models/item';
import Place from './models/place';
import User from './models/user';
import MarkIndividual from './models/markIndividual';
import MarkAggregate from './models/markAggregate';

export const initialUsers = [
  new User({ _id: '58f4dfff45dab98a840a0000', login: 'laurent', first: 'Laurent', last: 'Vetterhoeffer', mark: 0, since: '1968-12-21T00:00:00.000Z' }),
  new User({ _id: '58f4dfff45dab98a840a0001', login: 'chedia', first: 'Chédia', last: 'Abdelkafi', mark: 0, since: '1968-12-21T00:00:00.000Z' }),
  new User({ _id: '58f4dfff45dab98a840a0002', login: 'elisa', first: 'Elisa', last: 'Vetterhoeffer', mark: 0, since: '1968-12-21T00:00:00.000Z' }),
  new User({ _id: '58f4dfff45dab98a840a0003', login: 'julien', first: 'Julien', last: 'Vetterhoeffer', mark: 0, since: '1968-12-21T00:00:00.000Z' }),
];

export const initialItems = [
  new Item({ _id: '58f4dfff45dab98a840b0000', category: 'dish', kind: 'italian', name: 'Pizza', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' }),
  new Item({ _id: '58f4dfff45dab98a840b0001', category: 'dish', kind: 'italian', name: 'Pasta', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' }),
  new Item({ _id: '58f4dfff45dab98a840b0002', category: 'dish', kind: 'american', name: 'Burger', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' }),
  new Item({ _id: '58f4dfff45dab98a840b0003', category: 'dish', kind: 'mexican', name: 'Burrito', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' }),
  new Item({ _id: '58f4dfff45dab98a840b0004', category: 'dish', kind: 'mexican', name: 'Taco', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' }),
  new Item({ _id: '58f4dfff45dab98a840b0005', category: 'dish', kind: 'belgium', name: 'Shrimp Croquettes', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' }),
  new Item({ _id: '58f4dfff45dab98a840b0006', category: 'dish', kind: 'indian', name: 'Palak Paneer', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' }),
];

export const initialPlaces = [
  new Place({ _id: '58f4dfff45dab98a840c0000', googleMapId: '5b40b93c6bc637ac86fa472d20160253957e0151', name: 'Papà Raffaele', items: [], lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [50.6403954, 3.0651635000000397], type: 'Point' } }),
  new Place({ _id: '58f4e17c45dab98a840c0001', googleMapId: '182a1308c38dd5c5743235d550805305bc6b3c51', name: 'Le Lion Bossu', items: [], lastModif: '2017-04-17T17:09:01.130Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [50.64030820000001, 3.06502839999996], type: 'Point' } }),
  new Place({ _id: '58f4e1a545dab98a840c0002', googleMapId: 'd593bd43feeceff2668431cadcbf3bf385616227', name: 'douss kreoline lille', items: [], lastModif: '2017-04-17T17:00:19.699Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [50.6402057, 3.0653016999999636], type: 'Point' } }),
  new Place({ _id: '58f628e25a333aff739c0003', googleMapId: 'de2fb83328598ce9a8a0ced9a75fe077818b6c92', name: 'Drapri Claude', items: [], lastModif: '2017-04-18T14:55:30.633Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [50.55972489999999, 3.0072533999999678], type: 'Point' } }),
  new Place({ _id: '58f62aa95a333aff739c0004', googleMapId: '36b6fd3a391c414efd0b62a9919e4b945d7f8d7b', name: 'Via Istanbul', items: [], lastModif: '2017-04-18T15:03:05.969Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [50.5507048, 3.028566299999966], type: 'Point' } }),
  new Place({ _id: '58f62aa95a333aff739c0005', googleMapId: '3f9cee9e4cb5e07f12dc2cdf3369356f368cfcec', name: 'Les Rois Fainéants', items: [], lastModif: '2017-04-18T15:03:05.969Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [50.5750322, 3.0177912000000333], type: 'Point' } }),
];

export const initialMarkAggregates = [
  // Pizza from Papà Raffaele (4 individual marks)
  new MarkAggregate({ _id: '58f4dfff45dab98a840d0000', place: '58f4dfff45dab98a840c0000', item: '58f4dfff45dab98a840b0000', nbMarksOverall: 4, nbMarksFood: 3, nbMarksPlace: 2, nbMarksStaff: 1, markOverall: 5, markFood: 5, markPlace: 5, markStaff: 5, lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [50.6403954, 3.0651635000000397], type: 'Point' } }),
  // Pasta from Papà Raffaele (3 individual marks)
  new MarkAggregate({ _id: '58f4dfff45dab98a840d0001', place: '58f4dfff45dab98a840c0000', item: '58f4dfff45dab98a840b0001', nbMarksOverall: 3, nbMarksFood: 3, nbMarksPlace: 1, markOverall: 4, markFood: 4, markPlace: 5, lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [50.6403954, 3.0651635000000397], type: 'Point' } }),
  // Burgers from Le Lion Bossu (2 individual marks)
  new MarkAggregate({ _id: '58f4dfff45dab98a840d0002', place: '58f4e17c45dab98a840c0001', item: '58f4dfff45dab98a840b0002', nbMarksOverall: 2, nbMarksFood: 2, nbMarksPlace: 2, nbMarksStaff: 2, markOverall: 4, markFood: 4, markPlace: 4, markStaff: 4, lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [50.64030820000001, 3.06502839999996], type: 'Point' } }),
  // Pizza from Via Istanbul (2 individual marks)
  new MarkAggregate({ _id: '58f4dfff45dab98a840d0003', place: '58f62aa95a333aff739c0004', item: '58f4dfff45dab98a840b0000', nbMarksOverall: 2, nbMarksFood: 2, nbMarksPlace: 2, nbMarksStaff: 2, markOverall: 3, markFood: 3, markPlace: 2, markStaff: 4, lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [50.5507048, 3.028566299999966], type: 'Point' } }),
  // Burger from Les Rois Fainéants (1 individual mark)
  new MarkAggregate({ _id: '58f4dfff45dab98a840d0004', place: '58f62aa95a333aff739c0005', item: '58f4dfff45dab98a840b0002', nbMarksOverall: 1, markOverall: 2, lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [50.5750322, 3.0177912000000333], type: 'Point' } }),
];

export const initialMarkIndividuals = [
  // Pizza from Papà Raffaele (4 individual marks)
  new MarkIndividual({ _id: '58f4dfff45dab98a840d00a0', markAggregate: '58f4dfff45dab98a840d0000', user: '58f4dfff45dab98a840a0000', markOverall: 5, comment: 'Papà Raffaele pizzas are so good! (1)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' }),
  new MarkIndividual({ _id: '58f4dfff45dab98a840d00b0', markAggregate: '58f4dfff45dab98a840d0000', user: '58f4dfff45dab98a840a0001', markOverall: 4, markFood: 5, comment: 'Papà Raffaele pizzas are so good! (2)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' }),
  new MarkIndividual({ _id: '58f4dfff45dab98a840d00c0', markAggregate: '58f4dfff45dab98a840d0000', user: '58f4dfff45dab98a840a0002', markOverall: 5, markFood: 4, markPlace: 5, comment: 'Papà Raffaele pizzas are so good! (3)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' }),
  new MarkIndividual({ _id: '58f4dfff45dab98a840d00d0', markAggregate: '58f4dfff45dab98a840d0000', user: '58f4dfff45dab98a840a0003', markOverall: 5, markFood: 4, markPlace: 5, markStaff: 5, comment: 'Papà Raffaele pizzas are so good! (4)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' }),
  // Pasta from Papà Raffaele (3 individual marks)
  new MarkIndividual({ _id: '58f4dfff45dab98a840d00a1', markAggregate: '58f4dfff45dab98a840d0001', user: '58f4dfff45dab98a840a0000', markOverall: 3, markFood: 4, markPlace: 5, comment: 'Papà Raffaele pastas are good! (1)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' }),
  new MarkIndividual({ _id: '58f4dfff45dab98a840d00b1', markAggregate: '58f4dfff45dab98a840d0001', user: '58f4dfff45dab98a840a0001', markOverall: 4, markFood: 3, comment: 'Papà Raffaele pastas are good! (2)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' }),
  new MarkIndividual({ _id: '58f4dfff45dab98a840d00c1', markAggregate: '58f4dfff45dab98a840d0001', user: '58f4dfff45dab98a840a0003', markOverall: 4, markFood: 4, comment: 'Papà Raffaele pastas are good! (3)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' }),
  // Burgers from Le Lion Bossu (2 individual marks)
  new MarkIndividual({ _id: '58f4dfff45dab98a840d00a2', markAggregate: '58f4dfff45dab98a840d0002', user: '58f4dfff45dab98a840a0000', markOverall: 4, markFood: 3, markPlace: 4, markStaff: 3, comment: 'Le Lion Bossu burgers are good! (1)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' }),
  new MarkIndividual({ _id: '58f4dfff45dab98a840d00b2', markAggregate: '58f4dfff45dab98a840d0002', user: '58f4dfff45dab98a840a0000', markOverall: 3, markFood: 4, markPlace: 3, markStaff: 4, comment: 'Le Lion Bossu burgers are good! (2)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' }),
  // Pizza from Via Istanbul (2 individual marks)
  new MarkIndividual({ _id: '58f4dfff45dab98a840d00a3', markAggregate: '58f4dfff45dab98a840d0003', user: '58f4dfff45dab98a840a0000', markOverall: 3, markFood: 2, markPlace: 3, markStaff: 2, comment: 'Via Istanbul pizzas are so so :-S (1)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' }),
  new MarkIndividual({ _id: '58f4dfff45dab98a840d00b3', markAggregate: '58f4dfff45dab98a840d0003', user: '58f4dfff45dab98a840a0000', markOverall: 2, markFood: 3, markPlace: 2, markStaff: 4, comment: 'Via Istanbul pizzas are so so :-S (1)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' }),
  // Burger from Les Rois Fainéants (1 individual mark)
  new MarkIndividual({ _id: '58f4dfff45dab98a840d00a4', markAggregate: '58f4dfff45dab98a840d0004', user: '58f4dfff45dab98a840a0000', markOverall: 2, comment: 'Les Rois Fainéants burgers are not good!', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' }),
];



export default function insertInitialData() {
  console.log('{   insertInitialData()');

  // Create test users after removing any existing one
  User.find({ since: '1968-12-21T00:00:00.000Z' }).remove().exec()
    .then(User.create(initialUsers, (err2) => {
      if (err2) console.log('    User.create err=', err2);
    }))

  // Create new test items after removing any existing one
    .then(Item.find({ since: '1968-12-21T00:00:00.000Z' }).remove().exec())
    .then(Item.create(initialItems, (err3) => {
      if (err3) console.log('    Item.create err=', err3);
    }))

  // Create new test places after removing any existing one
    .then(Place.find({ since: '1968-12-21T00:00:00.000Z' }).remove().exec())
    .then(Place.create(initialPlaces, (err4) => {
      if (err4) console.log('    Place.create err=', err4);
    }))

  // Create new test marks after removing any existing one
    .then(MarkAggregate.find({ since: '1968-12-21T00:00:00.000Z' }).remove().exec())
    .then(MarkAggregate.create(initialMarkAggregates, (err5) => {
      if (err5) console.log('    MarkAggregate.create err=', err5);
    }))

  // Create new test marks after removing any existing one
    .then(MarkIndividual.find({ since: '1968-12-21T00:00:00.000Z' }).remove().exec())
    .then(MarkIndividual.create(initialMarkIndividuals, (err6) => {
      if (err6) console.log('    MarkIndividual.create err=', err6);
    }))

  // Display collection counts
    .then(() => {
      User.find().count((err5, results) => {
        if (err5) return console.error(err5);
        const test = results === initialUsers.length ? 'OK' : 'KO';
        console.log(`# Users: ${results} ${test}`);
        return results;
      });
      Item.find().count((err6, results) => {
        if (err6) return console.error(err6);
        const test = results === initialItems.length ? 'OK' : 'KO';
        console.log(`# Items: ${results} ${test}`);
        return results;
      });
      Place.find().count((err7, results) => {
        if (err7) return console.error(err7);
        const test = results === initialPlaces.length ? 'OK' : 'KO';
        console.log(`# Places: ${results} ${test}`);
        return results;
      });
      MarkAggregate.find().count((err8, results) => {
        if (err8) return console.error(err8);
        const test = results === initialMarkAggregates.length ? 'OK' : 'KO';
        console.log(`# MarkAggregate: ${results} ${test}`);
        return results;
      });
      MarkIndividual.find().count((err8, results) => {
        if (err8) return console.error(err8);
        const test = results === initialMarkIndividuals.length ? 'OK' : 'KO';
        console.log(`# MarkIndividual: ${results} ${test}`);
        return results;
      });
    });

  console.log('}   insertInitialData()');
}
