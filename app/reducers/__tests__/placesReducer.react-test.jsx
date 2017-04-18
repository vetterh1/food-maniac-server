import placesReducer from '../placesReducer';
import { setCurrentPlaces } from '../../actions/PlacesActions';

describe('placesReducer', () => {
  it('should return an empty initial state', () => {
    const action = {};
    expect(placesReducer(undefined, action)).toEqual({
      places: [],
    });
  });

  it('should handle the setCurrentPlaces action', () => {
    const places = [{ id: 1 }, { id: 2 }];
    expect(placesReducer(undefined, setCurrentPlaces(places))).toEqual({
      places
    });
  });

});
