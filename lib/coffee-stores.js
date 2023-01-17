import { createApi } from 'unsplash-js';

const unsplash = createApi({ accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY });

async function getPhotosUrls() {
  const unsplashPhotos = await unsplash.search.getPhotos({
    query: 'coffee shop',
    perPage: 40
  });
  const unsplashResults = unsplashPhotos.response.results;
  return unsplashResults.map(result => result.urls['small']);
}

export async function fetchCoffeeStores(
  latLong = '43.65267326999575,-79.39545615725015', 
  limit = 6
) {
  const photosUrls = await getPhotosUrls();

  const searchParams = new URLSearchParams({
    query: 'coffee',
    ll: latLong,
    sort: 'DISTANCE', 
    limit: limit
  });
  const response = await fetch(
    `https://api.foursquare.com/v3/places/search?${searchParams}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `${process.env.NEXT_PUBLIC_FOURSQUARE_AUTH_KEY}`,
      }
    }
  );
  const data = await response.json();
  
  return data.results.map((venue, id) => {
    return {
      id: venue.fsq_id,
      name: venue.name, 
      address: venue.location.address || '',
      neighbourhood: venue.location.neighborhood || venue.location.crossStreet || '',
      imgUrl: photosUrls[id]
    }
  });
}
