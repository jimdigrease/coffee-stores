import { useContext, useState } from 'react';

import { ACTION_TYPES, StoreContext } from '../store/store-context';

function useTrackLocation() {
  const [locationErrorMsg, setLocationErrorMsg] = useState('');
  const [isFindingLocation, setIsFindingLocation] = useState(false);
  //const [latLong, setLatLong] = useState('');
  const { dispatch } = useContext(StoreContext);

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    //setLatLong(`${latitude},${longitude}`);
    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: { latLong: `${latitude},${longitude}` }
    })
    setLocationErrorMsg('');
    setIsFindingLocation(false);
  };

  function error() {
    setLocationErrorMsg('Unable to retrieve your location');
    setIsFindingLocation(false);
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);

    if (!navigator.geolocation) {
      setLocationErrorMsg("Geolocation is not supported by your browser");
      setIsFindingLocation(false);
    } else {
      // status.textContent = "Locating…";
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    //latLong,
    handleTrackLocation,
    locationErrorMsg, 
    isFindingLocation
  };
};

export default useTrackLocation;
