

export function distanceInKm(lat1, lon1, lat2, lon2) {
  const p = 0.017453292519943295;    // Math.PI / 180
  const c = Math.cos;
  const a = (0.5 - (c((lat2 - lat1) * p) / 2)) + (c(lat1 * p) * c(lat2 * p) * ((1 - c((lon2 - lon1) * p)) / 2));
  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}


export function formatDistance(distance) {
  if (distance >= 5) {
    return `${Math.round(distance)}km`; // > 5km: rounded to nearest km
  } else if (distance >= 1) {
    return `${Math.round(distance * 10) / 10}km`; // > 1km: rounded to nearest x.x km
  } else if (distance >= 0.3) {
    return `${Math.round(distance * 10) * 100}m`; // > 300m: rounded to nearest hundred of m
  }
  return `${Math.round(distance * 100) * 10}m`;  // < 300m: rounded to nearest tens of m
}
