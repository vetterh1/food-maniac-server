/* eslint-disable max-len */
/* eslint-disable no-console */

import MarkIndividual from '../server/models/markIndividual';
import MarkAggregate from '../server/models/markAggregate';
import Item from '../server/models/item';
import Place from '../server/models/place';

export const testUsers = [
  { _id: '58f4dfff45dab98a840a0000', login: 'laurent', first: 'Laurent', last: 'Vetterhoeffer', mark: 0, since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840a0001', login: 'chedia', first: 'Chédia', last: 'Abdelkafi', mark: 0, since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840a0002', login: 'elisa', first: 'Elisa', last: 'Vetterhoeffer', mark: 0, since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840a0003', login: 'julien', first: 'Julien', last: 'Vetterhoeffer', mark: 0, since: '1968-12-21T00:00:00.000Z' },
];

export const testCategories = [
  { _id: '58f4dfff45dab98a840aa000', name: 'Dish', since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840aa001', name: 'Dessert', since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840aa002', name: 'Drink', since: '1968-12-21T00:00:00.000Z' },
];

export const testKinds = [
  { _id: '58f4dfff45dab98a840ab000', name: 'Other', since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840ab001', name: 'American', since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840ab002', name: 'Mexican', since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840ab003', name: 'Belgium', since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840ab004', name: 'Indian', since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840ab005', name: 'Italian', since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840ab006', name: 'French', since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840ab007', name: 'Tunisian / Marocan', since: '1968-12-21T00:00:00.000Z' },
];

export const testItems = [
  { _id: '58f4dfff45dab98a840b0000', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab005', name: 'Pizza', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0001', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab005', name: 'Pasta', since: '1969-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0002', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab001', name: 'Burger', since: '1970-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0003', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab001', name: 'Burrito', since: '1971-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0004', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab001', name: 'Taco', since: '1972-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0005', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab003', name: 'Shrimp Croquettes', since: '1973-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  // /api/items?offset=2&limit=3&sort={"since":-1}&query={"category":"58f4dfff45dab98a840aa000"}: Results start above, and goes 'up' (retreive max 3 items)
  { _id: '58f4dfff45dab98a840b0007', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab003', name: 'Steak Tartare / Americain', since: '1974-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0100', category: '58f4dfff45dab98a840aa001', kind: '58f4dfff45dab98a840ab003', name: 'Chocolate mousse', since: '1975-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0006', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab004', name: 'Palak Paneer', since: '1976-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0101', category: '58f4dfff45dab98a840aa001', kind: '58f4dfff45dab98a840ab006', name: 'Tarte Tatin', since: '1977-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0200', category: '58f4dfff45dab98a840aa002', kind: '58f4dfff45dab98a840ab003', name: 'Beer', since: '1978-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0201', category: '58f4dfff45dab98a840aa002', kind: '58f4dfff45dab98a840ab006', name: 'Wine', since: '1979-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0202', category: '58f4dfff45dab98a840aa002', kind: '58f4dfff45dab98a840ab001', name: 'Tequila', since: '1980-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  // /api/items: 1st in list (desc date)
  { _id: '58f4dfff45dab98a840b0203', category: '58f4dfff45dab98a840aa002', kind: '58f4dfff45dab98a840ab001', name: 'Margarita', since: '1981-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
];


export const testPlaces = [
  { _id: '58f4dfff45dab98a840c0000', googleMapId: '5b40b93c6bc637ac86fa472d20160253957e0151', name: 'Papà Raffaele', items: [], lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [3.0651635000000397, 50.6403954], type: 'Point' } },
  { _id: '58f4e17c45dab98a840c0001', googleMapId: '182a1308c38dd5c5743235d550805305bc6b3c51', name: 'Le Lion Bossu', items: [], lastModif: '2017-04-17T17:09:01.130Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [3.06502839999996, 50.64030820000001], type: 'Point' } },
  { _id: '58f4e1a545dab98a840c0002', googleMapId: 'd593bd43feeceff2668431cadcbf3bf385616227', name: 'douss kreoline lille', items: [], lastModif: '2017-04-17T17:00:19.699Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [3.0653016999999636, 50.6402057], type: 'Point' } },
  { _id: '58f628e25a333aff739c0003', googleMapId: 'de2fb83328598ce9a8a0ced9a75fe077818b6c92', name: 'Drapri Claude', items: [], lastModif: '2017-04-18T14:55:30.633Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [3.0072533999999678, 50.55972489999999], type: 'Point' } },
  { _id: '58f62aa95a333aff739c0004', googleMapId: '36b6fd3a391c414efd0b62a9919e4b945d7f8d7b', name: 'Via Istanbul', items: [], lastModif: '2017-04-18T15:03:05.969Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [3.028566299999966, 50.5507048], type: 'Point' } },
  { _id: '58f62aa95a333aff739c0005', googleMapId: '3f9cee9e4cb5e07f12dc2cdf3369356f368cfcec', name: 'Les Rois Fainéants', items: [], lastModif: '2017-04-18T15:03:05.969Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [3.0177912000000333, 50.5750322], type: 'Point' } },
];

export const testMarkAggregates = [
  // Pizza from Papà Raffaele (4 individual marks)
  { _id: '58f4dfff45dab98a840d0000', place: '58f4dfff45dab98a840c0000', item: '58f4dfff45dab98a840b0000', nbMarksOverall: 4, nbMarksFood: 3, nbMarksPlace: 2, nbMarksStaff: 1, markOverall: 5, markFood: 5, markPlace: 5, markStaff: 5, lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [3.0651635000000397, 50.6403954], type: 'Point' } },
  // Pasta from Papà Raffaele (3 individual marks)
  { _id: '58f4dfff45dab98a840d0001', place: '58f4dfff45dab98a840c0000', item: '58f4dfff45dab98a840b0001', nbMarksOverall: 3, nbMarksFood: 3, nbMarksPlace: 1, markOverall: 4, markFood: 4, markPlace: 5, lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [3.0651635000000397, 50.6403954], type: 'Point' } },
  // Burgers from Le Lion Bossu (2 individual marks)
  { _id: '58f4dfff45dab98a840d0002', place: '58f4e17c45dab98a840c0001', item: '58f4dfff45dab98a840b0002', nbMarksOverall: 2, nbMarksFood: 2, nbMarksPlace: 2, nbMarksStaff: 2, markOverall: 4, markFood: 4, markPlace: 4, markStaff: 4, lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [3.06502839999996, 50.64030820000001], type: 'Point' } },
  // Pizza from Via Istanbul (2 individual marks)
  { _id: '58f4dfff45dab98a840d0003', place: '58f62aa95a333aff739c0004', item: '58f4dfff45dab98a840b0000', nbMarksOverall: 2, nbMarksFood: 2, nbMarksPlace: 2, nbMarksStaff: 2, markOverall: 3, markFood: 3, markPlace: 2, markStaff: 4, lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [3.028566299999966, 50.5507048], type: 'Point' } },
  // Burger from Les Rois Fainéants (1 individual mark)
  { _id: '58f4dfff45dab98a840d0004', place: '58f62aa95a333aff739c0005', item: '58f4dfff45dab98a840b0002', nbMarksOverall: 1, markOverall: 2, lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [50.5750322, 3.0177912000000333], type: 'Point' } },
];

export const testMarkIndividuals = [
  // Pizza from Papà Raffaele (4 individual marks)
    { _id: '58f4dfff45dab98a840d00a0', markAggregate: '58f4dfff45dab98a840d0000', user: '58f4dfff45dab98a840a0000', markOverall: 5, comment: 'Papà Raffaele pizzas are so good! (1)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' },
    { _id: '58f4dfff45dab98a840d00b0', markAggregate: '58f4dfff45dab98a840d0000', user: '58f4dfff45dab98a840a0001', markOverall: 4, markFood: 5, comment: 'Papà Raffaele pizzas are so good! (2)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' },
    { _id: '58f4dfff45dab98a840d00c0', markAggregate: '58f4dfff45dab98a840d0000', user: '58f4dfff45dab98a840a0002', markOverall: 5, markFood: 4, markPlace: 5, comment: 'Papà Raffaele pizzas are so good! (3)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' },
    { _id: '58f4dfff45dab98a840d00d0', markAggregate: '58f4dfff45dab98a840d0000', user: '58f4dfff45dab98a840a0003', markOverall: 5, markFood: 4, markPlace: 5, markStaff: 5, comment: 'Papà Raffaele pizzas are so good! (4)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' },
  // Pasta from Papà Raffaele (3 individual marks)
    { _id: '58f4dfff45dab98a840d00a1', markAggregate: '58f4dfff45dab98a840d0001', user: '58f4dfff45dab98a840a0000', markOverall: 3, markFood: 4, markPlace: 5, comment: 'Papà Raffaele pastas are good! (1)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' },
    { _id: '58f4dfff45dab98a840d00b1', markAggregate: '58f4dfff45dab98a840d0001', user: '58f4dfff45dab98a840a0001', markOverall: 4, markFood: 3, comment: 'Papà Raffaele pastas are good! (2)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' },
    { _id: '58f4dfff45dab98a840d00c1', markAggregate: '58f4dfff45dab98a840d0001', user: '58f4dfff45dab98a840a0003', markOverall: 4, markFood: 4, comment: 'Papà Raffaele pastas are good! (3)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' },
  // Burgers from Le Lion Bossu (2 individual marks)
    { _id: '58f4dfff45dab98a840d00a2', markAggregate: '58f4dfff45dab98a840d0002', user: '58f4dfff45dab98a840a0000', markOverall: 4, markFood: 3, markPlace: 4, markStaff: 3, comment: 'Le Lion Bossu burgers are good! (1)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' },
    { _id: '58f4dfff45dab98a840d00b2', markAggregate: '58f4dfff45dab98a840d0002', user: '58f4dfff45dab98a840a0000', markOverall: 3, markFood: 4, markPlace: 3, markStaff: 4, comment: 'Le Lion Bossu burgers are good! (2)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' },
  // Pizza from Via Istanbul (2 individual marks)
    { _id: '58f4dfff45dab98a840d00a3', markAggregate: '58f4dfff45dab98a840d0003', user: '58f4dfff45dab98a840a0000', markOverall: 3, markFood: 2, markPlace: 3, markStaff: 2, comment: 'Via Istanbul pizzas are so so :-S (1)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' },
    { _id: '58f4dfff45dab98a840d00b3', markAggregate: '58f4dfff45dab98a840d0003', user: '58f4dfff45dab98a840a0000', markOverall: 2, markFood: 3, markPlace: 2, markStaff: 4, comment: 'Via Istanbul pizzas are so so :-S (1)', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' },
  // Burger from Les Rois Fainéants (1 individual mark)
    { _id: '58f4dfff45dab98a840d00a4', markAggregate: '58f4dfff45dab98a840d0004', user: '58f4dfff45dab98a840a0000', markOverall: 2, comment: 'Les Rois Fainéants burgers are not good!', lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z' },
];


export function loadTestData(done) {
  MarkIndividual.remove({})
  .then(() => { return MarkAggregate.remove({}); }, () => { console.log('error on removing MarkIndividual'); })
  .then(() => { return Item.remove({}); }, () => { console.log('error on removing MarkAggregate'); })
  .then(() => { return Place.remove({}); }, () => { console.log('error on removing items'); })
  .then(
    // Create fake items for use in marks
    () => { return Item.create(testItems); },
    () => { console.log('error on removing places'); }
  )
  .then(
    // Create fake places for use in marks
    (items) => {
      global.items = items; // save created items in global variable for access in tests
      console.log('loadTestData - global.items.length=', global.items.length);
      return Place.create(testPlaces);
    },
    () => { console.log('error on creating global item'); }
  )
  .then((places) => {
    global.places = places; // save created places in global variable for access in tests
    console.log('loadTestData - global.places.length=', global.places.length);
    return done();
  }, () => { console.log('error on creating global places'); });
}
