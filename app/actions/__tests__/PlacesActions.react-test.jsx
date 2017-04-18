import * as c from '../../utils/constants';
import { setCurrentPlaces } from '../PlacesActions';

describe('PlacesActions', () => {
  it('should return the correct constant', () => {
    const places = [{ id: 1 }, { id: 2 }];
    expect(setCurrentPlaces(places)).toEqual({
      type: c.SET_CURRENT_PLACES,
      places,
    });
  });
});
