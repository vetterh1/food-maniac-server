/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "mongoose" }] */
/* eslint-disable no-console */
/* eslint-disable max-len */

import mongoose from 'mongoose';
import Item from './models/item';
import Place from './models/place';
import User from './models/user';
import Kind from './models/kind';
import Category from './models/category';
import MarkIndividual from './models/markIndividual';
import MarkAggregate from './models/markAggregate';

export const initialUsers = [
  { _id: '58f4dfff45dab98a840a0000', login: 'laurent', first: 'Laurent', last: 'Vetterhoeffer', mark: 0, since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840a0001', login: 'chedia', first: 'Chédia', last: 'Abdelkafi', mark: 0, since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840a0002', login: 'elisa', first: 'Elisa', last: 'Vetterhoeffer', mark: 0, since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840a0003', login: 'julien', first: 'Julien', last: 'Vetterhoeffer', mark: 0, since: '1968-12-21T00:00:00.000Z' },
];

export const initialCategories = [
  { _id: '58f4dfff45dab98a840aa000', name: 'Dish', since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840aa001', name: 'Dessert', since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840aa002', name: 'Drink', since: '1968-12-21T00:00:00.000Z' },
];

export const initialKinds = [
  { _id: '58f4dfff45dab98a840ab000', name: 'Other', since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840ab001', name: 'American', since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840ab002', name: 'Mexican', since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840ab003', name: 'Belgium', since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840ab004', name: 'Indian', since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840ab005', name: 'Italian', since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840ab006', name: 'French', since: '1968-12-21T00:00:00.000Z' },
  { _id: '58f4dfff45dab98a840ab007', name: 'Tunisian / Marocan', since: '1968-12-21T00:00:00.000Z' },
];


export const initialItems = [
  { _id: '58f4dfff45dab98a840b0000', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab005', name: 'Pizza', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0001', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab005', name: 'Pasta', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0002', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab001', name: 'Burger', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0003', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab001', name: 'Burrito', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0004', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab001', name: 'Taco', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0005', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab003', name: 'Shrimp Croquettes', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0007', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab003', name: 'Steak Tartare / Americain', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0006', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab004', name: 'Palak Paneer', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0100', category: '58f4dfff45dab98a840aa001', kind: '58f4dfff45dab98a840ab003', name: 'Chocolate mousse', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0101', category: '58f4dfff45dab98a840aa001', kind: '58f4dfff45dab98a840ab006', name: 'Tarte Tatin', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0200', category: '58f4dfff45dab98a840aa002', kind: '58f4dfff45dab98a840ab003', name: 'Beer', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0201', category: '58f4dfff45dab98a840aa002', kind: '58f4dfff45dab98a840ab006', name: 'Wine', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0202', category: '58f4dfff45dab98a840aa002', kind: '58f4dfff45dab98a840ab001', name: 'Tequila', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },
  { _id: '58f4dfff45dab98a840b0203', category: '58f4dfff45dab98a840aa002', kind: '58f4dfff45dab98a840ab001', name: 'Margarita', since: '1968-12-21T00:00:00.000Z', lastModif: '2015-02-21T09:01:42.206Z' },

  { _id: '590971d9e11dfc43f9004d0d', category: '58f4dfff45dab98a840aa001', kind: '58f4dfff45dab98a840ab001', name: 'Muffin', lastModif: '2017-05-03T05:59:53.121Z',"since":"1968-12-21T00:00:00.000Z"},
  { _id: '5909711ee11dfc43f9004d0c', category: '58f4dfff45dab98a840aa001', kind: '58f4dfff45dab98a840ab006', name: 'Croissant', lastModif: '2017-05-03T05:56:46.450Z',"since":"1968-12-21T00:00:00.000Z","__v":0,"id":"5909711ee11dfc43f9004d0c"},
  { _id: '5909710ae11dfc43f9004d0b', category: '58f4dfff45dab98a840aa001', kind: '58f4dfff45dab98a840ab006', name: 'Café gourmand', lastModif: '2017-05-03T05:56:26.532Z',"since":"1968-12-21T00:00:00.000Z","__v":0,"id":"5909710ae11dfc43f9004d0b"},
  { _id: '59096ffee11dfc43f9004cf8', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab006', name: 'Crêpes', lastModif: '2017-05-03T05:51:58.105Z',"since":"1968-12-21T00:00:00.000Z","__v":0,"id":"59096ffee11dfc43f9004cf8"},
  { _id: '590866a01e82e670e77dae6e', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab007', name: 'Couscous', lastModif: '2017-05-02T10:59:44.355Z',"since":"1968-12-21T00:00:00.000Z","__v":0,"id":"590866a01e82e670e77dae6e"},
  { _id: '5908660d1e82e670e77dae6b', category: '58f4dfff45dab98a840aa000', kind: '58f4dfff45dab98a840ab007', name: 'Moussaka', lastModif: '2017-05-02T10:57:17.491Z',"since":"1968-12-21T00:00:00.000Z","__v":0,"id":"5908660d1e82e670e77dae6b"},
];

export const initialPlaces = [
  { _id: '58f4dfff45dab98a840c0000', googleMapId: '5b40b93c6bc637ac86fa472d20160253957e0151', name: 'Papà Raffaele', items: [], lastModif: '2017-04-17T17:04:05.950Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [3.0651635000000397, 50.6403954], type: 'Point' } },
  { _id: '58f4e17c45dab98a840c0001', googleMapId: '182a1308c38dd5c5743235d550805305bc6b3c51', name: 'Le Lion Bossu', items: [], lastModif: '2017-04-17T17:09:01.130Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [3.06502839999996, 50.64030820000001], type: 'Point' } },
  { _id: '58f4e1a545dab98a840c0002', googleMapId: 'd593bd43feeceff2668431cadcbf3bf385616227', name: 'douss kreoline lille', items: [], lastModif: '2017-04-17T17:00:19.699Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [3.0653016999999636, 50.6402057], type: 'Point' } },
  { _id: '58f628e25a333aff739c0003', googleMapId: 'de2fb83328598ce9a8a0ced9a75fe077818b6c92', name: 'Drapri Claude', items: [], lastModif: '2017-04-18T14:55:30.633Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [3.0072533999999678, 50.55972489999999], type: 'Point' } },
  { _id: '58f62aa95a333aff739c0004', googleMapId: '36b6fd3a391c414efd0b62a9919e4b945d7f8d7b', name: 'Via Istanbul', items: [], lastModif: '2017-04-18T15:03:05.969Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [3.028566299999966, 50.5507048], type: 'Point' } },
  { _id: '58f62aa95a333aff739c0005', googleMapId: '3f9cee9e4cb5e07f12dc2cdf3369356f368cfcec', name: 'Les Rois Fainéants', items: [], lastModif: '2017-04-18T15:03:05.969Z', since: '1968-12-21T00:00:00.000Z', location: { coordinates: [3.0177912000000333, 50.5750322], type: 'Point' } },

  {"_id":"5908662850a7934d128ff76d","googleMapId":"adbde43556cac433aabfca4b3203601bb21b5c0c","__v":0,"name":"Greco Restaurant","items":[],"lastModif":"2017-05-02T10:57:44.465Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.606394000000023,50.715748],"type":"Point"}},
  {"_id":"590866b650a7934d128ff76e","googleMapId":"c5f6c0fafa4cc7f802a5b39b1156349636595f6b","__v":0,"name":"Dounia El Jari sprl","items":[],"lastModif":"2017-05-02T11:00:06.667Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.607391499999949,50.71455520000001],"type":"Point"}},
  {"_id":"59087fe150a7934d128ff76f","googleMapId":"8013f04eb4f826ca9bca48e23a3a0ec23f52bc8e","__v":0,"name":"Brasserie de L'Esplanade","items":[],"lastModif":"2017-05-02T12:49:17.522Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.6172897999999805,50.6717622],"type":"Point"}},
  {"_id":"5908800450a7934d128ff770","googleMapId":"4c044c48a3518c22eb5c1f13044e961fde334514","__v":0,"name":"Trattoria by RN","items":[],"lastModif":"2017-05-02T12:51:01.814Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.6211000000000695,50.66952],"type":"Point"}},
  {"_id":"5908803a50a7934d128ff771","googleMapId":"b80fe014ac0845bef475f26616714bc3749fdf5b","__v":0,"name":"Piano (Le)","items":[],"lastModif":"2017-05-02T12:48:58.888Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.609261100000026,50.6712021],"type":"Point"}},
  {"_id":"5908804250a7934d128ff772","googleMapId":"4d15aa025cf2c8b38b45e39604695df887843b83","__v":0,"name":"Sea grill","items":[],"lastModif":"2017-05-02T12:49:06.098Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.607227400000056,50.7007421],"type":"Point"}},
  {"_id":"5908805750a7934d128ff773","googleMapId":"3d31871b22919a379cd444ba00a3fe160b346b10","__v":0,"name":"Le Petit Vingtième","items":[],"lastModif":"2017-05-02T12:49:27.207Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.613054000000034,50.671404],"type":"Point"}},
  {"_id":"5908806850a7934d128ff774","googleMapId":"310d50d7d0dd89cd496bdc613c83451229e8de9f","__v":0,"name":"La Baïta","items":[],"lastModif":"2017-05-02T12:49:44.909Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.614378399999964,50.6818029],"type":"Point"}},
  {"_id":"5909700e50a7934d128ff775","googleMapId":"a5a4b10936a3192f79dfe6846eba20dd93fe78b4","__v":0,"name":"La CREPERIE","items":[],"lastModif":"2017-05-03T05:52:14.622Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.351449000000002,50.840829],"type":"Point"}},
  {"_id":"5909703550a7934d128ff776","googleMapId":"0945a66e7052ca9fd7765375c1c1b919f5cc323a","__v":0,"name":"سيكونت","items":[],"lastModif":"2017-05-03T05:52:53.627Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.351549900000009,50.8427501],"type":"Point"}},
  {"_id":"5909704350a7934d128ff777","googleMapId":"58acc435c45d585c7a33898a0253a1d0988e94d6","__v":0,"name":"AL JANNAH","items":[],"lastModif":"2017-05-03T05:53:07.408Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.349674999999934,50.83988],"type":"Point"}},
  {"_id":"5909705150a7934d128ff778","googleMapId":"754446f7dec74e042827916202f0e2ff5a5930ab","__v":0,"name":"Snack tout près...","items":[],"lastModif":"2017-05-03T05:53:21.795Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.360938900000065,50.8516503],"type":"Point"}},
  {"_id":"5909705850a7934d128ff779","googleMapId":"fd0f68b7915c35749dcbbfa0838b77dab9e2207b","__v":0,"name":"Comptoir Royal","items":[],"lastModif":"2017-05-03T05:53:28.306Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.364385200000015,50.8511349],"type":"Point"}},
  {"_id":"5909706850a7934d128ff77a","googleMapId":"4c4c56737dc60d6d8ccb567757ce11cd8d3ac2aa","__v":0,"name":"Ресторан Свежих Морепродуктов","items":[],"lastModif":"2017-05-03T05:53:44.215Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.342297799999983,50.84040719999999],"type":"Point"}},
  {"_id":"5909709150a7934d128ff77b","googleMapId":"251c90f6b6b5fd4e611a9be98f085272be59f6eb","__v":0,"name":"Athènes","items":[],"lastModif":"2017-05-03T05:54:25.888Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.3406437999999525,50.8372161],"type":"Point"}},
  {"_id":"590970ab50a7934d128ff77c","googleMapId":"a45a89d1aeaf88ee4a3235507172578047694245","__v":0,"name":"Chellala","items":[],"lastModif":"2017-05-03T05:54:51.648Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.339898400000038,50.837056],"type":"Point"}},
  {"_id":"590970cf50a7934d128ff77d","googleMapId":"5ea02ec0fadba678b296001dc8e06e6a202e7131","__v":0,"name":"Quick","items":[],"lastModif":"2017-05-03T05:55:27.576Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.337700100000006,50.8362771],"type":"Point"}},
  {"_id":"5909720950a7934d128ff77e","googleMapId":"2813ba140fb10051f64d3616c264542318332b1e","__v":0,"name":"Panos","items":[],"lastModif":"2017-05-03T06:03:02.290Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.337752300000034,50.836015],"type":"Point"}},

];

export const initialMarkAggregates = [
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


  {"_id":"59097296e11dfc43f9004d10","item":"5909711ee11dfc43f9004d0c","place":"5909720950a7934d128ff77e","markOverall":2,"markFood":2,"markPlace":1,"nbMarksOverall":1,"nbMarksFood":1,"nbMarksPlace":1,"nbMarksStaff":1,"__v":0,"lastModif":"2017-05-03T06:03:02.481Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.337752300000034,50.836015],"type":"Point"}},
  {"_id":"59097209e11dfc43f9004d0e","item":"590971d9e11dfc43f9004d0d","place":"5909720950a7934d128ff77e","markOverall":2,"markFood":2,"markPlace":1,"nbMarksOverall":1,"nbMarksFood":1,"nbMarksPlace":1,"nbMarksStaff":1,"__v":0,"lastModif":"2017-05-03T06:00:41.428Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.337752300000034,50.836015],"type":"Point"}},
  {"_id":"590970cfe11dfc43f9004d09","item":"58f4dfff45dab98a840b0002","place":"590970cf50a7934d128ff77d","markOverall":1,"nbMarksOverall":1,"nbMarksFood":null,"nbMarksPlace":null,"nbMarksStaff":null,"__v":0,"lastModif":"2017-05-03T05:55:27.780Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.337700100000006,50.8362771],"type":"Point"}},
  {"_id":"590970abe11dfc43f9004d07","item":"590866a01e82e670e77dae6e","place":"590970ab50a7934d128ff77c","markOverall":2,"nbMarksOverall":1,"nbMarksFood":null,"nbMarksPlace":null,"nbMarksStaff":null,"__v":0,"lastModif":"2017-05-03T05:54:51.800Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.339898400000038,50.837056],"type":"Point"}},
  {"_id":"59097092e11dfc43f9004d05","item":"5908660d1e82e670e77dae6b","place":"5909709150a7934d128ff77b","markOverall":3,"nbMarksOverall":1,"nbMarksFood":null,"nbMarksPlace":null,"nbMarksStaff":null,"__v":0,"lastModif":"2017-05-03T05:54:26.062Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.3406437999999525,50.8372161],"type":"Point"}},
  {"_id":"59097068e11dfc43f9004d03","item":"590866a01e82e670e77dae6e","place":"5909706850a7934d128ff77a","markOverall":1,"nbMarksOverall":1,"nbMarksFood":null,"nbMarksPlace":null,"nbMarksStaff":null,"__v":0,"lastModif":"2017-05-03T05:53:44.342Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.342297799999983,50.84040719999999],"type":"Point"}},
  {"_id":"59097058e11dfc43f9004d01","item":"590866a01e82e670e77dae6e","place":"5909705850a7934d128ff779","markOverall":2,"nbMarksOverall":1,"nbMarksFood":null,"nbMarksPlace":null,"nbMarksStaff":null,"__v":0,"lastModif":"2017-05-03T05:53:28.470Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.364385200000015,50.8511349],"type":"Point"}},
  {"_id":"59097051e11dfc43f9004cff","item":"590866a01e82e670e77dae6e","place":"5909705150a7934d128ff778","markOverall":1,"nbMarksOverall":1,"nbMarksFood":null,"nbMarksPlace":null,"nbMarksStaff":null,"__v":0,"lastModif":"2017-05-03T05:53:21.961Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.360938900000065,50.8516503],"type":"Point"}},
  {"_id":"59097043e11dfc43f9004cfd","item":"590866a01e82e670e77dae6e","place":"5909704350a7934d128ff777","markOverall":2,"nbMarksOverall":1,"nbMarksFood":null,"nbMarksPlace":null,"nbMarksStaff":null,"__v":0,"lastModif":"2017-05-03T05:53:07.563Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.349674999999934,50.83988],"type":"Point"}},
  {"_id":"59097035e11dfc43f9004cfb","item":"590866a01e82e670e77dae6e","place":"5909703550a7934d128ff776","markOverall":1,"nbMarksOverall":1,"nbMarksFood":null,"nbMarksPlace":null,"nbMarksStaff":null,"__v":0,"lastModif":"2017-05-03T05:52:53.799Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.351549900000009,50.8427501],"type":"Point"}},
  {"_id":"5909700ee11dfc43f9004cf9","item":"59096ffee11dfc43f9004cf8","place":"5909700e50a7934d128ff775","markOverall":3,"nbMarksOverall":1,"nbMarksFood":null,"nbMarksPlace":null,"nbMarksStaff":null,"__v":0,"lastModif":"2017-05-03T05:52:14.809Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.351449000000002,50.840829],"type":"Point"}},
  {"_id":"590880691e82e670e77dae81","item":"58f4dfff45dab98a840b0005","place":"5908806850a7934d128ff774","markOverall":2,"markFood":2,"markPlace":3,"nbMarksOverall":1,"nbMarksFood":1,"nbMarksPlace":1,"nbMarksStaff":1,"__v":0,"lastModif":"2017-05-02T12:49:45.196Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.614378399999964,50.6818029],"type":"Point"}},
  {"_id":"590880571e82e670e77dae7f","item":"58f4dfff45dab98a840b0005","place":"5908805750a7934d128ff773","markOverall":3,"markFood":3,"markPlace":3,"nbMarksOverall":1,"nbMarksFood":1,"nbMarksPlace":1,"nbMarksStaff":1,"__v":0,"lastModif":"2017-05-02T12:49:27.415Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.613054000000034,50.671404],"type":"Point"}},
  {"_id":"5908804d1e82e670e77dae7d","item":"58f4dfff45dab98a840b0005","place":"59087fe150a7934d128ff76f","markOverall":3,"markFood":3,"markPlace":3,"nbMarksOverall":1,"nbMarksFood":1,"nbMarksPlace":1,"nbMarksStaff":1,"__v":0,"lastModif":"2017-05-02T12:49:17.723Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.6172897999999805,50.6717622],"type":"Point"}},
  {"_id":"590880421e82e670e77dae7b","item":"58f4dfff45dab98a840b0005","place":"5908804250a7934d128ff772","markOverall":2,"markFood":2,"markPlace":2,"nbMarksOverall":1,"nbMarksFood":1,"nbMarksPlace":1,"nbMarksStaff":1,"__v":0,"lastModif":"2017-05-02T12:49:06.396Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.607227400000056,50.7007421],"type":"Point"}},
  {"_id":"5908803b1e82e670e77dae79","item":"58f4dfff45dab98a840b0005","place":"5908803a50a7934d128ff771","markOverall":2,"markFood":2,"markPlace":2,"nbMarksOverall":1,"nbMarksFood":1,"nbMarksPlace":1,"nbMarksStaff":1,"__v":0,"lastModif":"2017-05-02T12:48:59.030Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.609261100000026,50.6712021],"type":"Point"}},
  {"_id":"590880341e82e670e77dae77","item":"58f4dfff45dab98a840b0005","place":"5908800450a7934d128ff770","markOverall":2,"markFood":2,"markPlace":2,"nbMarksOverall":1,"nbMarksFood":1,"nbMarksPlace":1,"nbMarksStaff":1,"__v":0,"lastModif":"2017-05-02T12:48:52.698Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.6211000000000695,50.66952],"type":"Point"}},
  {"_id":"590880261e82e670e77dae75","item":"58f4dfff45dab98a840b0001","place":"5908800450a7934d128ff770","markOverall":3,"markFood":3,"markPlace":2,"nbMarksOverall":1,"nbMarksFood":1,"nbMarksPlace":1,"nbMarksStaff":1,"__v":0,"lastModif":"2017-05-02T12:48:38.295Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.6211000000000695,50.66952],"type":"Point"}},
  {"_id":"590880051e82e670e77dae73","item":"58f4dfff45dab98a840b0000","place":"5908800450a7934d128ff770","markOverall":4,"markFood":4,"markPlace":3.5,"nbMarksOverall":2,"nbMarksFood":2,"nbMarksPlace":2,"nbMarksStaff":2,"__v":0,"markStaff":5,"lastModif":"2017-05-02T12:48:05.111Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.6211000000000695,50.66952],"type":"Point"}},
  {"_id":"59087fe11e82e670e77dae71","item":"58f4dfff45dab98a840b0007","place":"59087fe150a7934d128ff76f","markOverall":3,"markFood":3,"markPlace":2,"nbMarksOverall":1,"nbMarksFood":1,"nbMarksPlace":1,"nbMarksStaff":1,"__v":0,"lastModif":"2017-05-02T12:47:29.673Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.6172897999999805,50.6717622],"type":"Point"}},
  {"_id":"590866b61e82e670e77dae6f","item":"590866a01e82e670e77dae6e","place":"590866b650a7934d128ff76e","markOverall":3,"markFood":3,"markPlace":3,"nbMarksOverall":1,"nbMarksFood":1,"nbMarksPlace":1,"nbMarksStaff":1,"__v":0,"lastModif":"2017-05-02T11:00:06.841Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.607391499999949,50.71455520000001],"type":"Point"}},
  {"_id":"590866281e82e670e77dae6c","item":"5908660d1e82e670e77dae6b","place":"5908662850a7934d128ff76d","markOverall":3,"markFood":3,"markPlace":2,"nbMarksOverall":1,"nbMarksFood":1,"nbMarksPlace":1,"nbMarksStaff":1,"__v":0,"lastModif":"2017-05-02T10:57:44.624Z","since":"1968-12-21T00:00:00.000Z","location":{"coordinates":[4.606394000000023,50.715748],"type":"Point"}},
];

export const initialMarkIndividuals = [
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

  {"_id":"59097296e11dfc43f9004d11","markAggregate":"59097296e11dfc43f9004d10","markOverall":2,"markFood":2,"markPlace":1,"markStaff":3,"__v":0,"lastModif":"2017-05-03T06:03:02.484Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"59097209e11dfc43f9004d0f","markAggregate":"59097209e11dfc43f9004d0e","markOverall":2,"markFood":2,"markPlace":1,"markStaff":3,"__v":0,"lastModif":"2017-05-03T06:00:41.431Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"590970cfe11dfc43f9004d0a","markAggregate":"590970cfe11dfc43f9004d09","markOverall":1,"__v":0,"lastModif":"2017-05-03T05:55:27.783Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"590970abe11dfc43f9004d08","markAggregate":"590970abe11dfc43f9004d07","markOverall":2,"__v":0,"lastModif":"2017-05-03T05:54:51.803Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"59097092e11dfc43f9004d06","markAggregate":"59097092e11dfc43f9004d05","markOverall":3,"__v":0,"lastModif":"2017-05-03T05:54:26.065Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"59097068e11dfc43f9004d04","markAggregate":"59097068e11dfc43f9004d03","markOverall":1,"__v":0,"lastModif":"2017-05-03T05:53:44.345Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"59097058e11dfc43f9004d02","markAggregate":"59097058e11dfc43f9004d01","markOverall":2,"__v":0,"lastModif":"2017-05-03T05:53:28.473Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"59097051e11dfc43f9004d00","markAggregate":"59097051e11dfc43f9004cff","markOverall":1,"__v":0,"lastModif":"2017-05-03T05:53:21.964Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"59097043e11dfc43f9004cfe","markAggregate":"59097043e11dfc43f9004cfd","markOverall":2,"__v":0,"lastModif":"2017-05-03T05:53:07.567Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"59097035e11dfc43f9004cfc","markAggregate":"59097035e11dfc43f9004cfb","markOverall":1,"__v":0,"lastModif":"2017-05-03T05:52:53.802Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"5909700ee11dfc43f9004cfa","markAggregate":"5909700ee11dfc43f9004cf9","markOverall":3,"__v":0,"lastModif":"2017-05-03T05:52:14.815Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"590880b61e82e670e77dae83","markAggregate":"590880051e82e670e77dae73","markOverall":5,"markFood":5,"markPlace":5,"markStaff":5,"__v":0,"lastModif":"2017-05-02T12:51:02.130Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"590880691e82e670e77dae82","markAggregate":"590880691e82e670e77dae81","markOverall":2,"markFood":2,"markPlace":3,"markStaff":2,"__v":0,"lastModif":"2017-05-02T12:49:45.207Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"590880571e82e670e77dae80","markAggregate":"590880571e82e670e77dae7f","markOverall":3,"markFood":3,"markPlace":3,"markStaff":3,"__v":0,"lastModif":"2017-05-02T12:49:27.419Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"5908804d1e82e670e77dae7e","markAggregate":"5908804d1e82e670e77dae7d","markOverall":3,"markFood":3,"markPlace":3,"markStaff":3,"__v":0,"lastModif":"2017-05-02T12:49:17.728Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"590880421e82e670e77dae7c","markAggregate":"590880421e82e670e77dae7b","markOverall":2,"markFood":2,"markPlace":2,"markStaff":2,"__v":0,"lastModif":"2017-05-02T12:49:06.402Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"5908803b1e82e670e77dae7a","markAggregate":"5908803b1e82e670e77dae79","markOverall":2,"markFood":2,"markPlace":2,"markStaff":2,"__v":0,"lastModif":"2017-05-02T12:48:59.038Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"590880341e82e670e77dae78","markAggregate":"590880341e82e670e77dae77","markOverall":2,"markFood":2,"markPlace":2,"markStaff":2,"__v":0,"lastModif":"2017-05-02T12:48:52.704Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"590880261e82e670e77dae76","markAggregate":"590880261e82e670e77dae75","markOverall":3,"markFood":3,"markPlace":2,"markStaff":3,"__v":0,"lastModif":"2017-05-02T12:48:38.301Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"590880051e82e670e77dae74","markAggregate":"590880051e82e670e77dae73","markOverall":3,"markFood":3,"markPlace":2,"markStaff":3,"__v":0,"lastModif":"2017-05-02T12:48:05.116Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"59087fe11e82e670e77dae72","markAggregate":"59087fe11e82e670e77dae71","markOverall":3,"markFood":3,"markPlace":2,"markStaff":3,"__v":0,"lastModif":"2017-05-02T12:47:29.678Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"590866b61e82e670e77dae70","markAggregate":"590866b61e82e670e77dae6f","markOverall":3,"markFood":3,"markPlace":3,"markStaff":3,"__v":0,"lastModif":"2017-05-02T11:00:06.846Z","since":"1968-12-21T00:00:00.000Z"},
  {"_id":"590866281e82e670e77dae6d","markAggregate":"590866281e82e670e77dae6c","markOverall":3,"markFood":3,"markPlace":2,"markStaff":3,"__v":0,"lastModif":"2017-05-02T10:57:44.628Z","since":"1968-12-21T00:00:00.000Z"},
];




export default function insertInitialData() {
  console.log('{   insertInitialData()');

  const initialUserObjects = initialUsers.map(data => new User(data));
  const initialCategoryObjects = initialCategories.map(data => new Category(data));
  const initialKindObjects = initialKinds.map(data => new Kind(data));
  const initialItemObjects = initialItems.map(data => new Item(data));
  const initialPlacesObjects = initialPlaces.map(data => new Place(data));
  const initialMarkAggregateObjects = initialMarkAggregates.map(data => new MarkAggregate(data));
  const initialMarkIndividualObjects = initialMarkIndividuals.map(data => new MarkIndividual(data));
  // Create test users after removing any existing one
  User.find({ since: '1968-12-21T00:00:00.000Z' }).remove().exec()
    .then(User.create(initialUserObjects, (err2) => {
      if (err2) console.log('    User.create err=', err2);
    }))

  // Create new test kinds after removing any existing one
    .then(Kind.find({ since: '1968-12-21T00:00:00.000Z' }).remove().exec())
    .then(Kind.create(initialKindObjects, (err3) => {
      if (err3) console.log('    Kind.create err=', err3);
    }))

  // Create new test items after removing any existing one
    .then(Category.find({ since: '1968-12-21T00:00:00.000Z' }).remove().exec())
    .then(Category.create(initialCategoryObjects, (err3) => {
      if (err3) console.log('    Category.create err=', err3);
    }))

  // Create new test items after removing any existing one
    .then(Item.find({ since: '1968-12-21T00:00:00.000Z' }).remove().exec())
    .then(Item.create(initialItemObjects, (err3) => {
      if (err3) console.log('    Item.create err=', err3);
    }))

  // Create new test places after removing any existing one
    .then(Place.find({ since: '1968-12-21T00:00:00.000Z' }).remove().exec())
    .then(Place.create(initialPlacesObjects, (err4) => {
      if (err4) console.log('    Place.create err=', err4);
    }))

  // Create new test marks after removing any existing one
    .then(MarkAggregate.find({ since: '1968-12-21T00:00:00.000Z' }).remove().exec())
    .then(MarkAggregate.create(initialMarkAggregateObjects, (err5) => {
      if (err5) console.log('    MarkAggregate.create err=', err5);
    }))

  // Create new test marks after removing any existing one
    .then(MarkIndividual.find({ since: '1968-12-21T00:00:00.000Z' }).remove().exec())
    .then(MarkIndividual.create(initialMarkIndividualObjects, (err6) => {
      if (err6) console.log('    MarkIndividual.create err=', err6);
    }))

  // Display collection counts
    .then(() => {
      User.find({ since: '1968-12-21T00:00:00.000Z' }).count((err5, results) => {
        if (err5) return console.error(err5);
        const expectedCount = initialUsers.length;
        const test = results === expectedCount ? 'OK' : `KO (should be ${expectedCount.length})`;
        console.log(`# Users: ${results} ${test}`);
        return results;
      });
      Kind.find({ since: '1968-12-21T00:00:00.000Z' }).count((errKind, results) => {
        if (errKind) return console.error(errKind);
        const expectedCount = initialKinds.length;
        const test = results === expectedCount ? 'OK' : `KO (should be ${expectedCount.length})`;
        console.log(`# Kinds: ${results} ${test}`);
        return results;
      });
      Category.find({ since: '1968-12-21T00:00:00.000Z' }).count((errCategory, results) => {
        if (errCategory) return console.error(errCategory);
        const expectedCount = initialCategories.length;
        const test = results === expectedCount ? 'OK' : `KO (should be ${expectedCount.length})`;
        console.log(`# Categories: ${results} ${test}`);
        return results;
      });
      Item.find({ since: '1968-12-21T00:00:00.000Z' }).count((err6, results) => {
        if (err6) return console.error(err6);
        const expectedCount = initialItems.length;
        const test = results === expectedCount ? 'OK' : `KO (should be ${expectedCount.length})`;
        console.log(`# Items: ${results} ${test}`);
        return results;
      });
      Place.find({ since: '1968-12-21T00:00:00.000Z' }).count((err7, results) => {
        if (err7) return console.error(err7);
        const expectedCount = initialPlaces.length;
        const test = results === expectedCount ? 'OK' : `KO (should be ${expectedCount.length})`;
        console.log(`# Places: ${results} ${test}`);
        return results;
      });
      MarkAggregate.find({ since: '1968-12-21T00:00:00.000Z' }).count((err8, results) => {
        if (err8) return console.error(err8);
        const expectedCount = initialMarkAggregates.length;
        const test = results === expectedCount ? 'OK' : `KO (should be ${expectedCount.length})`;
        console.log(`# MarkAggregate: ${results} ${test}`);
        return results;
      });
      MarkIndividual.find({ since: '1968-12-21T00:00:00.000Z' }).count((err8, results) => {
        if (err8) return console.error(err8);
        const expectedCount = initialMarkIndividuals.length;
        const test = results === expectedCount ? 'OK' : `KO (should be ${expectedCount.length})`;
        console.log(`# MarkIndividual: ${results} ${test}`);
        return results;
      });
    });

  console.log('}   insertInitialData()');
}