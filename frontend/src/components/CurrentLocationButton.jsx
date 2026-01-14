import { useState } from 'react';
import { FaLocationArrow } from 'react-icons/fa';
import '../styles/CurrentLocationButton.css';

const CurrentLocationButton = ({ onLocationFound }) => {
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleCurrentLocation = () => {
    setGettingLocation(true);

    if (!navigator.geolocation) {
      alert('Your browser does not support geolocation.');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (onLocationFound) {
          onLocationFound(latitude, longitude);
        }
        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Could not retrieve your location.';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'You denied access to your location';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Position information is not available.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Timeout! try again!';
            break;
        }
        
        alert(errorMessage);
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <button 
      className="current-location-button"
      onClick={handleCurrentLocation}
      disabled={gettingLocation}
      type="button"
    >
      <FaLocationArrow className="location-icon" />
      {gettingLocation ? 'Downloading...' : 'My Position'}
    </button>
  );
};

export default CurrentLocationButton;