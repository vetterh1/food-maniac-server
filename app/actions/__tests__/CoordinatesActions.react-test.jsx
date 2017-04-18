import * as c from '../../utils/constants';
import { setCurrentLocation } from '../CoordinatesActions';

describe('CoordinatesActions', () => {
  it('should return the correct constant', () => {
    const latitude = 50.1253;
    const longitude = -3.32187;
    const real = true;
    expect(setCurrentLocation(latitude, longitude, real)).toEqual({
      type: c.SET_CURRENT_LOCATION,
      latitude, // property value shorthand for latitude: latitude,
      longitude, // property value shorthand for longitude: longitude
      real,
    });
  });
});
